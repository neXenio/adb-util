export const deviceAdded = (device) => ({
  type: 'DEVICE_ADDED',
  payload: device
});

export const deviceRemoved = (device) => ({
  type: 'DEVICE_REMOVED',
  payload: device
});

export const deviceUpdated = (device) => ({
  type: 'DEVICE_UPDATED',
  payload: device
});

export const deviceDiscovered = (device) => ({
  type: 'DEVICE_DISCOVERED',
  payload: device
});

export const sidebarSelectionChanged = (item) => ({
  type: 'SIDEBAR_SELECTION_CHANGED',
  payload: item
});