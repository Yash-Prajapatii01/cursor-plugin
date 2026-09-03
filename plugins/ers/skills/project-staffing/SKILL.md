---
name: project-staffing
description: Suggests who can staff an eResource Scheduler project from remaining demand vs available capacity. Use when someone says "staff this project", "who can I assign", "fill this project", "resource a project", or "who is free for <project>".
---

# Project staffing

Read remaining project demand, match available resources, and propose assignments. Default is a plan in chat. Creating bookings is opt-in and must be confirmed.

## Safety

- Use only the connected `ers` MCP server. Do not invent resource, project, or booking IDs.
- If MCP is missing or auth fails: stop. Tell the user to connect at **Settings → Tools & MCP → ers → Connect**.
- Never delete. Confirm in chat before any create/update. Do not change rates unless asked.

## Steps

1. Resolve **one** project (name or ID). If several match, ask which one.
2. Date range: project dates if present, else what the user named, else **current week**.
3. Load via `ers` MCP: project, existing bookings on it, remaining hours/roles if available, and resource availability.
4. For each unmet need (role, skill, or leftover hours), list candidates with remaining capacity in range. Prefer already-on-project resources, then same role/type, then anyone with hours left.
5. Print the plan. If the user wants bookings created, show the proposed rows and wait for yes before calling any write tool.

## Output

```markdown
# Staffing — <project> (<range>)

- Demand remaining: <h> · Already booked on project: <h>

## Gaps
- <role or skill> — <h> still needed

## Candidates
- <name> — <remaining>h free · <role/type> · already on project: yes/no

## Proposed bookings (not created)
- <name> · <dates> · <hours>
```

If demand is already covered: say the project is staffed and skip proposals.
