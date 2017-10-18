'use strict';

const log = require('electron-log');
const Promise = require('bluebird');
const adb = require('adbkit');
const client = adb.createClient();
const toTitleCase = require('titlecase')

const ipcMain = require('electron').ipcMain;

ipcMain.on('adbkit-observe-devices', function(event, arg) {
  observeDevices(event, arg);
});

function observeDevices(event, arg) {
  log.debug(`Starting to observe device state changes`);
  client.trackDevices()
    .then(function(tracker) {
      tracker.on('add', function(device) {
        event.sender.send('adbkit-device-added', device);
      });
      tracker.on('remove', function(device) {
        event.sender.send('adbkit-device-removed', device);
      });
      tracker.on('end', function() {
        log.debug(`Device state observation stopped`);
      });
    })
    .catch(function(err) {
      log.warn('Unable to observe devices:', err.stack)
    });
}

ipcMain.on('adbkit-update-devices', function(event, arg) {
  updateDevices(event, arg);
});

function updateDevices(event, arg) {
  log.debug(`Updating device list`);
  client.listDevicesWithPaths()
    .then(function(devices) {
      event.sender.send('adbkit-devices-updated', devices);
    })
    .catch(function(err) {
      log.warn('Unable to get devices:', err.stack)
      event.sender.send('adbkit-devices-updated', []);
    });
}

ipcMain.on('adbkit-connect-device', function(event, arg) {
  connectDevice(event, arg);
});

function connectDevice(event, arg) {
  log.debug(`Connecting device: `, arg);
  client.connect(arg)
    .then(function(deviceId) {
      log.debug('Device connected:', deviceId)
    })
    .catch(function(err) {
      log.warn('Unable to connect device:', err.stack)
      event.sender.send('adbkit-devices-updated', []);
    });
}

ipcMain.on('adbkit-update-device', function(event, device) {
  updateDeviceFeatures(event, device);
  updateDeviceIpAddress(event, device);
  updateDeviceId(event, device);
  updateDeviceName(event, device);
  updateDeviceManufacturer(event, device);
  updateDeviceModel(event, device);
});

function updateDeviceFeatures(event, device) {
  log.debug(`Updating features of device: ${device.id}`);
  client.getFeatures(device.id)
    .then(function(features) {
      device.features = features;
      event.sender.send('adbkit-device-features-updated', device);
    })
    .catch(function(err) {
      log.warn('Unable to get device features:', err.stack)
    });
}

function updateDeviceIpAddress(event, device) {
  log.debug(`Updating IP address of device: ${device.id}`);
  runShellCommand(device, 'ip addr show wlan0  | grep \'inet \' | cut -d\' \' -f6|cut -d/ -f1')
    .then((output) => {
      device.ipAddress = output;
      event.sender.send('adbkit-device-updated', device);
    })
    .catch((err) => {
      log.warn('Unable to get device IP address:', err.stack)
    });
}

function updateDeviceId(event, device) {
  log.debug(`Updating Android ID of device: ${device.id}`);
  runShellCommand(device, createGetSettingCommand('secure', 'android_id'))
    .then((output) => {
      device.androidId = output;
      event.sender.send('adbkit-device-updated', device);
    })
    .catch((err) => {
      log.warn('Unable to get device ID:', err.stack)
    });
}

function updateDeviceName(event, device) {
  log.debug(`Updating name of device: ${device.id}`);
  runShellCommand(device, createGetSettingCommand('secure', 'bluetooth_name'))
    .then((output) => {
      device.bluetoothName = output;
      event.sender.send('adbkit-device-updated', device);
    })
    .catch((err) => {
      log.warn('Unable to get device name:', err.stack)
    });
}

function updateDeviceManufacturer(event, device) {
  log.debug(`Updating manufacturer of device: ${device.id}`);
  runShellCommand(device, createGetPropCommand('ro.product.manufacturer'))
    .then((output) => {
      device.manufacturer = toTitleCase(output.toLowerCase());
      event.sender.send('adbkit-device-updated', device);
    })
    .catch((err) => {
      log.warn('Unable to get device name:', err.stack)
    });
}

function updateDeviceModel(event, device) {
  log.debug(`Updating model of device: ${device.id}`);
  runShellCommand(device, createGetPropCommand('ro.product.model'))
    .then((output) => {
      device.model = toTitleCase(output.toLowerCase());
      event.sender.send('adbkit-device-updated', device);
    })
    .catch((err) => {
      log.warn('Unable to get device model:', err.stack)
    });
}

function runShellCommand(device, command) {
  log.debug(`Executing shell command on ${device.id}: ${command}`);
  return new Promise((resolve, reject) => {
    client.shell(device.id, command)
      .then(function(outputStream) {
        adb.util.readAll(outputStream)
          .then(function(outputBuffer) {
            let output = outputBuffer.toString('utf-8');
            // remove linebreaks from start and end
            output = output.replace(/^\s+|\s+$/g, '');
            resolve(output);
          });
      })
      .catch(reject);
  });
}

function createGetPropCommand(propertyId) {
  return `getprop | grep "${propertyId}" | cut -d ":" -f2 | cut -d "[" -f2 | cut -d "]" -f1`;
}

function createGetSettingCommand(namespace, settingId) {
  return `settings get ${namespace} "${settingId}"`;
}

module.exports = {
  updateDevices: updateDevices
};