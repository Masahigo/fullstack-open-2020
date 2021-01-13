import React from 'react'
import { useSelector } from 'react-redux'
import {
  Alert,
} from '@material-ui/lab'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  
  if (notification === null) {
    return null
  }

  /*const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }*/

  return (
    <div>
      <Alert severity="success">
        {notification}
      </Alert>
    </div>
  )
}

export default Notification