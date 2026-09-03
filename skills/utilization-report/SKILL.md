---
name: utilization-report
description: Utilization rollup from eResource Scheduler — booked or actual hours versus available capacity, per resource and total. Use when someone says "utilization this month", "billable vs available", "utilization report", "how utilized are we", or "capacity vs booked".
---

# Utilization report

Read-only utilization for a date range. Print totals and a per-resource table. Do not change bookings, timesheets, or rates.

## Safety

- Use only the connected `ers` MCP server. Do not invent resource IDs.
- If MCP is missing or auth fails: stop. Tell the user to connect at **Settings → Tools & MCP → ers → Connect**.
- Never delete. Confirm in chat before any create/update. Do not write rate or amount fields.

## Steps

1. Date range: use what the user named. Else **current calendar month**. ISO dates.
2. Optional filter: resource, team, or project if named.
3. Prefer an `ers` utilization/capacity report tool if one exists. Else compute: utilization % = booked (or actual, if the user asked for actuals) ÷ working capacity.
4. Sort by utilization descending. Cap the table at 30 rows; still show the rollup for everyone included.

## Output

```markdown
# Utilization — <range>

- Resources: <n> · Capacity: <h>h · Booked: <h>h · Utilization: <pct>%

| Resource | Capacity | Booked | Util % |
|---|---:|---:|---:|
| <name> | <h> | <h> | <pct>% |
```

If the user asked for actuals/timesheets, add an Actual column instead of or beside Booked. Say which basis you used.
