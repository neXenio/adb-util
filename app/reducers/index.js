import { combineReducers } from 'redux'
import devices from './devices.js'
import navigation from './navigation.js'

const app = combineReducers({
  devices, navigation
})

export default app