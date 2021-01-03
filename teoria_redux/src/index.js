import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import App from './App'
import noteReducer, { /*initializeNotes*/ } from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'
//import { createNote } from './reducers/noteReducer'
//import { filterChange } from './reducers/filterReducer'
//import noteService from './services/notes'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(
  reducer,
  composeWithDevTools()
)

//noteService.getAll().then(notes =>
//  store.dispatch(initializeNotes(notes))
//)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

//store.subscribe(() => console.log(store.getState()))
//store.dispatch(filterChange('IMPORTANT'))
//store.dispatch(createNote('combineReducers forms one reduces from many simple reducers'))
