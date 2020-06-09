import axios from 'axios'
import { Wordcloud } from '../components';
//https://redux.js.org/advanced/async-actions
export const SELECT_FILE_SUCCESS = "SELECT_FILE_SUCCESS";
export const ADD_FILES = "ADD_FILES";
export const LOAD_TREE = "LOAD_TREE";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS"
export const UPLOAD_FILE_FAILED = "UPLOAD_FILE_FAILED"
export const GET_UPLOADS_SUCCESS = "GET_UPLOADS_SUCCESS"
export const GET_UPLOADS_FAILED = "GET_UPLOADS_FAILED"
export const FILTER_TREE_SUCCESS = "FILTER_TREE_SUCCESS"
export const FILTER_TREE_FAILED = "FILTER_TREE_FAILED"
export const LOAD_TREE_SUCCESS = "LOAD_TREE_SUCCESS"
export const LOAD_TREE_FAILED = "LOAD_TREE_FAILED"
export const CHANGE_OPEN = "CHANGE_OPEN"
export const CHANGE_OPEN_SUCCESS = "CHANGE_OPEN_SUCCESS"
export const LOAD_WORDCLOUD_SUCCESS = "LOAD_WORDCLOUD_SUCCESS"
export const LOAD_WORDCLOUD_FAILED = "LOAD_WORDCLOUD_FAILED"



export function selectFile(payload) {
    console.log(payload);
    return function(dispatch) {
        dispatch(
            loadTree(payload),
        );
        dispatch(
            loadWordcloud(payload)
        );
        dispatch(
            selectFileSuccess(payload)
        )
    }
}

export function selectFileSuccess(payload) {
    return { type: SELECT_FILE_SUCCESS, payload }
}

export function addFiles(payload) {
    return { type: ADD_FILES, payload}
}

export function getSelected() {
    return { type: "SELECTED_REQUEST" };
}

export function loadTree(payload) {
    console.log(payload)
    return function(dispatch) {
        return axios.get("http://localhost:5001/getLawTree/" + payload.file)
        .then(tree =>
            dispatch(
                loadTreeSuccess({"tree": tree, "file": payload.file}),
            ),
            error =>
            dispatch(
                loadTreeFailed(error)
            )
        )
    };
}

export function loadTreeSuccess(payload) {
    return {
        type: LOAD_TREE_SUCCESS, payload
    }; 
}

export function loadTreeFailed(payload) {
    return {
        type: LOAD_TREE_FAILED, payload
    }; 
}

export function uploadFile(payload) {
    const formData = new FormData();
    formData.append('file', payload.file);
    return  function(dispatch) {

        return axios.post('/upload', formData, {
            headers:{
                'Content-Type': 'application/pdf'
              } 
        }).then(
            file => {
                dispatch(
                    uploadFileSuccess(file),
                );
                dispatch(
                    getUploads()
                    );
                dispatch(loadTree(file))
            },
            error => 
            dispatch(
                uploadFileFailed(error)
            )
        
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

export function getUploads() {
    return function(dispatch) {
        return axios.get("/uploads")
        .then(files => 
            dispatch(
                getUploadsSuccess(files)
            ),
            error => console.log('Get uploads failed', error)
        )
    }
}

export function getUploadsSuccess(payload) {
    return {
        type: GET_UPLOADS_SUCCESS, payload
    }
}

export function getUploadsFailed(payload) {
    return {
        type: GET_UPLOADS_FAILED, payload
    }
}

export function loadWordcloud(payload) {
    console.log(payload)
    return function(dispatch) {
        dispatch(loadWordcloudSuccess({"wordcloud": "http://localhost:5001/getWordcloud/" + payload.file}))
    }
    /*
    return function(dispatch) {
        return axios.get("http://localhost:5001/getWordcloud/" + payload.file)
        .then(wordcloud =>
            dispatch(
                loadWordcloudSuccess({"wordcloud": wordcloud, "file": payload.file}),
            ),
            error =>
            dispatch(
                loadWordcloudFailed(error)
            )
        )
    };
    */
}

export function loadWordcloudSuccess(payload) {
    return {
        type: LOAD_WORDCLOUD_SUCCESS, payload
    }
}

export function loadWordcloudFailed(payload) {
    return {
        type: LOAD_WORDCLOUD_FAILED, payload
    }
}

export function filterTree(payload) {
    console.log(payload)
    const params = {
        "document": payload.selectedFile,
        "filter": payload.filter
    };
    return function(dispatch) {
        return axios.get('http://localhost:5001/getFilterTree', { params })
        .then(tree => 
            dispatch(
                filterTreeSuccess(tree),
            ),
            error => 
            dispatch(
                filterTreeFailed(error)
            )
        )
    }
}

export function filterArticulos(payload) {
    console.log(payload)
    const params = {
        "document": payload.selectedFile,
        "filter": payload.filter,
        "case_sensitive": payload.caseSensitive
    };
    return function(dispatch) {
        return axios.get('http://localhost:5001/getFilterArticulos', { params })
        .then(tree => 
            dispatch(
                filterTreeSuccess(tree),
            ),
            error => 
            dispatch(
                filterTreeFailed(error)
            )
        )
    }
}

export function filterTreeSuccess(payload) {
    return {
        type: FILTER_TREE_SUCCESS, payload
    }
}

export function filterTreeFailed(payload) {
    return {
        type: FILTER_TREE_FAILED, payload
    }
}

export function changeMenu(payload) {
    console.log(payload)
    return function(dispatch) {
        dispatch(
            changeMenuSuccess(payload),
        )
    }
}

export function changeMenuSuccess(payload) {
    return {
        type: CHANGE_OPEN_SUCCESS, payload
    }
}