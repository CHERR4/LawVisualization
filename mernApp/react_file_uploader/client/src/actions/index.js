import fetch from 'cross-fetch'
//https://redux.js.org/advanced/async-actions
export const SELECT_FILE = "SELECT_FILE";
export const ADD_FILES = "ADD_FILES";
export const LOAD_TREE = "LOAD_TREE";
export const UPLOAD_FILE = "UPLOAD_DOCUMENT";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS"
export const UPLOAD_FILE_FAILED = "UPLOAD_FILE_FAILED"


export function selectFile(payload) {
    return { type: SELECT_FILE, payload}
}

export function addFiles(payload) {
    return { type: ADD_FILES, payload}
}

export function getSelected() {
    return { type: "SELECTED_REQUEST" };
}

export function loadTree(payload) {
    return {
        type: LOAD_TREE, payload
    };
}

export function uploadFile(payload) {

    return function(dispatch) {

        dispatch(selectFile(payload))

        return fetch({
            url: '/upload',
            method: 'POST',
            body: payload,
        })
        .then(file =>
            dispatch(
                uploadFileSuccess(file)
            ),
            error => console.log('An error ocurred.', error)
        )
    }
}

export function uploadFileSuccess(payload) {
    return {
        type: UPLOAD_FILE_SUCCESS, payload
    }
}

export function uploadFileFailed(payload) {
    return {
        type: UPLOAD_FILE_FAILED, payload
    }
}