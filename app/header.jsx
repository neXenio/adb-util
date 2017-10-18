import React from "react";
const log = require('electron-log');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;
const ip = require('ip');
import { connect } from 'react-redux'
var portscanner = require('portscanner')

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="toolbar toolbar-header" style={{WebkitAppRegion: 'drag'}}>
        <h1 className="title">ADB Util</h1>

        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default active">
              <span className="icon icon-home"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-folder"></span>
            </button>
            <button className="btn btn-default" onClick={() => {this.requestPortscan();}}>
              <span className="icon icon-cloud"></span>
            </button>
          </div>

          <button className="btn btn-default">
            <span className="icon icon-search icon-text"></span>
            Filters
          </button>

          <button className="btn btn-default pull-right" onClick={() => {shell.openExternal('https://github.com/nexenio/adb-util');}}>
            <span className="icon icon-github"></span>
          </button>
        </div>
      </header>
    );
  }

  requestPortscan() {
    log.debug('Requesting portscan');
    const currentIp = ip.address();
    const baseIp = currentIp.substring(0, currentIp.lastIndexOf('.') + 1);
    const port = 5555;

    for (let i = 0; i <= 255; i++) {
      const scannedIp = baseIp + i;
      portscanner.checkPortStatus(port, scannedIp)
        .then((status) => {
          if (status === 'open') {
            log.debug('Found open port at:', scannedIp);
            ipcRenderer.send('adbkit-connect-device', scannedIp);
          }
        }).catch((err) => {
          log.error('Unable to scan ports:', err);
        });
    }
  }

}

const mapStateToProps = (state) => {
  return {
    navigation: state.navigation
  };
}

const mapDispatchToProps = ({
  
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
