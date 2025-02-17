import { SELECT_FILE_SUCCESS, ADD_FILES, GET_UPLOADS_SUCCESS,
     FILTER_TREE_SUCCESS, LOAD_TREE_SUCCESS, CHANGE_OPEN_SUCCESS, 
     LOAD_WORDCLOUD_SUCCESS } from "../actions/index"

const initialState = {
    selected_file: null,
    files: [],
    law_tree: null,
    law_wordcloud: null,
    open: true
};

function rootReducer(state = initialState, action) {
    console.log(state)
    console.log(action.payload)
    console.log(action.type)
    if (action.type === SELECT_FILE_SUCCESS) {
        console.log(action.payload)
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
        });
    }
    if(action.type === LOAD_WORDCLOUD_SUCCESS) {
        console.log(action.payload)
        return Object.assign({}, state, {
            law_wordcloud: action.payload.wordcloud
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
    if(action.type === CHANGE_OPEN_SUCCESS) {
        return Object.assign({}, state, {
            open: action.payload
        })
    }
    return state;
}

export default rootReducer;