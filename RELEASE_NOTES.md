# Release Notes

## [1.3.1] - 2026-10-28

### Added
- "Add rule" is a full-width dashed row placed after the last rule, so a new rule appears where it will be used.
- Settings page shows the steps to migrate rules from the original plugin, with a caution not to enable both plugins at the same time.
- README has a migration section with the same steps.

### Fixed
- Blank rules no longer match every tag or title, so they cannot move notes to the root folder.
- Settings scroll position is kept when adding, deleting, or moving rules.

### Changed
- Settings heading renamed to "Auto Note Mover (Forked)".

## [1.3.0] - 2026-10-28

### Fixed
- Settings dropdown (folder/path suggestions) no longer gets clipped or appears outside the settings window when Settings is open in a pop-out window.

### Changed
- Plugin ID changed to `auto-note-mover-forked` and name to "Auto Note Mover (Forked)" so it can coexist with the original plugin.
- Marked as desktop-only (`isDesktopOnly: true`); mobile has not been tested.
- README documents this fork and credits the original author, faru.
- Release automation: a tag is created automatically when `manifest.json` changes on `main`, and a GitHub release is published from this file.
