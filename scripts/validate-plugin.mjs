#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const pluginNamePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(filePath, context) {
  let raw;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    addError(`${context} is missing: ${filePath}`);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    addError(`${context} contains invalid JSON (${filePath}): ${error.message}`);
    return null;
  }
}

function normalizeNewlines(content) {
  return content.replace(/\r\n/g, "\n");
}

function parseFrontmatter(content) {
  const normalized = normalizeNewlines(content);
  if (!normalized.startsWith("---\n")) {
    return null;
  }

  const closingIndex = normalized.indexOf("\n---\n", 4);
  if (closingIndex === -1) {
    return null;
  }

  const frontmatterBlock = normalized.slice(4, closingIndex);
  const fields = {};

  for (const line of frontmatterBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    fields[key] = value;
  }

  return fields;
}

async function walkFiles(dirPath) {
  const files = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }

  return files;
}

async function validateFrontmatterFile(filePath, componentName, requiredKeys) {
  const content = await fs.readFile(filePath, "utf8");
  const parsed = parseFrontmatter(content);
  const relativeFile = path.relative(pluginRoot, filePath);

  if (!parsed) {
    addError(`${componentName} file missing YAML frontmatter: ${relativeFile}`);
    return;
  }

  for (const key of requiredKeys) {
    if (!parsed[key] || parsed[key].length === 0) {
      addError(`${componentName} file missing "${key}" in frontmatter: ${relativeFile}`);
    }
  }
}

async function validateComponentFrontmatter() {
  const skillsDir = path.join(pluginRoot, "skills");
  if (await pathExists(skillsDir)) {
    const files = await walkFiles(skillsDir);
    for (const file of files) {
      if (path.basename(file) === "SKILL.md") {
        await validateFrontmatterFile(file, "skill", ["name", "description"]);
      }
    }
  }
}

function extractMcpPath(manifest) {
  const value = manifest.mcpServers;
  if (typeof value === "string") {
    return value;
  }
  return "mcp.json";
}

let pluginRoot = repoRoot;

async function main() {
  const target = process.argv[2] ? path.resolve(process.argv[2]) : repoRoot;
  pluginRoot = target;

  const manifestPath = path.join(pluginRoot, ".cursor-plugin", "plugin.json");
  const manifest = await readJsonFile(manifestPath, "Plugin manifest");
  if (!manifest) {
    summarizeAndExit();
    return;
  }

  if (typeof manifest.name !== "string" || !pluginNamePattern.test(manifest.name)) {
    addError('"name" in plugin.json must be lowercase kebab-case.');
  }

  if (typeof manifest.displayName !== "string" || manifest.displayName.length === 0) {
    addError('"displayName" in plugin.json is required.');
  }

  if (typeof manifest.version !== "string" || manifest.version.length === 0) {
    addError('"version" in plugin.json is required.');
  }

  if (typeof manifest.description !== "string" || manifest.description.length === 0) {
    addError('"description" in plugin.json is required.');
  }

  if (!manifest.author || typeof manifest.author.name !== "string" || manifest.author.name.length === 0) {
    addError('"author.name" in plugin.json is required.');
  }

  if (manifest.logo) {
    const logoPath = path.join(pluginRoot, manifest.logo);
    if (!(await pathExists(logoPath))) {
      addError(`Logo file not found: ${manifest.logo}`);
    }
  } else {
    addWarning("No logo specified in plugin.json.");
  }

  const mcpRelative = extractMcpPath(manifest);
  const mcpPath = path.join(pluginRoot, mcpRelative);
  const mcp = await readJsonFile(mcpPath, "MCP configuration");
  if (mcp) {
    if (!mcp.mcpServers || Object.keys(mcp.mcpServers).length === 0) {
      addError("mcp.json has no servers defined in mcpServers.");
    } else {
      for (const [serverName, serverConfig] of Object.entries(mcp.mcpServers)) {
        if (!serverConfig.url && !serverConfig.command) {
          addError(`MCP server "${serverName}" must define "url" (remote) or "command" (stdio).`);
        }
        if (serverConfig.url && !/^https:\/\//.test(serverConfig.url)) {
          addWarning(`MCP server "${serverName}" URL is not HTTPS: ${serverConfig.url}`);
        }
        const serialized = JSON.stringify(serverConfig);
        if (/Bearer\s+[A-Za-z0-9._-]+/.test(serialized) || /"(CLIENT_SECRET|API_KEY|TOKEN)"\s*:\s*"[^$]/.test(serialized)) {
          addError(`MCP server "${serverName}" appears to contain hardcoded secrets. Use OAuth or plugin variables.`);
        }
      }
    }
  }

  if (/\{\{[A-Z0-9_]+\}\}/.test(JSON.stringify(manifest))) {
    addError("plugin.json still contains unresolved {{PLACEHOLDER}} values.");
  }

  await validateComponentFrontmatter();
  summarizeAndExit();
}

function summarizeAndExit() {
  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
    console.log("");
  }

  if (errors.length > 0) {
    console.error("Validation failed:");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validation passed for ${pluginRoot}`);
}

await main();
