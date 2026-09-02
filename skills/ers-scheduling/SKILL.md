---
name: ers-scheduling
description: Plan and manage eResource Scheduler data via MCP — resources, projects, bookings, timesheets, rates, and reports. Use when the user asks about ERS, resource scheduling, capacity, utilization, allocations, or timesheet workflows.
---

# eResource Scheduler

## When to use

- Working with eResource Scheduler data or workflows in Cursor
- The user mentions eResource Scheduler or related MCP tools

## Setup

The eResource Scheduler MCP server must be connected and authenticated in Cursor (**Settings → Tools & MCP → ers → Connect**).

## Rules

1. Minimum API hits: prefer native ERS one-shot operations (bulk edit, recurring patterns, booking split).
2. Pass filters to search/report tools; do not fetch-all and filter in the agent.
3. For creates, list types with `ers_type_get`, ask for required fields by display name, then create.
4. Admin configuration is read-only over MCP; tags can be searched/created only.
5. Pass `confirm=true` when a destructive tool requires it.

## Common flows

| Goal | Tools |
|------|-------|
| Who is available next week? | `ers_report_get` (availability) or `ers_resource_search` with filters |
| Book a resource on a project | `ers_resource_search` → `ers_project_search` → `ers_booking_create` |
| Split a booking | `ers_booking_update` with `splitOn` (not update + create) |
| Approve timesheets | `ers_timesheet_search` → `ers_timesheet_decision` |
