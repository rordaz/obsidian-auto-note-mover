# Release Notes

## [1.3.0] - 2026-10-28

### Fixed
- Settings dropdown (folder/path suggestions) no longer gets clipped or appears outside the settings window when Settings is open in a pop-out window.

### Changed
- Plugin ID changed to `auto-note-mover-forked` and name to "Auto Note Mover (Forked)" so it can coexist with the original plugin.
- Marked as desktop-only (`isDesktopOnly: true`); mobile has not been tested.
- README documents this fork and credits the original author, faru.
- Release automation: a tag is created automatically when `manifest.json` changes on `main`, and a GitHub release is published from this file.
