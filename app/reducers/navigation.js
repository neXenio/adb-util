const log = require('electron-log');

const navigation = (state = {}, action) => {
  //log.debug(`Received navigation action:\n${JSON.stringify(action, null, 2)}`);
  switch (action.type) {
    case 'SIDEBAR_SELECTION_CHANGED':
      return Object.assign({}, state, {
        selectedSidebarItem: action.payload
      });
    default:
      return state;
  }
};

export default navigation;