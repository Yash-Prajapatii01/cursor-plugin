# eResource Scheduler Cursor plugin

Repo layout matches [cursor/plugin-template](https://github.com/cursor/plugin-template): a marketplace manifest at the repo root and one plugin under `plugins/ers`.

```
.cursor-plugin/marketplace.json   # required for Cursor Add from folder
plugins/ers/
  .cursor-plugin/plugin.json      # Cursor Plugin manifest
  mcp.json
  skills/ers-scheduling/SKILL.md
  assets/logo.svg
```

## Add from folder

Select this **repo root** (the folder that contains `.cursor-plugin/marketplace.json`):

```
/Users/enbraun-12/Documents/ers-cursor-plugin
```

Then **Settings → Tools & MCP → ers → Connect**.

## Local plugin symlink (optional)

```bash
mkdir -p ~/.cursor/plugins/local
ln -sf "$(pwd)/plugins/ers" ~/.cursor/plugins/local/ers
```

## Regenerate

```bash
npm run generate:ers
npm run validate:ers
```
