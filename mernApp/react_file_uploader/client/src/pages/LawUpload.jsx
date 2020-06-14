import React, { Fragment } from 'react'
import { FileUpload, ListFiles, PdfComponent } from '../components'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root: {
        flexGrow:1,
        // alignContent: "center"
    }
});

const  LawUpload = () =>{
    const classes = useStyles();
    const selectedFile =  useSelector(state => state.selected_file);
    console.log(selectedFile)
    return (
        <Fragment>
        <Grid container direction="row" justify="space-around" alignItems="flex-start" className={classes.root} spacing={0}>
            <Grid item xs={2}>  
                <Grid container >
                    <ListFiles dir="public/uploads"/>
                </Grid>
            </Grid>
            <Grid item xs={10}>
                <Grid container alignItems="flex-start" spacing={2}>
                    <Grid item xs={12} >
                        <Grid container >
                            <FileUpload/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container >
                            { selectedFile ?
                            <PdfComponent pathToPdf={"uploads/" + selectedFile}/> : null
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        </Fragment>
    )
    
}

export default LawUpload