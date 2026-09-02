# eResource Scheduler plugin for Cursor

Connect [Cursor](https://cursor.com) to [eResource Scheduler](https://www.eresourcescheduler.com) via MCP. OAuth is handled by Cursor.

This is a **single plugin** (not a marketplace), matching [cursor/plugin-template](https://github.com/cursor/plugin-template):

```
.cursor-plugin/plugin.json
mcp.json
assets/logo.svg
```

## Install from GitHub

Add this repository in Cursor:

`https://github.com/Yash-Prajapatii01/cursor-plugin`

Then **Settings → Tools & MCP → ers → Connect**.

## Local test

Copy this folder to `~/.cursor/plugins/local/ers` (real files, not a symlink) and reload Cursor.
