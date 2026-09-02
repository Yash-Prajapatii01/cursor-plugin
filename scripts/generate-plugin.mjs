#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage() {
  console.log(`Usage: node scripts/generate-plugin.mjs [options]

Generate a Cursor MCP plugin from template/ + config JSON.
Writes plugins/<name>/ plus .cursor-plugin/marketplace.json (cursor/plugin-template layout).

Options:
  -c, --config <file>   Config JSON (default: plugin.config.json)
  -o, --output <dir>    Plugin output directory (default: plugins/<name>)
  -f, --force           Overwrite generated plugin files
  -h, --help            Show this help

Examples:
  cp plugin.config.example.json plugin.config.json
  # edit plugin.config.json, then:
  node scripts/generate-plugin.mjs

  node scripts/generate-plugin.mjs -c examples/ers.plugin.config.json -f
`);
}

function parseArgs(argv) {
  const options = {
    config: path.join(repoRoot, "plugin.config.json"),
    output: null,
    force: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else if (arg === "-f" || arg === "--force") {
      options.force = true;
    } else if (arg === "-c" || arg === "--config") {
      options.config = path.resolve(argv[++i]);
    } else if (arg === "-o" || arg === "--output") {
      options.output = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function requireString(config, key) {
  const value = config[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Config "${key}" must be a non-empty string.`);
  }
  return value.trim();
}

function requireObject(config, key) {
  const value = config[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Config "${key}" must be an object.`);
  }
  return value;
}

function validateConfig(config) {
  requireString(config, "name");
  requireString(config, "displayName");
  requireString(config, "version");
  requireString(config, "description");
  requireString(config, "license");

  const author = requireObject(config, "author");
  requireString(author, "name");
  if (author.email !== undefined && typeof author.email !== "string") {
    throw new Error('Config "author.email" must be a string when provided.');
  }

  requireString(config, "homepage");
  requireString(config, "repository");

  if (!Array.isArray(config.keywords) || config.keywords.length === 0) {
    throw new Error('Config "keywords" must be a non-empty array of strings.');
  }

  const mcp = requireObject(config, "mcp");
  requireString(mcp, "serverKey");
  requireString(mcp, "url");
  if (mcp.type !== undefined && typeof mcp.type !== "string") {
    throw new Error('Config "mcp.type" must be a string when provided.');
  }

  const skill = requireObject(config, "skill");
  requireString(skill, "name");
  requireString(skill, "description");
  if (!Array.isArray(skill.rules) || skill.rules.length === 0) {
    throw new Error('Config "skill.rules" must be a non-empty array of strings.');
  }
  if (!Array.isArray(skill.workflows) || skill.workflows.length === 0) {
    throw new Error('Config "skill.workflows" must be a non-empty array of { goal, tools } objects.');
  }
  for (const workflow of skill.workflows) {
    if (!workflow || typeof workflow !== "object" || Array.isArray(workflow)) {
      throw new Error('Each entry in "skill.workflows" must be an object with goal and tools.');
    }
    requireString(workflow, "goal");
    requireString(workflow, "tools");
  }
}

function buildReplacements(config) {
  const skillRules = config.skill.rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n");
  const skillWorkflowsTable = config.skill.workflows
    .map((workflow) => `| ${workflow.goal} | ${workflow.tools} |`)
    .join("\n");

  return {
    PLUGIN_NAME: config.name,
    DISPLAY_NAME: config.displayName,
    VERSION: config.version,
    DESCRIPTION: config.description,
    AUTHOR_NAME: config.author.name,
    AUTHOR_EMAIL: config.author.email ?? "",
    HOMEPAGE: config.homepage,
    REPOSITORY: config.repository,
    LICENSE: config.license,
    KEYWORDS_JSON: JSON.stringify(config.keywords, null, 2),
    MCP_SERVER_KEY: config.mcp.serverKey,
    MCP_URL: config.mcp.url,
    MCP_TYPE: config.mcp.type ?? "http",
    SKILL_NAME: config.skill.name,
    SKILL_DESCRIPTION: config.skill.description,
    SKILL_RULES: skillRules,
    SKILL_WORKFLOWS_TABLE: skillWorkflowsTable,
    BRAND_COLOR: config.brandColor ?? "#2563EB",
    YEAR: String(new Date().getFullYear()),
    CATEGORY: config.category ?? "productivity",
    TAGS_JSON: JSON.stringify(config.tags ?? config.keywords, null, 2),
    LOGO: config.logo ?? "assets/logo.png",
  };
}

function applyReplacements(content, replacements) {
  return content.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    if (!(key in replacements)) {
      throw new Error(`Unresolved template placeholder: ${match}`);
    }
    return replacements[key];
  });
}

async function walkTemplateFiles(dirPath) {
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

function isDedicatedPluginOutput(outputDir) {
  const pluginsDir = path.join(repoRoot, "plugins");
  const relative = path.relative(pluginsDir, outputDir);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function generatePlugin(options) {
  const config = await readJson(options.config);
  validateConfig(config);

  const replacements = buildReplacements(config);
  const outputDir = options.output ?? path.join(repoRoot, "plugins", config.name);
  const pluginTemplateDir = path.join(repoRoot, "template", "plugin");
  const marketplaceTemplatePath = path.join(repoRoot, "template", "marketplace.json");

  if (await pathExists(outputDir)) {
    if (isDedicatedPluginOutput(outputDir)) {
      if (!options.force) {
        throw new Error(`Output directory already exists: ${outputDir}\nUse --force to overwrite.`);
      }
      await fs.rm(outputDir, { recursive: true, force: true });
    } else if (!options.force) {
      throw new Error(`Output directory already exists: ${outputDir}\nUse --force to overwrite.`);
    }
  }

  const templateFiles = await walkTemplateFiles(pluginTemplateDir);
  for (const templateFile of templateFiles) {
    const relativePath = path.relative(pluginTemplateDir, templateFile);
    const renderedRelativePath = applyReplacements(relativePath, replacements);
    const outputFile = path.join(outputDir, renderedRelativePath);
    const raw = await fs.readFile(templateFile, "utf8");
    const rendered = applyReplacements(raw, replacements);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, rendered, "utf8");
  }

  const marketplaceRaw = await fs.readFile(marketplaceTemplatePath, "utf8");
  const marketplaceRendered = applyReplacements(marketplaceRaw, replacements);
  const marketplaceOut = path.join(repoRoot, ".cursor-plugin", "marketplace.json");
  await fs.mkdir(path.dirname(marketplaceOut), { recursive: true });
  await fs.writeFile(marketplaceOut, marketplaceRendered, "utf8");

  console.log(`Generated Cursor MCP plugin at:\n  ${outputDir}`);
  console.log(`Wrote marketplace manifest at:\n  ${marketplaceOut}`);
  console.log("\nAdd from folder in Cursor (repo root, requires a git commit):");
  console.log(`  ${repoRoot}`);
  console.log("\nOr symlink as a local plugin:");
  console.log(`  mkdir -p ~/.cursor/plugins/local`);
  console.log(`  ln -sf ${outputDir} ~/.cursor/plugins/local/${config.name}`);
  console.log("  Then Developer: Reload Window → Tools & MCP → Connect");
  console.log("\nNext steps:");
  console.log(`  node scripts/validate-plugin.mjs ${path.relative(repoRoot, outputDir) || "."}`);
  console.log("  Push repo to GitHub and submit at https://cursor.com/marketplace/publish");
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    process.exit(0);
  }
  await generatePlugin(options);
} catch (error) {
  console.error(error.message ?? error);
  process.exit(1);
}
