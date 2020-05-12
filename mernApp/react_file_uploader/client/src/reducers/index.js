import { SELECT_FILE } from "../actions/index"
import { ADD_FILES } from "../actions/index"
import { LOAD_TREE } from "../actions/index"
import { UPLOAD_FILE } from "../actions/index"

const initialState = {
    selected_file: null,
    files: [],
    law_tree: null
};

function rootReducer(state = initialState, action) {
    if (action.type === SELECT_FILE || action.type === UPLOAD_FILE) {
        console.log("action", action)
        return Object.assign({}, state, {
            selected_file: action.payload
        });
    } 
    if(action.type === ADD_FILES) {
        return Object.assign({}, state, {
            files: state.files.concat(action.payload)
        })
    }
    if(action.type === LOAD_TREE) {
        return Object.assign({}, state, {
            law_tree: action.payload
        });
    }
    return state;
}

export default rootReducer;