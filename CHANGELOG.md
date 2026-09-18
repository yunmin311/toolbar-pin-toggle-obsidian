# Changelog

All notable changes to this plugin are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## 1.0.2

Onboarding fixes — the plugin worked, but a fresh user could not discover how.

- **The default hotkey is now actually registered.** `addCommand` ships
  `hotkeys: [{Alt, Q}]`, so `Alt+Q` works on a fresh install. Until now the
  README and changelog claimed a default hotkey that the code never created —
  the command started unbound and only worked after a manual binding.
- **The settings tab now teaches usage.** A highlighted block above the mode
  dropdown explains that `Alt+Q` (or the palette command) toggles the pin, and
  that rebinding lives in Settings → Hotkeys. Previously the page was a single
  unlabelled dropdown (`styles.css` §7).

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
