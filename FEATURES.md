# FEATURES

Current site: Apple-inspired single-file skill dictionary with searchable cards, category tabs, pinning, copy actions, and keyboard shortcut support.

## Live

| Feature | Status | Notes |
|---|---|---|
| Search skills by name/use-case/tag | ✅ | Instant filtering with debounce. |
| Category segmented tabs | ✅ | Includes active sliding pill treatment. |
| Copy prompt action | ✅ | One-click clipboard copy with confirmation state. |
| Pinned skills strip | ✅ | Pin frequently used skills for quick copy. |
| Cmd/Ctrl+K quick focus | ✅ | Keyboard shortcut focuses search and gives hint feedback. |
| Dark mode palette | ✅ | Uses `prefers-color-scheme` tokens. |

## Planned

| Feature | Priority | Notes |
|---|---|---|
| Spotlight-style command palette | High | Full overlay palette with keyboard selection and enter-to-copy. |
| Share-link pulse highlight (`#skill-{id}`) | Medium | Scroll and pulse selected card. |
| Custom skill modal celebration animation | Medium | Animated insert and glow when adding custom skills. |
| Empty-state icon animation | Low | SF-style icon + text motion when no results. |

## How to add a skill manually
1. Open `index.html`.
2. Find the `SKILLS` array in the `<script>` block.
3. Duplicate an existing skill object and update: `id`, `name`, `cat`, `oneliner`, `when`, `tags`, `source`, `prompt`, `gh`.
4. Keep category values in: `visual`, `image`, `frontend`, `backend`, `context`, `workflow`.
5. Save and redeploy.
