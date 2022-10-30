const Main = imports.ui.main;
const Lang = imports.lang;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const GLib = imports.gi.GLib;
const ExtensionUtils = imports.misc.extensionUtils;

// Ported from https://superuser.com/questions/471606/gnome-shell-extension-key-binding/1182899#1182899
class KeyManager {
  constructor() {
    this.grabbers = new Map();

    global.display.connect(
      "accelerator-activated",
      Lang.bind(this, function (display, action, deviceId, timestamp) {
        this.onAccelerator(action);
      })
    );
  }

  listenFor(accelerator, callback) {
    let action = global.display.grab_accelerator(accelerator, 0);

    if (action == Meta.KeyBindingAction.NONE) {
    } else {
      let name = Meta.external_binding_name_for_action(action);

      Main.wm.allowKeybinding(name, Shell.ActionMode.ALL);

      this.grabbers.set(action, {
        name: name,
        accelerator: accelerator,
        callback: callback,
        action: action,
      });
    }
  }

  onAccelerator(action) {
    let grabber = this.grabbers.get(action);

    if (grabber) {
      this.grabbers.get(action).callback();
    }
  }
}

class Extension {
  constructor(uuid) {
    this.uuid = uuid;
  }

  enable() {
    const settings = ExtensionUtils.getSettings(
      "org.gnome.shell.extensions.com.pojtinger.felicitas.gnome-shell-extension-sticky-app"
    );

    const toggleShortcut = settings.get_string("toggle-shortcut");
    const appId = settings.get_string("app-id");

    console.log("Toggling app with ID", appId, "and shortcut", toggleShortcut);

    let keyManager = new KeyManager();
    keyManager.listenFor(toggleShortcut, function () {
      const openApp = () => {
        this.app = Shell.AppSystem.get_default().lookup_app(appId);
        this.app.open_new_window(-1);
      };

      if (!this.app) {
        openApp();

        GLib.usleep(1000);
      }

      let window = this.app.get_windows()[0];
      if (!window) {
        this.app.open_new_window(-1);

        GLib.usleep(1000);

        window = this.app.get_windows()[0];
      }

      if (window.minimized) {
        window.unminimize();
        window.activate(global.get_current_time());
      } else {
        window.minimize();
      }
    });
  }

  disable() {}
}

function init(meta) {
  return new Extension(meta.uuid);
}
