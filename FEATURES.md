# FEATURES

Current site: workflow-first operational skill spotlight with chain intelligence, protocol playbooks, recommendations, and local analytics.

## Live Features

| Status | Feature |
|---|---|
| ✅ | Skill cards with prompt copy and search |
| ✅ | Workflow chains with full-chain copy |
| ✅ | Use before / use after graph pills |
| ✅ | When-not-to-use warning blocks |
| ✅ | Examples gallery with animated expand |
| ✅ | AI tool compatibility matrix + best platform badge |
| ✅ | Protocols section with expandable steps + copy |
| ✅ | Smart recommendation engine |
| ✅ | Advanced local analytics with sparkline |
| ✅ | Export formats: JSON / YAML / Markdown |

## Planned

| Status | Feature |
|---|---|
| ⏳ | Workflow versioning and diff history |
| ⏳ | Import bundles from exported workflow files |
| ⏳ | Team preset packs with shared protocol templates |
| ⏳ | Confidence scoring for recommendations |

## How to add a skill manually

Edit `SKILLS` in `index.html` and include:
- `id`, `cat`, `name`, `oneliner`, `when`, `when_not`, `tags`, `level`, `prompt`
- `use_before`, `use_after`, `examples[]`, `compatible_with`
