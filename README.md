[![WIP](https://img.shields.io/badge/work%20in%20progress-yes-green.svg)](https://github.com/neXenio/adb-util) [![GitHub license](https://img.shields.io/github/license/neXenio/adb-util.svg)](https://github.com/neXenio/adb-util/blob/master/LICENSE)

# ADB Utility

An [Electron] application for Android developers, providing a GUI for common [ADB] operations.

![screenshot]

The tool offers some convenience utilities to speed up the development, especially when handling multiple devices. Features:

- [x] Listing connected devices (`adb devices`)
- [ ] Discovering network devices with the ADB deamon (`nmap -p 5555`)
- [ ] Connecting and disconnecting devices (`adb connect`, ...)
- [ ] Toggling connections between USB and TCP (`adb usb`, ...)
- [x] Executing shell commands (`adb shell`)
    - [x] Fetching features (`pm list features`)
    - [x] Fetching properties (`getprop`)
    - [x] Fetching settings (`settings get`)
    - [x] Fetching network configuration (`ip addr show wlan0`)
    - [ ] Starting and stopping applications (`am start`, ...)
    - [ ] Clearing application data (`pm clear`)
    - [ ] Grabbing screenshots (`screencap`)
- [ ] Installing and uninstalling applications (`adb install`, ...)
- [ ] Pushing and pulling files and folders
- [ ] Viewing Logcat output (`adb logcat`)

You can check the progress of new features in the [project] section.

## Requirements

Make sure that `adb` is available in your `PATH`. You can check if that's the case by opening a terminal and executing `adb version`.

## Development

#### Deploying

```sh
$ npm install    # install dependencies
$ npm start      # support for reloading views, restarting electron
```

#### Building Releases

```sh
$ npm run build      # all
$ npm run build-osx  # osx(64)
$ npm run build-win  # win(32, 64)
```

#### Contributing

Please checkout the [open issues] and the [project] section. Looking forward to your pull requests!

## Build With

This tool is being built using [Electron], powered by [react] and [redux]. It heavily relies on the [adbkit] module.

## License

[Apache License V2](LICENSE)

Copyright © neXenio GmbH.

[electron]: https://github.com/electron/electron
[react]: https://github.com/facebook/react
[redux]: https://github.com/reactjs/redux
[adbkit]: https://github.com/openstf/adbkit
[adb]: https://developer.android.com/studio/command-line/adb.html
[screenshot]: assets/screenshot.png
[project]: https://github.com/neXenio/adb-util/projects/1
[open issues]: https://github.com/neXenio/adb-util/issues