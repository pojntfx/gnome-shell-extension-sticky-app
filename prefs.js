"use strict";

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

function fillPreferencesWindow(window) {
  const settings = ExtensionUtils.getSettings(
    "org.gnome.shell.extensions.com.pojtinger.felicitas.gnome-shell-extension-sticky-app"
  );

  const page = new Adw.PreferencesPage();
  const group = new Adw.PreferencesGroup();
  page.add(group);

  {
    const row = new Adw.ActionRow({
      title: "Shortcut to toggle the app with (restart GNOME to apply)",
    });
    group.add(row);

    const entry = new Gtk.Entry({
      text: settings.get_string("toggle-shortcut"),
      valign: Gtk.Align.CENTER,
    });
    settings.bind(
      "toggle-shortcut",
      entry,
      "text",
      Gio.SettingsBindFlags.DEFAULT
    );

    row.add_suffix(entry);
    row.activatable_widget = entry;
  }

  {
    const row = new Adw.ActionRow({
      title: "ID of the app to launch (restart GNOME to apply)",
    });
    group.add(row);

    const entry = new Gtk.Entry({
      text: settings.get_string("app-id"),
      valign: Gtk.Align.CENTER,
    });
    settings.bind("app-id", entry, "text", Gio.SettingsBindFlags.DEFAULT);

    row.add_suffix(entry);
    row.activatable_widget = entry;
  }

  window.add(page);
}
