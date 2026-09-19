/* Toolbar Pin Toggle
   One command, two pinning modes (chosen in settings):
   - fixed: toggles Editing Toolbar's fixed (bottom) toolbar
   - top  : toggles body.etb-pinned, keeping the top toolbar visible

   ⚠️ This plugin is a companion to the "Editing Toolbar" community plugin:
   both modes act on toolbars that Editing Toolbar provides, so it does
   nothing useful on its own. That dependency is stated in the README and
   checked at load time (see ensureEditingToolbar) so a missing install
   produces a clear notice instead of a command that silently does nothing.

   All Editing Toolbar appearance/behaviour corrections live in this plugin's
   styles.css — enabling this plugin is enough, no extra CSS snippet. */

"use strict";

const { Plugin, PluginSettingTab, Setting, Notice } = require("obsidian");
const { bindI18n } = require("./i18n");
const { renderSponsor } = require("./sponsor");

const DEFAULTS = { mode: "fixed", topPinned: false, language: "auto" };

/** The command we delegate the "fixed" mode to; its existence is also how we
 *  detect whether the required companion plugin is present. */
const ETB_COMMAND = "editing-toolbar:toggle-fixed-toolbar";
const ETB_PLUGIN_NAME = "Editing Toolbar";

class ToolbarPinTogglePlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULTS, await this.loadData());
    bindI18n(this);
    this.applyTopPinned(this.settings.topPinned);

    const t = (k, v) => this.i18n.t(k, v);

    this.addCommand({
      id: "toggle-pin",
      // 命令名会随界面语言变化：Obsidian 每次打开命令面板都会重读注册表，
      // 而切换语言后我们重建设置页；命令名以加载时的语言为准，
      // 想立刻生效可重新加载插件（设置页里有说明）。
      name: t("command.toggle"),
      // Ship the default binding the README has always advertised. Without
      // this field the command exists but has NO hotkey on a fresh install,
      // so "Default hotkey: Alt+Q" was only true for users who bound it by
      // hand. An explicit user binding (hotkeys.json) still wins over this.
      hotkeys: [{ modifiers: ["Alt"], key: "Q" }],
      callback: async () => {
        if (!this.hasEditingToolbar()) {
          this.warnMissingEditingToolbar();
          return;
        }
        if (this.settings.mode === "top") {
          this.settings.topPinned = !this.settings.topPinned;
          await this.saveData(this.settings);
          this.applyTopPinned(this.settings.topPinned);
          new Notice(
            this.i18n.t(
              this.settings.topPinned ? "notice.pinned.on" : "notice.pinned.off"
            )
          );
        } else {
          this.app.commands.executeCommandById(ETB_COMMAND);
        }
      },
    });

    this.addSettingTab(new ToolbarPinToggleSettingTab(this.app, this));

    // Surface the dependency once at load rather than letting the command
    // silently do nothing. Deferred so it does not race Obsidian's own
    // "plugin loaded" notices.
    if (!this.hasEditingToolbar()) {
      window.setTimeout(() => this.warnMissingEditingToolbar(), 1000);
    }
  }

  /**
   * Whether the required companion plugin is available.
   *
   * Probed through the command registry because that is the very object the
   * "fixed" mode delegates to — if the command is absent, that mode could not
   * have worked either. Any failure is treated as "missing": a false warning
   * is far better than a command that silently does nothing.
   */
  hasEditingToolbar() {
    try {
      const commands = this.app.commands;
      if (!commands) return false;
      if (typeof commands.findCommand === "function") {
        return !!commands.findCommand(ETB_COMMAND);
      }
      return !!(commands.commands && commands.commands[ETB_COMMAND]);
    } catch {
      return false;
    }
  }

  warnMissingEditingToolbar() {
    new Notice(this.i18n.t("notice.missing", { name: ETB_PLUGIN_NAME }), 8000);
  }

  applyTopPinned(pinned) {
    document.body.classList.toggle("etb-pinned", !!pinned);
  }

  onunload() {
    document.body.classList.remove("etb-pinned");
  }
}

class ToolbarPinToggleSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    const t = (k, v) => this.plugin.i18n.t(k, v);
    containerEl.empty();
    containerEl.createEl("h3", { text: "Toolbar Pin Toggle" });

    // 语言放在最上面：它是这一页里唯一「改变这一页本身」的选项。
    new Setting(containerEl)
      .setName(t("settings.language.name"))
      .setDesc(t("settings.language.desc"))
      .addDropdown((drop) => {
        for (const opt of this.plugin.i18n.options) {
          drop.addOption(opt.id, opt.label);
        }
        drop.setValue(this.plugin.settings.language || "auto").onChange(
          async (value) => {
            this.plugin.settings.language = value;
            await this.plugin.saveData(this.plugin.settings);
            this.display();
          }
        );
      });

    // Stated up front rather than buried in the README: without the companion
    // plugin every option on this page is inert.
    if (!this.plugin.hasEditingToolbar()) {
      containerEl.createDiv({ cls: "tpt-missing-dependency" }, (el) => {
        el.createEl("strong", {
          text: t("settings.missing.title", { name: ETB_PLUGIN_NAME }),
        });
        el.createEl("div", { text: t("settings.missing.body") });
      });
    }

    // Usage block, placed above the mode dropdown. The plugin has exactly one
    // interaction, so this page is the right place to teach it: a bare
    // dropdown never told anyone that Alt+Q is the toggle, or that rebinding
    // lives in Settings → Hotkeys rather than here.
    containerEl.createDiv({ cls: "tpt-usage" }, (el) => {
      // 文案里的 {key} 要用 <kbd> 包起来，所以拿一个不可能出现的哨兵值
      // 切出前后两段，再在中间插元素 —— 直接写死 "Press " 就没法翻译了。
      const parts = t("settings.usage.intro", { key: "\u0000" }).split("\u0000");
      const p1 = el.createEl("p");
      p1.appendText(parts[0] || "");
      p1.createEl("kbd", { text: "Alt+Q" });
      p1.appendText(parts[1] || "");
      el.createEl("p", { text: t("settings.usage.rebind") });
    });

    new Setting(containerEl)
      .setName(t("settings.mode.name"))
      .setDesc(t("settings.mode.desc"))
      .addDropdown((drop) =>
        drop
          .addOption("fixed", t("settings.mode.opt.fixed"))
          .addOption("top", t("settings.mode.opt.top"))
          .setValue(this.plugin.settings.mode)
          .onChange(async (value) => {
            if (value === "fixed" && this.plugin.settings.topPinned) {
              // Leaving top mode: drop the pin so the two never stack.
              this.plugin.settings.topPinned = false;
              this.plugin.applyTopPinned(false);
            }
            this.plugin.settings.mode = value;
            await this.plugin.saveData(this.plugin.settings);
            new Notice(
              t(value === "top" ? "notice.mode.top" : "notice.mode.fixed")
            );
          })
      );

    new Setting(containerEl)
      .setName(t("settings.dep.name"))
      .setDesc(
        this.plugin.hasEditingToolbar()
          ? t("settings.dep.present", { name: ETB_PLUGIN_NAME })
          : t("settings.dep.absent", { name: ETB_PLUGIN_NAME })
      );

    new Setting(containerEl)
      .setName(t("settings.reset.name"))
      .setDesc(t("settings.reset.desc"))
      .addButton((b) =>
        b.setButtonText(t("common.reset")).onClick(async () => {
          // 语言是「这一页本身」的偏好，恢复默认时刻意保留，
          // 否则中文用户点一下按钮界面就变成英文了。
          const keepLang = this.plugin.settings.language;
          this.plugin.settings = Object.assign({}, DEFAULTS, {
            language: keepLang,
          });
          await this.plugin.saveData(this.plugin.settings);
          this.plugin.applyTopPinned(false);
          new Notice(t("common.reset.done"));
          this.display();
        })
      );

    this.renderFooter(containerEl, t);
  }

  /** 版本 + 仓库 + 赞助。四个插件共用同一套结构与文案。 */
  renderFooter(containerEl, t) {
    const wrap = containerEl.createDiv({ cls: "tpt-about" });

    const meta = wrap.createDiv({ cls: "tpt-about-meta" });
    const version = this.plugin.manifest.version;
    meta.createSpan({
      text: `${t("meta.version")} ${version}`,
    });
    meta.createSpan({ cls: "tpt-about-sep", text: "·" });
    const repo = meta.createEl("a", {
      text: this.plugin.manifest.id,
      href: `https://github.com/yunmin311/${this.plugin.manifest.id}-obsidian`,
    });
    repo.setAttr("target", "_blank");
    repo.setAttr("rel", "noopener");

    renderSponsor(wrap, t);
  }
}

module.exports = ToolbarPinTogglePlugin;
