import React from 'react'
import ListFiles from '../components/ListUploadedFiles'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import { LawWordcloudComponent } from '../components/index';


// https://stackoverflow.com/questions/21285923/reactjs-two-components-communicating

const useStyles = makeStyles({
    root: {
        marginTop: "0em",
        marginLeft: "0em",
        flexGrow:1,
        alignContent: "center"
    }
});


const LawWordcloud = () => {

    const classes = useStyles();

    return (
        <Grid container  direction="row" justify="center" alignItems="flex-start" className={classes.root} >
            <Grid item xs={2}>
                <Grid container>
                    <ListFiles dir="public/uploads"/>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <Grid container>
                    <LawWordcloudComponent/>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default LawWordcloud
