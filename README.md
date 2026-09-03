# eResource Scheduler

Cursor plugin that connects agents to [eResource Scheduler](https://www.eresourcescheduler.com) through ERS's remote [Model Context Protocol](https://modelcontextprotocol.io/) server.

Manage resources, projects, bookings, timesheets, rates, and reports in the signed-in ERS workspace.

## Skills

| Skill | What it does |
|---|---|
| `capacity-briefing` | Who is overloaded, tight, available, or off |
| `booking-conflicts` | Overlapping and over-capacity bookings |
| `project-staffing` | Who can cover remaining project demand |
| `timesheet-gaps` | Missing or under-reported timesheets |
| `utilization-report` | Booked or actual hours vs capacity |

Skills are read-first. Confirm in chat before any create or update. There is no setup skill — connect at **Settings → Tools & MCP → ers → Connect**.

## Install

1. Open **Cursor Settings → Plugins**.
2. Add from GitHub: `https://github.com/Yash-Prajapatii01/cursor-plugin`
3. Click **Install**, then connect at **Settings → Tools & MCP → ers → Connect**.

Or add this repo from a local folder.

## MCP

```json
{
  "mcpServers": {
    "ers": {
      "type": "http",
      "url": "https://test.eresourcescheduler.cloud/mcp"
    }
  }
}
```

Auth is OAuth 2.0 against ERS. Cursor prompts for ERS sign-in when the plugin connects — there is no API key or client ID to configure.

## Notes

- Tool calls run as the ERS user who authorizes the connection and cannot exceed that user's permissions.
- This plugin currently points at the ERS test MCP endpoint.

## Docs

- Product: https://www.eresourcescheduler.com
- Repository: https://github.com/Yash-Prajapatii01/cursor-plugin
- MCP server: https://test.eresourcescheduler.cloud/mcp

## License

MIT
