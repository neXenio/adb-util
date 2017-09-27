'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer; 
const log = require('electron-log');
const actions = require('../app/actions');
const {Device} = require('./device');

let instance = null;

export class DeviceManager {  

  constructor(dispatch) {
    if (!instance){
      this.deviceMap = new Map();
      this.adbKitListenersRegistered = false;
      instance = this;
    }
    instance.dispatch = dispatch;

    if (!instance.adbKitListenersRegistered) {
      instance.registerAdbKitListeners();
    }
    return instance;
  }

  registerAdbKitListeners() {
    log.debug("Registering ADB Kit IPC listeners");

    ipcRenderer.on('adbkit-device-added', (event, device) => {
      this.onDeviceAdded(device);
    });

    ipcRenderer.on('adbkit-device-removed', (event, device) => {
      this.onDeviceRemoved(device);
    });

    ipcRenderer.on('adbkit-device-updated', (event, device) => {
      this.onDeviceUpdated(device);
    });

    ipcRenderer.on('adbkit-devices-updated', (event, devices) => {
      devices.forEach((device) => this.onDeviceUpdated(device));
    });

    ipcRenderer.on('adbkit-device-features-updated', (event, device) => {
      this.onDeviceFeaturesUpdated(device);
    });

    // tell the adbkit that we care about device updates
    ipcRenderer.send('adbkit-observe-devices');
    ipcRenderer.send('adbkit-update-devices');

    this.adbKitListenersRegistered = true;
  }

  getDevice(adbKitDevice) {
    let device = this.deviceMap.get(adbKitDevice.id);
    if (!device) {
      device = Device.fromAdbKitDevice(adbKitDevice);
      this.deviceMap.set(adbKitDevice.id, device);
    }
    return device;
  }

  onDeviceAdded(adbKitDevice) {
    let device = this.getDevice(adbKitDevice);
    Object.assign(device, adbKitDevice);
    device.onConnect();
    log.debug('Device added: ' + device.id);
    this.dispatch(actions.deviceAdded(device));
    //ipcRenderer.send('adbkit-update-device-features', device);
    ipcRenderer.send('adbkit-update-device', device);
  }

  onDeviceRemoved(adbKitDevice) {
    let device = this.getDevice(adbKitDevice);
    Object.assign(device, adbKitDevice);
    device.onDisconnect();
    log.debug('Device removed: ' + device.id);
    this.dispatch(actions.deviceRemoved(device));
  }

  onDeviceUpdated(adbKitDevice) {
    let device = this.getDevice(adbKitDevice);
    Object.assign(device, adbKitDevice);
    device.onPropertiesUpdated();
    log.debug('Device updated: ' + device.id);
    this.dispatch(actions.deviceUpdated(device));
  }

  onDeviceFeaturesUpdated(adbKitDevice) {
    let device = this.getDevice(adbKitDevice);
    Object.assign(device, adbKitDevice);
    device.onFeaturesUpdated(device.features);
    device.onPropertiesUpdated();
    log.debug('Device features updated: ' + device.id);
    this.dispatch(actions.deviceUpdated(device));
  }

}