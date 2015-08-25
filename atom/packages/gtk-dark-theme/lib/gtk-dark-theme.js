var exec = require('child_process').exec;

module.exports = {
    config: {
        enabled: {
            type: 'boolean',
            default: true
        }
    },

    /**
     * Activates the package.
     */
    activate: function() {
        atom.commands.add('atom-workspace', 'gtk-dark-theme:enable', this.enable);
        atom.commands.add('atom-workspace', 'gtk-dark-theme:disable', this.disable);

        // Automatically enable dark theme if it was enabled last time we ran.
        if (atom.config.get('gtk-dark-theme.enabled')) {
            this.enable();
        }
    },

    /**
     * Enables the GTK dark theme.
     */
    enable: function() {
        console.log('Setting GTK theme variant to "dark".');
        setAtomGtkTheme('dark').then(function () {
            atom.config.set('gtk-dark-theme.enabled', true);
        });
    },

    /**
     * Disables the GTK dark theme.
     */
    disable: function() {
        console.log('Setting GTK theme variant to "light".');
        setAtomGtkTheme('light').then(function () {
            atom.config.set('gtk-dark-theme.enabled', false);
        });
    }
};


/**
 * Gets the PIDs of all running Atom processes.
 *
 * @return Promise
 */
function getAtomProcessIds() {
    return new Promise(function(resolve, reject) {
        exec('pidof atom', function(error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            // Get all PIDs for Atom processes.
            var pids = stdout.trim().split(' ').map(parseFloat);
            resolve(pids);
        });
    });
}

/**
 * Gets the handle IDs of all currently open Atom windows.
 *
 * @return Promise
 */
function getAtomWindowHandles() {
    // First, get all of the open windows and their respective process IDs.
    var windowPids = getAllWindowHandles().then(function (windowHandles) {
        var promises = [];

        // Go through each handle and fetch its owner process ID.
        for (var i = 0; i < windowHandles.length; i++) {
            var handle = windowHandles[i];
            promises.push(getWindowProcessId(handle).then(function(pid) {
                return {
                    handle: handle,
                    pid: pid
                };
            }, function (reason) {
            }));
        }

        return Promise.all(promises);
    });

    // Now, get all of Atom's processes and match the window handles to see if
    // they belong to Atom.
    var pids = getAtomProcessIds();
    return Promise.all([pids, windowPids]).then(function (values) {
        var handles = [];

        // For each window handle, if the window's PID is in the list of Atom
        // PIDs, add the window's handle to the list.
        for (var i = 0; i < values[1].length; i++) {
            if (values[1][i] && values[0].indexOf(values[1][i].pid) > -1) {
                handles.push(values[1][i].handle);
            }
        }

        return handles;
    });
}

/**
 * Sets the GTK theme variant of all Atom windows.
 *
 * @param [String] variant The GTK theme variant to set.
 *
 * @return Promise
 */
function setAtomGtkTheme(theme) {
    return getAtomWindowHandles().then(function(handles) {
        var promises = [];

        for (var i = 0; i < handles.length; i++) {
            var cmd = 'xprop -id '
                + handles[i]
                + ' -f _GTK_THEME_VARIANT 8u -set _GTK_THEME_VARIANT '
                + theme;

            promises.push(new Promise(function(resolve, reject) {
                exec(cmd, function(error, stdout, stderr) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }));
        }

        return Promise.all(promises);
    });
}

/**
 * Gets the window handle IDs of all windows currently open.
 *
 * @return Promise
 */
function getAllWindowHandles() {
    return new Promise(function(resolve, reject) {
        exec('xprop -root _NET_CLIENT_LIST', function(error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            var ids = stdout.match(/0x(([a-z]|\d)+)/gi);
            resolve(ids);
        });
    });
}

/**
 * Gets the PID of the process that owns a window handle ID.
 *
 * @param [String] handle The window handle ID.
 *
 * @return Promise
 */
function getWindowProcessId(handle) {
    return new Promise(function(resolve, reject) {
        exec('xprop -id ' + handle + ' _NET_WM_PID', function(error, stdout, stderr) {
            if (error || stdout.indexOf('_NET_WM_PID(CARDINAL)') == -1) {
                return reject(error);
            }

            var pid = parseFloat(stdout.match(/\d+/)[0]);
            resolve(pid);
        });
    });
}
