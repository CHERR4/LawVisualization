import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ListFiles from '../components/ListUploadedFiles'
import LawTreeCards from '../components/LawTreeCardsComponent'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import axios from 'axios'


// https://stackoverflow.com/questions/21285923/reactjs-two-components-communicating

const useStyles = makeStyles({
    root: {
        marginTop: "5em",
        flexGrow:1,
    }
});


const LawTree = () => {

    const classes = useStyles();
    const selectedFile = useSelector(state => state.selected_file);
    const lawTree = useGetLawTree(selectedFile);
    const onSubmit = async e => {
        e.preventDefaul();
        // TODO SAVE TOKENS ON
    }

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={6}>
                <Grid container justify="center">
                    <ListFiles dir="public/uploads"/>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container justify="center">
                                {lawTree ? (
                <LawTreeCards data={lawTree.data}/>
            ): null}
                <form onSubmit={onSubmit}>
                    <input
                    type='submit'
                    value='Upload'
                    className='btn btn-primary btn-block mt-4'
                    />
                </form>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default LawTree

export function useGetLawTree(document) {
    console.log("useGetLawTree: ")
    console.log(document)
    if(document === null){
        document = ''
    }
    const [data, setData] = useState();
    useEffect(() => {
      axios.get("http://localhost:5001/getLawTree/" + document.file).then(response =>{
        setData(response);
      })
    }, [document])
    return data
}