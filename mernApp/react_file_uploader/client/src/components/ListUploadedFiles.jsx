import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios'
import { connect } from "react-redux";
import store from '../store/index'
// https://github.com/valentinogagliardi/react-redux-tutorial/blob/your-first-redux-saga/src/js/components/Form.js

import { selectFile } from "../actions/index"

const useStyles =  makeStyles((theme) => ({
    root: {
      marginLeft: "0",
      marginBottom: "5em"
    },
    card: {
        maxWidth: 500
    }
  }));

const mapDispatchToProps = (dispatch) => {
  return {
    selectFile: file => store.dispatch(selectFile(file))
  };
}


const ConnectedListFiles = (props) => {
  const handleClick = (file)  => {
    console.log("Hola mundo")
    props.selectFile({ file })
  }

    const files = useGetDirFiles(props.dir);
    // const [selectedFile, setSelectedFile] = useState('bo291_ANTES%20GOBIERNO.pdf');

    const classes = useStyles();

    return (
        <div className={classes.root}>
          <List aria-labelledby="Uploaded files">
            {files ? files.files.map((document) =>
                <Card className={classes.card} varian="outlined">
                    <CardContent>
                      <ListItem button value={document} onClick={() => handleClick(document)}>
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

export function useGetSelectedFile(){
    const [selectedFile] = useState();
    console.log(selectedFile)
    return selectedFile
}