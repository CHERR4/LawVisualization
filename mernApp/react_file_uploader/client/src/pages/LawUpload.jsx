import React from 'react'
import FileUpload from '../components/FileUpload'
import PdfComponent from '../components/PdfComponent'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root: {
        marginTop: "5em",
        flexGrow:1,
    }
});


const  LawUpload = () =>{

    const classes = useStyles();
    const selectedFile =  useSelector(state => state.selected_file);
    console.log(selectedFile)
    return (
        <Grid container className={classes.root} spacing ={2}>
            <Grid item xs={12}>
                <Grid container justify="center">
                <FileUpload/>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="center">
                    { selectedFile ?
                    <PdfComponent pathToPdf={"uploads/" + selectedFile}/> : null
                    }
                </Grid>
            </Grid>
        </Grid>
    )
    
}

export default LawUpload