import React, { Component } from "react";
import ReactDom from "react-dom";
import { Route } from 'react-router-dom';
import { matchPath, withRouter } from 'react-router';
import { Window, TitleBar, NavPane, NavPaneItem, Text } from 'react-desktop/macOs';
import Header from "./header.jsx"
import Footer from "./footer.jsx"
import Sidebar from "./sidebar.jsx"
import DevicesList from "./devices-list.jsx"
import DevicesTable from "./devices-table.jsx"

require('../index.scss');

const routes = [{
  path: '/',
  exact: true,
  title: 'Home',
  //icon: Icons.welcomeIcon,
  component: DevicesList,
}];

class App extends Component {
  
  render() {
    return (
        <div className="window">
          <Header />
          <div className="window-content">
            <div className="pane-group">
              <Sidebar />
              <DevicesTable />
            </div>
          </div>
          <Footer />
        </div>
    );
  }
}

export default withRouter(App);