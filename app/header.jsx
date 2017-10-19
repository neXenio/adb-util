import React from "react";
const log = require('electron-log');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;
import { connect } from 'react-redux';

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
    electron.remote.getCurrentWindow().webContents.send('portscan-requested');
  }

}

const mapStateToProps = (state) => {
  return {
    navigation: state.navigation
  };
}

export default connect(
  mapStateToProps
)(Header);
