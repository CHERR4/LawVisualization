import React from 'react'
import ListFiles from '../components/ListUploadedFiles'
import { LawTreeTextComponent } from '../components'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';


// https://stackoverflow.com/questions/21285923/reactjs-two-components-communicating

const useStyles = makeStyles({
    root: {
        marginTop: "6em",
        marginLeft: 260,
        flexGrow:1,
        alignContent: "center"
    }
});


const LawText = () => {

    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={8}>
            <Grid item xs={2}>
                <Grid container justify="flex-start">
                    <ListFiles dir="public/uploads"/>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <Grid container justify="flex-end">
                    <LawTreeTextComponent/>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default LawText
