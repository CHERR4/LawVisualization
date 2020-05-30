import React from 'react'
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux'

const useStyles =  makeStyles((theme) => ({
    root: {
      margin: "auto",
      marginTop: "5em",
    },
    
  }));

const LawWordcloudComponent = (props) => {
    const classes = useStyles();
    const selected_file = useSelector(state => state.selected_file)
    const wordcloud = useSelector(state => state.law_wordcloud)


    return (
        <div className={classes.root}>
        <img height="100%" width="100%" src={wordcloud} alt='' />
    </div>
    );
}

export default LawWordcloudComponent;