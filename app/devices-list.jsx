import React from "react";

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer; 
import { connect } from 'react-redux'
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
  ListViewSection,
  ListViewSectionHeader,
  ListViewRow,
  ListViewSeparator,
  Text
} from 'react-desktop/macOs';

class DevicesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selected: null };
  }

  componentDidMount() {
    //ipcRenderer.send('adbkit-update-devices');
  }

  render() {
    return (
      <div className="pane">
        <ListView background="#f1f2f4">
          <ListViewHeader>
            <Text size="11" color="#696969">Order by name</Text>
          </ListViewHeader>
          <ListViewSection header={this.renderSectionHeader('Connected')}>
            {this.props.devices.filter(
              (device) => device.isConnected
            ).map(
              (device) => this.renderDevice(device)
            )}
          </ListViewSection>
          <ListViewSeparator/>
          <ListViewSection header={this.renderSectionHeader('Disconnected')}>
            {this.props.devices.filter(
              (device) => !device.isConnected
            ).map(
              (device) => this.renderDevice(device)
            )}
          </ListViewSection>
          <ListViewFooter>
            <Text size="11" color="#696969">Status</Text>
          </ListViewFooter>
        </ListView>
      </div>
    );
  }

  renderSectionHeader(title) {
    return (
      <ListViewSectionHeader>
        {title}
      </ListViewSectionHeader>
    );
  }

  renderDevice(device) {
    return (
      <ListViewRow
        key={device.id}
        onClick={() => this.setState({ selected: device.id })}
        background={this.state.selected === device.id ? '#d8dadc' : null}
      >
        <svg x="0px" y="0px" width="18" height="12" viewBox="0 0 18 12" style={{ marginRight: '6px' }}>
          <path fill="#727476" d="M13.2,0H4.9L0,6.8v3.7C0,11.3,0.7,12,1.5,12h15
    c0.8,0,1.5-0.7,1.5-1.5V6.8L13.2,0z M13.8,6.8L12.3,9L5.9,9L4.2,6.8l-3.1,0l4.2-6h7.4l4.2,6L13.8,6.8z"/>
          <polygon fill="#C9CBCD" points="13.8,6.8 12.3,9 5.9,9 4.2,6.8 1.2,6.7 5.4,0.8 12.8,0.8
    17,6.7 "/>
        </svg>
        <Text color="#414141" size="13">{device.name} ({device.id})</Text>
      </ListViewRow>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    devices: Object.keys(state.devices).map(key => state.devices[key])
  };
}

const mapDispatchToProps = ({
  
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesList);
