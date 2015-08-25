# GTK Dark Theme Variant for Atom
A simple plugin for [Atom](http://atom.io) that enables you to toggle the [dark theme variant](https://developer.gnome.org/gtk3/3.0/GtkSettings.html#GtkSettings--gtk-application-prefer-dark-theme) in Atom on GTK+ 3-based desktop environments that support it. GNOME 3 is the most common shell that supports this.

You can use this to enable the dark variant of your current desktop theme for Atom windows, which results in a much more beautiful interface when using dark UI themes. Note that this currently does not affect the menu bar.

This package is inspired by and is based off of the [GTKDarkThemeVariantSetter](https://github.com/p-e-w/GTKDarkThemeVariantSetter) plugin for Sublime Text. Credit should be given to [Philipp Weidmann](http://github.com/p-e-w) for the steps to modify an open window's theme.

### Before (GNOME 3):
![Before](https://raw.githubusercontent.com/coderstephen/atom-gtk-dark-theme/master/images/before.png)

### After:
![After](https://raw.githubusercontent.com/coderstephen/atom-gtk-dark-theme/master/images/after.png)

## Installation
Via `apm`:

    apm install gtk-dark-theme

## Usage
To enable the dark theme, open the command palette (<kbd>Shift+Ctrl+P</kbd>) and select "Gtk Dark Theme: Enable" from the list. To disable the dark theme, open the command palette and select "Gtk Dark Theme: Disable" from the list.

Your current choice will be remembered the next time you open Atom.

## License
This package is licensed under the MIT License. See [the license file](LICENSE.md) for details.
