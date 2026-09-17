# Toolbar Pin Toggle

> Keep a toolbar always visible with one hotkey — the native bottom toolbar, or
> the top one.

[![Release](https://img.shields.io/github/v/release/yunmin311/toolbar-pin-toggle-obsidian)](https://github.com/yunmin311/toolbar-pin-toggle-obsidian/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Obsidian's toolbars come and go. The mobile-style bottom toolbar appears only
when the editor focuses, and the top toolbar hides itself when you're reading.
This plugin pins whichever one you actually use.

## Two modes

| Mode | Behavior |
|---|---|
| **Bottom toolbar** | Toggles Obsidian's native bottom toolbar on and off |
| **Top toolbar** | Keeps the top toolbar permanently visible, even in reading view |

Pick one in Settings; switching modes is the whole setting.

## Why

The bottom toolbar is genuinely useful on a desktop with a large screen, but it
is tied to a mobile-oriented "toolbar when editing" rule. If you want it to stay
put — or if you want the top toolbar to stop disappearing while you read — the
option simply isn't there. This adds the toggle, and binds it to one key.

## Usage

Default hotkey: `Alt+Q`. Run **Toggle toolbar pin** from the command palette, or
rebind it in Settings → Hotkeys (search for "Toolbar Pin Toggle").

## Installation

**Community plugins:** search for "Toolbar Pin Toggle" in Settings → Community
plugins.

**Manual:**

1. Download `main.js`, `manifest.json` and `styles.css` from the
   [latest release](https://github.com/yunmin311/toolbar-pin-toggle-obsidian/releases).
2. Put them in `<vault>/.obsidian/plugins/toolbar-pin-toggle/`.
3. Enable the plugin under Settings → Community plugins.

**Beta builds:** add `yunmin311/toolbar-pin-toggle-obsidian` to
[BRAT](https://github.com/TfTHacker/obsidian42-brat).

## Privacy

No network access. No telemetry. No accounts. It toggles a CSS class and touches
nothing else.

## License

[MIT](LICENSE)

---

## 中文说明

一个快捷键两种常驻：切换底部原生工具条的常驻状态，或让顶部工具条保持常驻
（阅读视图下也不再自动隐藏）。模式在设置里二选一。

默认快捷键 `Alt+Q`，可在 设置 → 快捷键 里改成别的（搜 "Toolbar Pin Toggle"）。

安装：在社区插件里搜 "Toolbar Pin Toggle"，或从 Release 下载三个文件放进
`.obsidian/plugins/toolbar-pin-toggle/`。
