---
name: capacity-briefing
description: Daily capacity digest from eResource Scheduler. Ranks who is overloaded, tight, available, or off for a date range. Use when someone says "morning briefing", "who is free this week", "capacity", "overload", "what should I focus on today", or "pipeline summary" for resources.
---

# Capacity briefing

Read-only digest of resource load for a date range. Print it in chat. Do not write bookings.

## Safety

- Use only the connected `ers` MCP server. Do not invent resource or booking IDs.
- If MCP is missing or auth fails: stop. Tell the user to connect at **Settings → Tools & MCP → ers → Connect**.
- Never delete. Confirm in chat before any create/update.

## Steps

1. Date range: use what the user named. Else **current week** (Mon–Sun) in their timezone. ISO dates (`YYYY-MM-DD`).
2. Load resources and their bookings / availability / time off for that range via `ers` MCP tools.
3. Classify each resource (a person can appear in only the most severe bucket):

| Bucket | Criteria |
|---|---|
| Overloaded | booked hours > working capacity |
| Tight | booked ≥ 80% of capacity |
| Available | booked < 80% and has remaining hours |
| Off | fully unavailable (leave / holiday) |

4. Print the brief. Cap each bucket at 15 names; note the remainder count.

## Output

```markdown
# Capacity briefing — <range>

- Resources: <n> · Overloaded: <n> · Tight: <n> · Available: <n> · Off: <n>

## Overloaded
- <name> — <booked>h / <capacity>h (<pct>%) · <top project>

## Tight
- <name> — <booked>h / <capacity>h

## Available
- <name> — <remaining>h free

## Off
- <name> — <reason if known>
```

If a needed tool is missing, say so and show a partial brief from what you could read.
