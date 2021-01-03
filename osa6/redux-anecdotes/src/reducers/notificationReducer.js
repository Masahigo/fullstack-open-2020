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

export const setNotification = notification => {
    return {
        type: 'SET_NOTIFICATION',
        notification,
    }
}

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION',
        notification: null
    }
}

export default notificationReducer