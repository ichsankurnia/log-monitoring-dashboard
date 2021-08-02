export const ActionType = {
    SET_USER_DATA: "SET_USER_DATA"
}

export const setUserData = (payload) => {
    return {
        type: ActionType.SET_USER_DATA,
        data: payload
    }
}
