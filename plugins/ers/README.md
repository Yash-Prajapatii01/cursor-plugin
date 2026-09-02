# eResource Scheduler plugin for Cursor

Connect [Cursor](https://cursor.com) to [eResource Scheduler](https://www.eresourcescheduler.com) via MCP. OAuth is handled by Cursor — no API tokens in config files.

## Requirements

- An eResource Scheduler account with MCP access
- Cursor with plugin / MCP support

## Setup

1. Install **eResource Scheduler** from this marketplace (Add from folder on the repo root).
2. Open **Settings → Tools & MCP** and confirm the **ers** MCP server is listed.
3. Click **Connect** (or type `mcp_auth` in chat if the browser does not open).
4. Sign in and approve the authorization request.
5. Confirm MCP tools appear and are enabled.

## Self-hosted or staging MCP

Default endpoint in this checkout:

```
https://test.eresourcescheduler.cloud/mcp
```

For a private or staging server, copy `mcp.self-hosted.example.json` to `mcp.json` and set your MCP base URL (must end with `/mcp`).

## What's included

- **MCP server** — streamable HTTP at `/mcp` with OAuth
- **Skill** — `ers-scheduling` for common ERS workflows
