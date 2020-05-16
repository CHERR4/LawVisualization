import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { makeStyles, ListSubheader } from '@material-ui/core';
import { connect, useSelector } from "react-redux";
import store from '../store/index'
// https://github.com/valentinogagliardi/react-redux-tutorial/blob/your-first-redux-saga/src/js/components/Form.js

import { loadTree } from "../actions/index"

const useStyles =  makeStyles(() => ({

    card: {
        maxWidth: 500
    }
  }));

const mapDispatchToProps = (dispatch) => {
  return {
    loadTree: file => store.dispatch(loadTree(file))
  };
}


const ConnectedListFiles = (props) => {
  const handleClick = (file)  => {
    console.log(file)
    props.loadTree({ file })
  }

    const files = useSelector(state => state.files);
    const selected_file = useSelector(state => state.selected_file)
    // const [selectedFile, setSelectedFile] = useState('bo291_ANTES%20GOBIERNO.pdf');

    const classes = useStyles();

    return (
        <div >
          <List aria-labelledby="Uploaded files">
            <ListSubheader>Uploaded files</ListSubheader>
            {files ? files.map((document) =>
                <Card className={classes.card} varian="outlined">
                    <CardContent>
                      <ListItem button value={document} selected={selected_file===document} onClick={() => handleClick(document)}>
                        <ListItemText primary={document}/>
                      </ListItem>
                    </CardContent>
                </Card>
            ) : null }
          </List>
        </div>
    )
}

const ListFiles = connect(null, 
  mapDispatchToProps)(ConnectedListFiles);

export default ListFiles
/*
export function useGetDirFiles(dir) {
    console.log("useGetDirFiles: " + dir)
    const [data, setData] = useState();
    useEffect(() => {
      axios.get("http://localhost:5000/uploads").then(response =>{
        setData(response.data);
      })
    }, [dir])
    console.log(data)
    return data
  }
*/