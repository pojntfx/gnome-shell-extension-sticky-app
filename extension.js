const Main = imports.ui.main;
const Lang = imports.lang;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

const APP = "re.sonny.Tangram.desktop";

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
    let keyManager = new KeyManager();
    keyManager.listenFor("<super>u", function () {
      console.log("Toggling app with ID " + APP);

      // Shell.AppSystem.get_default()
      //   .get_installed()
      //   .forEach((app) => console.log(app.get_id()));

      const app = Shell.AppSystem.get_default().lookup_app(APP);

      app.open_new_window(-1);
    });
  }

  disable() {}
}

function init(meta) {
  return new Extension(meta.uuid);
}
