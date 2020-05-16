import { createStore, applyMiddleware } from "redux";
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from "../reducers/index";
import { getUploads } from "../actions";

const loggerMiddleware = createLogger()

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

// Actions dispatched on init
store.dispatch(getUploads())

export default store;