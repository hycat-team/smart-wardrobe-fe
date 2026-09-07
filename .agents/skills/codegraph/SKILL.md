---
name: codegraph
description: Use CodeGraph knowledge graph to trace call hierarchies, Zustand store usages, API services, routes, and assess blast-radius impact in the smart-wardrobe-fe codebase.
---

# CodeGraph Skill for smart-wardrobe-fe

CodeGraph is initialized and indexed for this project (`353 files`, `3,574 nodes`, `8,238 edges`).

## When to use CodeGraph
When investigating architecture, understanding flows, finding symbol usages, or refactoring in `smart-wardrobe-fe`:
1. **Prioritize CodeGraph over multi-step grep/read**:
   - Use the MCP tool `codegraph_explore` or CLI `codegraph explore "<query>"`.
   - Examples:
     - Trace Zustand state: `codegraph explore "where is useAuthStore or useWardrobeStore consumed"`
     - Trace API flow: `codegraph explore "how do components call itemService"`
     - Check call hierarchy: `codegraph callers <symbol_name>`
     - Check callees: `codegraph callees <symbol_name>`
     - Check impact before refactoring: `codegraph impact <symbol_name>`
2. **Auto-sync & Freshness**:
   - CodeGraph watches file changes and auto-syncs.
   - Run `codegraph status` or `codegraph sync` if manual verification is needed.
