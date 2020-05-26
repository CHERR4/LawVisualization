import React from 'react'
import ListFiles from '../components/ListUploadedFiles'
import LawTreeCards from '../components/LawTreeCardsComponent'
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


const LawTree = () => {

    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={2}>
                <Grid container justify="flex-start">
                    <ListFiles dir="public/uploads"/>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <Grid container justify="flex-start">
                    <LawTreeCards/>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default LawTree

/*
export function useGetLawTree(document) {
    console.log(document)
    const [data, setData] = useState();
    useEffect(() => {
      axios.get("http://localhost:5001/getLawTree/" + document).then(response =>{
        setData(response);
      })
    }, [document])
    return data
}
*/