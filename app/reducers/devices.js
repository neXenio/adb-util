const log = require('electron-log');

const devices = (state = {}, action) => {
  //log.debug(`Received action:\n${JSON.stringify(action, null, 2)}`);
  switch (action.type) {
    case 'DEVICE_ADDED':
    case 'DEVICE_REMOVED':
    case 'DEVICE_UPDATED':
    case 'DEVICE_DISCOVERED':
      return Object.assign({}, state, {
        [action.payload.id]: action.payload
      });
    default:
      return state;
  }
};

export default devices;