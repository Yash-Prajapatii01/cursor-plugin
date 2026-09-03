---
name: timesheet-gaps
description: Finds missing or under-reported timesheets in eResource Scheduler versus expected working time or bookings. Use when someone says "who didn't fill timesheets", "missing hours", "timesheet gaps", "incomplete timesheets", or "who hasn't submitted time".
---

# Timesheet gaps

Read-only compare of expected hours vs timesheet entries. Print who is missing or short. Do not submit or edit timesheets unless the user asks, then confirm first.

## Safety

- Use only the connected `ers` MCP server. Do not invent resource or timesheet IDs.
- If MCP is missing or auth fails: stop. Tell the user to connect at **Settings → Tools & MCP → ers → Connect**.
- Never delete. Confirm in chat before any create/update.

## Steps

1. Period: use what the user named. Else **last complete week** (Mon–Sun). ISO dates.
2. Optional filter: resource, team, or project if named.
3. Load via `ers` MCP: resources expected to enter time, timesheet entries in range, and bookings for the same range if available.
4. For each resource, expected hours = working capacity if available, else booked hours. Actual = summed timesheet hours.
5. Flag:
   - **Missing** — no timesheet entries.
   - **Short** — actual < expected (treat tiny rounding under 0.25h as OK).
6. Sort missing first, then most hours short. Cap at 25; note the remainder.

## Output

```markdown
# Timesheet gaps — <range>

- Missing: <n> · Short: <n>

## Missing
- <name> — expected <h>h · no entries

## Short
- <name> — <actual>h / <expected>h (short <h>h)
```

If everyone is complete: say so in one line.
