# {{DISPLAY_NAME}} plugin for Cursor

Connect [Cursor](https://cursor.com) to [{{DISPLAY_NAME}}]({{HOMEPAGE}}) via MCP. OAuth is handled by Cursor — no API tokens in config files.

## Requirements

- A {{DISPLAY_NAME}} account with MCP access
- Cursor with plugin / MCP support

## Setup

1. Install the **{{DISPLAY_NAME}}** plugin from the [Cursor Marketplace](https://cursor.com/marketplace).
2. Open **Settings → Cursor Settings → Tools & MCP** and confirm the **{{MCP_SERVER_KEY}}** MCP server is listed.
3. Click **Connect** (or type `mcp_auth` in chat if the browser does not open).
4. Sign in and approve the authorization request.
5. Confirm MCP tools appear and are enabled.

## Self-hosted or staging MCP

The plugin points at the hosted MCP endpoint by default:

```
{{MCP_URL}}
```

For a private or staging server, copy `mcp.self-hosted.example.json` to `mcp.json` and set your MCP base URL (must end with `/mcp`). OAuth protected-resource metadata on your MCP host must match that URL exactly.

## What's included

### MCP server

Streamable HTTP MCP at `/mcp` with OAuth.

### Skill

- **{{SKILL_NAME}}** — when to use MCP tools and common workflows.

## Local development

This directory is a **single plugin** (`.cursor-plugin/plugin.json`). Do not add a `marketplace.json`.

```bash
mkdir -p ~/.cursor/plugins/local
ln -sf "$(pwd)" ~/.cursor/plugins/local/{{PLUGIN_NAME}}
```

Reload the window, enable the local plugin under **Customize → Plugins**, then Connect **{{MCP_SERVER_KEY}}** under **Tools & MCP**.

## Publish to Cursor Marketplace

1. Push this repository to a **public** GitHub repo.
2. Ensure `mcp.json` uses your production HTTPS MCP URL and OAuth works end-to-end.
3. Submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).

## License

{{LICENSE}}
