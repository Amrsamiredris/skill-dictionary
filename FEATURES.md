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
| ✅ | Local usage stats for sorting (most used/recent) |
| ✅ | Apple-style UI with stable light/dark mode |

## Scope (intentionally kept minimal)

This project intentionally excludes unfinished systems and keeps a single-file, frontend-only architecture:
- no workflow intelligence
- no protocols layer
- no recommendation engine
- no export system
- no compatibility matrix
- no advanced analytics
- no example galleries
- no heavy animations

## How to add a base skill manually

Edit `BASE` in `index.html` and include:
- `id`, `cat`, `name`, `oneliner`, `tags`, `prompt`, `install`, `github`
