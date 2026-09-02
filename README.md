# eResource Scheduler plugin for Cursor

Connect [Cursor](https://cursor.com) to [eResource Scheduler](https://www.eresourcescheduler.com) via MCP. This repo is a **single plugin**. Cursor’s **Add from folder** UI still requires a marketplace manifest, so `.cursor-plugin/marketplace.json` lists only this plugin (`source: "."`).

OAuth is handled by Cursor — no API tokens in config files.

## Requirements

- An eResource Scheduler account with MCP access
- Cursor with plugin / MCP support

## Install from this folder

Cursor’s folder picker looks for `.cursor-plugin/marketplace.json`. Use **Add from folder** and select:

```
/Users/enbraun-12/Documents/ers-cursor-plugin
```

The folder must be a git repo **with at least one commit** (`HEAD` must resolve). Then enable **eResource Scheduler** and connect from **Settings → Tools & MCP**.

## Setup (after install)

1. Confirm the **ers** MCP server is listed under **Settings → Tools & MCP**.
2. Click **Connect** (or type `mcp_auth` in chat if the browser does not open).
3. Sign in and approve the authorization request.
4. Confirm MCP tools appear and are enabled.

## Self-hosted or staging MCP

Default endpoint in this checkout:

```
https://test.eresourcescheduler.cloud/mcp
```

Production:

```
https://mcp.eresourcescheduler.cloud/mcp
```

For a private or staging server, copy `mcp.self-hosted.example.json` to `mcp.json` and set your MCP base URL (must end with `/mcp`). OAuth protected-resource metadata on your MCP host must match that URL exactly.

## What's included

### MCP server

Streamable HTTP MCP at `/mcp` with OAuth.

### Skill

- **ers-scheduling** — when to use MCP tools and common workflows.

## Regenerate from config

```bash
cp plugin.config.example.json plugin.config.json
# edit plugin.config.json, then:
npm run generate
npm run validate
```

ERS example:

```bash
npm run generate:ers
npm run validate:ers
```

## Publish to Cursor Marketplace

Submit this repo as a **single plugin**:

1. Push to a **public** GitHub repo.
2. Ensure `mcp.json` uses your production HTTPS MCP URL and OAuth works end-to-end.
3. Submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).

## License

MIT
