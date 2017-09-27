'use strict';

const { ipcRenderer } = require('electron');
const log = require('electron-log');

window.onload = function () {
  log.debug("Background process started");
  ipcRenderer.on('background-start', (startTime) => {

  });
};