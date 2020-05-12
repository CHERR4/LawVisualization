import { createStore, applyMiddleware } from "redux";
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from "../reducers/index";

const loggerMiddleware = createLogger()

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

// store.dispatch(selectFile('reactjs'))
// store.dispatch(uploadFile('reactjs')).then(() => console.log(store.getState()))

export default store;