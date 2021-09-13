import { ActionType } from "../action/actions";
import initialState from "./initialState";

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.SET_USER_DATA:
            return {
                ...state,
                user: action.data
            }
        case ActionType.SET_DATETIME_NOW:
            return {
                ...state,
                datetime: action.data
            }
        default:
            return state
    }
}

export default rootReducer