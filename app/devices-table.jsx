import React from "react";

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer; 
import { connect } from 'react-redux'

class DevicesTable extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.setTimeout(() => {
      //this.requestDevicesUpdate();
    }, 1000);
  }

  render() {
    const selectedSidebarItem = this.props.navigation.selectedSidebarItem;
    const devices = this.props.devices.filter((device) => {
      switch (selectedSidebarItem.id) {
        case 'overview': return true;
        case 'phones': return device.isPhone();
        case 'wearables': return device.isWatch();
        case 'embedded': return device.isEmbedded();
        case 'televisions': return device.isTelevision();
        default: return false;
      }
    });

    return (
      <div className="pane">
        <table className="table-striped">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Android ID</th>
              <th>Model</th>
              <th>Name</th>
              <th>Type</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device,index) => <DevicesTableRow device={device} key={device.id} />)}
          </tbody>
        </table>
      </div>
    );
  }

  requestDevicesUpdate() {
    console.log('Requesting devices update');
    ipcRenderer.send('adbkit-update-devices');
  }
}

class DevicesTableRow extends React.Component {
  render() {
    const device = this.props.device;
    return (
      <tr>
        <td>{device.id}</td>
        <td>{device.androidId}</td>
        <td>{device.readableModel}</td>
        <td>{device.readableName}</td>
        <td>{device.hardwareType}</td>
        <td>{device.readableState}</td>
      </tr>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    devices: Object.keys(state.devices).map(key => state.devices[key]),
    navigation: state.navigation
  };
}

const mapDispatchToProps = ({
  
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesTable);
