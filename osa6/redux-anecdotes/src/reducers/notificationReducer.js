const notificationReducer = (state = null, action) => {
    //console.log('ACTION: ', action)
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.notification
        case 'CLEAR_NOTIFICATION':
            return action.notification
        default:
            return state
    }
}

export const setNotification = (notification, timeoutInSeconds) => {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            notification,
        })
        setTimeout(() => {
            dispatch(clearNotification())
          }, timeoutInSeconds*1000)
    }
}

const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION',
        notification: null
    }
}

export default notificationReducer