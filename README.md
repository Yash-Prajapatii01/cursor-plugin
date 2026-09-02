# eResource Scheduler plugin for Cursor

Connect [Cursor](https://cursor.com) to [eResource Scheduler](https://www.eresourcescheduler.com) via MCP. OAuth is handled by Cursor.

```
.cursor-plugin/plugin.json
.cursor-plugin/marketplace.json
mcp.json
assets/logo.svg
```

The plugin lives at the repo root (`plugin.json` + `mcp.json`), as Cursor's single-plugin template requires. `marketplace.json` with `"source": "."` is only so Add from folder / Add from GitHub can list that one plugin. There is no nested `plugins/` folder.

## Install

**GitHub:** `https://github.com/Yash-Prajapatii01/cursor-plugin`

**Folder:** this repo root.

Then **Settings → Tools & MCP → ers → Connect**.
