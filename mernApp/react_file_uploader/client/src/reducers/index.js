import { SELECT_FILE, ADD_FILES, LOAD_TREE,
     UPLOAD_FILE, UPLOAD_FILE_SUCCESS } from "../actions/index"

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
    if(action.type === UPLOAD_FILE_SUCCESS) {
        console.log(action.payload);
        console.log(action.payload.data);
        console.log(action.payload.data.fileName);
        return Object.assign({}, state, {
            selected_file: action.payload.data.fileName
        })
    }
    return state;
}

export default rootReducer;