import { SELECT_FILE, ADD_FILES
    , GET_UPLOADS_SUCCESS, FILTER_TREE_SUCCESS, LOAD_TREE_SUCCESS } from "../actions/index"

const initialState = {
    selected_file: null,
    files: [],
    law_tree: null
};

function rootReducer(state = initialState, action) {
    if (action.type === SELECT_FILE) {
        console.log("action", action)
        return Object.assign({}, state, {
            selected_file: action.payload.file
        });
    } 
    if(action.type === ADD_FILES) {
        return Object.assign({}, state, {
            files: state.files.concat(action.payload)
        })
    }
    if(action.type === LOAD_TREE_SUCCESS) {
        console.log(action.payload)
        console.log(action.payload.tree.data)
        return Object.assign({}, state, {
            law_tree: action.payload.tree.data,
            selected_file: action.payload.file
        });
    }
    if(action.type === GET_UPLOADS_SUCCESS) {
        console.log(action.payload);
        return Object.assign({}, state, {
            files: action.payload.data
        })
    }
    if(action.type === FILTER_TREE_SUCCESS) {
        console.log(action.payload);
        return Object.assign({}, state, {
            law_tree: action.payload.data
        })
    }
    return state;
}

export default rootReducer;