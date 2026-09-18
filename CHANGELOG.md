# Changelog

All notable changes to this plugin are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## 1.0.1

Submission-readiness fixes. No change to what the plugin does.

- **The Editing Toolbar requirement is now stated.** Both pin modes act on
  toolbars that the [Editing Toolbar](https://github.com/PKM-er/obsidian-editing-toolbar)
  plugin provides, so this plugin does nothing on its own. Without this, a user
  who installed it alone would see a command that silently did nothing. The
  dependency is now in the README and the manifest description, checked on load,
  and surfaced as a warning box in the settings tab.
- The command now checks for the companion plugin before running and shows a
  notice instead of calling a command that does not exist.
- README corrected: earlier wording claimed the modes drove Obsidian's own
  toolbars, which was not accurate — they drive Editing Toolbar's.
- UI strings (command name, notices, settings) are English, matching the
  manifest and README.
- Settings tab gained a warning box (`styles.css` §6) shown when the companion
  plugin is missing.

## 1.0.0

- Initial release.
- Two pin modes: fixed bottom toolbar, or permanently visible top toolbar.
- Default hotkey `Alt+Q`.
