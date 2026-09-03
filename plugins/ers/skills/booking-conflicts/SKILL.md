---
name: booking-conflicts
description: Finds overlapping or over-capacity bookings in eResource Scheduler. Use when someone says "who is double-booked", "find clashes", "booking conflicts", "overlapping bookings", or "schedule collisions".
---

# Booking conflicts

Read-only scan for the same resource booked on two intervals that overlap, or booked hours above working capacity. Print conflicts in chat. Do not edit bookings unless the user asks, then confirm first.

## Safety

- Use only the connected `ers` MCP server. Do not invent resource or booking IDs.
- If MCP is missing or auth fails: stop. Tell the user to connect at **Settings → Tools & MCP → ers → Connect**.
- Never delete. Confirm in chat before any create/update.

## Steps

1. Date range: use what the user named. Else **current week**. ISO dates.
2. Optional filter: resource, project, or team if the user named one.
3. Load bookings (and capacity / working hours if available) via `ers` MCP tools.
4. Flag:
   - **Overlap** — same resource, two bookings whose start/end intervals intersect.
   - **Over-capacity** — day's or week's booked hours exceed that resource's working capacity.
5. Sort: overlap first, then over-capacity. Cap at 25 rows; note the remainder.

## Output

```markdown
# Booking conflicts — <range>

- Overlaps: <n> · Over-capacity: <n>

## Overlaps
- <resource> — <booking A> (<project>, <start>–<end>) vs <booking B> (<project>, <start>–<end>)

## Over-capacity
- <resource> — <booked>h / <capacity>h on <day or week>
```

If there are none: say so in one line. Do not invent conflicts.
