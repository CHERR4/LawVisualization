import React from 'react'
import ListFiles from '../components/ListUploadedFiles'
import { LawTreeTextComponent, LawWordcloudComponent } from '../components'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';


// https://stackoverflow.com/questions/21285923/reactjs-two-components-communicating

const useStyles = makeStyles({
    root: {
        marginTop: "0em",
        marginLeft: "0em",
        flexGrow:1,
        alignContent: "center"
    }
});


const LawText = () => {

    const classes = useStyles();

    return (
        <Grid container direction="row" justify="space-around" alignItems="flex-start" className={classes.root} spacing={0}>
            <Grid item xs={2}>  
                <Grid container >
                    <ListFiles dir="public/uploads"/>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <Grid container>
                    <Grid item>
                        <Grid container>
                            <LawWordcloudComponent/>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container>
                            <LawTreeTextComponent/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default LawText
