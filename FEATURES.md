# FEATURES

Current site: a fast Apple-style spotlight for AI skills.

## Live Features

| Status | Feature |
|---|---|
| ✅ | Search with category filtering |
| ✅ | Cmd/Ctrl + K command palette |
| ✅ | Skill cards with copy prompt/install + GitHub link |
| ✅ | Pin/unpin favorites + pinned strip |
| ✅ | Per-skill notes with localStorage persistence |
| ✅ | Sorting: default / most used / recent |
| ✅ | Grid/list view toggle |
| ✅ | Share links via `#skill-id` with scroll + highlight |
| ✅ | Custom skills (add/edit/delete) with persistence |
| ✅ | Apple-style UI with dark mode |

## Future Ideas

| Status | Feature |
|---|---|
| ⏳ | Workflow chains |
| ⏳ | Protocol templates |
| ⏳ | Recommendation engine |
| ⏳ | Export formats (JSON/YAML/Markdown) |
| ⏳ | Compatibility matrix |
| ⏳ | Analytics dashboard |
| ⏳ | Example galleries |

## How to add a skill manually

Edit `BASE` in `index.html` and include:
- `id`, `cat`, `name`, `oneliner`, `tags`, `prompt`, `install`, `github`
