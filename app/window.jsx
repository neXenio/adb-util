import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import App from './app.jsx';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

const { DeviceManager } = require('../adb/device-manager');


const initialState = {
  navigation: {
    selectedSidebarItem: {
      id: 'overview', name: 'Overview'
    }
  },
  devices: []
};
const store = createStore(reducer, initialState);
const deviceManager = new DeviceManager(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.querySelector("#main"));