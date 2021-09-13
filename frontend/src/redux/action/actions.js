export const ActionType = {
    SET_USER_DATA: "SET_USER_DATA",
    SET_DATETIME_NOW: "SET_DATETIME_NOW"
}

export const setUserData = (payload) => {
    return {
        type: ActionType.SET_USER_DATA,
        data: payload
    }
}

export const setTimeNow = (momentTime) => {
    return {
        type: ActionType.SET_DATETIME_NOW,
        data: momentTime
    }
}