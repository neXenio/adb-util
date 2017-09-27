import React from "react";
import { connect } from 'react-redux'
const log = require('electron-log');
const actions = require('./actions');

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const selectedSidebarItem = this.props.navigation.selectedSidebarItem;
    return (
      <div className="pane pane-sm sidebar">
        <nav className="nav-group">
          <h5 className="nav-group-title">Devices</h5>
          <SidebarItem id="overview" iconClassName="icon-menu" text="Overview" onItemClick={this.props.onItemClick} selectedSidebarItem={selectedSidebarItem} />
          <SidebarItem id="phones" iconClassName="icon-mobile" text="Phones & Tablets" onItemClick={this.props.onItemClick} selectedSidebarItem={selectedSidebarItem} />
          <SidebarItem id="wearables" iconClassName="icon-clock" text="Wearables" onItemClick={this.props.onItemClick} selectedSidebarItem={selectedSidebarItem} />
          <SidebarItem id="embedded" iconClassName="icon-lamp" text="Embedded" onItemClick={this.props.onItemClick} selectedSidebarItem={selectedSidebarItem} />
          <SidebarItem id="televisions" iconClassName="icon-monitor" text="Televisions" onItemClick={this.props.onItemClick} selectedSidebarItem={selectedSidebarItem} />
        </nav>
      </div>
    );
  }
}

class SidebarItem extends React.Component {
  render() {
    const isSelected = this.props.id === this.props.selectedSidebarItem.id;
    return (
      <span className={'nav-group-item' + (isSelected ? ' active' : '')} onClick={() => this.props.onItemClick({ id: this.props.id, text: this.props.text})}>
        <span className={'icon ' + this.props.iconClassName}></span>
        {this.props.text}
      </span>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    navigation: state.navigation
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onItemClick: (item) => {
      log.debug(`Selected sidebar item: ${item.id}`);
      dispatch(actions.sidebarSelectionChanged(item))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);