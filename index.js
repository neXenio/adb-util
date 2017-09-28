'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const log = require('electron-log');
const template = require('./scripts/menu');
const adbkitWrapper = require('./adb/adbkit-wrapper');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();



// prevent window being garbage collected
let mainWindow;
let backgroundWindow;

var menu = Menu.buildFromTemplate(template);

function createMainWindow() {
  log.debug('Creating main window');
  var opts = {
    width: 1000,
    height: 400,
    minWidth: 800,
    minHeight: 400,
    acceptFirstMouse: true,
    titleBarStyle: 'hidden',
    frame: false,
    icon: __dirname + '/assets/icon.ico'
  };

  if (process.env.DEV) {
    const is2nd = process.argv.indexOf('--2nd') >= 0;
    if (is2nd) {
      setOptsForDualScreen(opts);
    }
  }
  
  const win = new BrowserWindow(opts);
  if (process.env.DEV) {
    win.loadURL('http://localhost:8000/dev.html');
    win.openDevTools();
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }
  win.on('closed', () => {
    mainWindow = null
  });

  if (menu) {
    Menu.setApplicationMenu(menu);
    menu = null;
  }

  return win;
}

function createBackgroundWindow() {
  log.debug('Creating background window');
  const win = new BrowserWindow({
    show: false
  });
  win.loadURL(`file://${__dirname}/background/index.html`);
  return win;
}

function setOptsForDualScreen(opts) {
  var atomScreen = electron.screen;
  var displays = atomScreen.getAllDisplays();
  var d2 = displays.length > 1 ? displays[1] : null;
  if (d2) {
    opts.x = d2.bounds.x + (d2.size.width - opts.width) / 2;
    opts.y = d2.bounds.y + (d2.size.height - opts.height) / 2;
  }
}

app.on('window-all-closed', () => {
  log.debug('All windows closed, quitting app');
  app.quit();
});

app.on('activate-with-no-open-windows', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
  backgroundWindow = createBackgroundWindow();
  //adb.updateDevices(mainWindow);

  if (process.env.DEV) {
    const watcher = require('./scripts/watcher.js');
    watcher.watch(app, ['./index.js', './scripts']);
  }
});
