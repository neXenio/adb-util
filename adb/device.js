'use strict';

const log = require('electron-log');

export class Device {

  constructor() {
    this.creationDate = new Date();
  }

  static fromPortScan(ipAddress, port) {
    let device = new Device();
    device.id = ipAddress + ':' + port;
    device.ipAddress = ipAddress;
    device.port = port;
    device.androidId = 'Unknown';
    device.hardwareType = device.getHardwareType();
    device.isConnected = false;
    device.readableState = device.getReadableState();
    return device;
  }

  static fromAdbKitDevice(adbKitDevice) {
    let device = new Device();
    device.id = adbKitDevice.id;
    device.androidId = 'Unknown';
    device.hardwareType = device.getHardwareType();
    device.path = adbKitDevice.path;
    device.onConnect();
    return device;
  }

  onConnect() {
    this.isConnected = true;
    this.readableState = this.getReadableState();
    this.connectionDate = new Date();
  }

  onDisconnect() {
    this.isConnected = false;
    this.readableState = this.getReadableState();
    this.disconnectionDate = new Date();
    // should we reset the path here?
  }

  onFeaturesUpdated(features) {
    this.features = features;
    this.hardwareType = this.getHardwareType();
  }

  onPropertiesUpdated() {
    log.debug(`${this.id} properties updated`);
    this.lastUpdateDate = new Date();
    this.hardwareType = this.getHardwareType();
    this.readableModel = this.getReadableModel();
    this.readableName = this.getReadableName();
    this.readableState = this.getReadableState();
  }

  getReadableName() {
    if (this.bluetoothName) {
      return this.bluetoothName;
    } else {
      return 'Unknown';
    }
  }

  getReadableState() {
    let readableState = '';
    if (this.isConnected) {
      readableState = 'Connected';
      if (this.path) {
        readableState += ' via ';
        if (this.path.indexOf('usb') != -1) {
          readableState += 'USB';
        } else {
          readableState += 'TCP';
        }
      }
    } else {
      readableState = 'Disconnected';
    }
    return readableState;
  }

  getReadableModel() {
    let readableModel = '';
    if (this.manufacturer && this.model) {
      // check if model name already contains the manufacturer name
      // e.g. when model is "Huawai Watch" and manufacturer is "Huawai"
      if (this.model.toLowerCase().indexOf(this.manufacturer.toLowerCase()) != -1) {
        readableModel = this.model
      } else {
        readableModel = `${this.manufacturer} ${this.model}`;
      }
    } else {
      if (this.model) {
        readableModel = this.model;
      }
    }
    if (readableModel.length == 0) {
      readableModel = 'Unknown';
    }
    return readableModel;
  }

  getHardwareType() {
    if (!this.features) {
      //log.debug('Unable to get hardware type, no features available');
      return 'Unknown';
    } else if (this.isPhone()) {
      return 'Phone';
    } else if (this.isTablet()) {
      return 'Tablet';
    } else if (this.isWatch()) {
      return 'Watch';
    } else if (this.isTelevision()) {
      return 'TV';
    } else if (this.isEmbedded()) {
      return 'Embedded';
    } else {
      return 'Unknown'
    }
  }

  isPhone() {
    return this.hasFeature('android.hardware.telephony');
  }

  isTablet() {
    // TODO: find a better way to detect tablets
    return !(this.isPhone() || this.isWatch() || this.isTelevision() || this.isEmbedded());
  }

  isWatch() {
    return this.hasFeature('android.hardware.type.watch');
  }

  isTelevision() {
    return this.hasFeature('android.hardware.type.television');
  }

  isEmbedded() {
    return this.hasFeature('android.hardware.type.embedded');
  }

  hasFeature(featureId) {
    if (!this.features) {
      return false;
    }
    return this.features[featureId];
  }

}