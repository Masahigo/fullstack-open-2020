import { createStore, combineReducers,applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'

const reducer = combineReducers({
  blogs: blogReducer,
  notification: notificationReducer,
  user: loginReducer,
})

export default createStore(reducer, composeWithDevTools(
  applyMiddleware(thunk)
))