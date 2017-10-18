import React from "react";
const log = require('electron-log');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;
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
    const baseIp = '10.30.10.';
    const port = 5555;
    for (let i = 0; i <= 255; i++) {
      const ip = baseIp + i;
      portscanner.checkPortStatus(port, ip, function(err, status){
        if (status == 'open') {
          log.debug('Found open port at', ip);
        }
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
