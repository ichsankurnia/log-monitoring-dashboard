import { createStore } from "redux"
import rootReducer from "../reducer/rootReducer"

const configureStore = () => {
    return createStore(rootReducer)
}

export default configureStore