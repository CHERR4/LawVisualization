import React, { Component, Fragment } from 'react'
import FileUpload from '../components/FileUpload'
import PdfComponent from '../components/PdfComponent'
import { selectFile, uploadFile, loadTree } from '../actions'
import { useSelector, connect } from 'react-redux'



const  LawUpload = () =>{
    const selectedFile =  useSelector(state => state.selectedFile);
    console.log(selectedFile)
    return (
        <Fragment>
        <FileUpload/>
        { selectedFile ?
            <PdfComponent pathToPdf={"uploads/" + selectedFile}/> : null
        }
        </Fragment>
    )
    
}


export default LawUpload