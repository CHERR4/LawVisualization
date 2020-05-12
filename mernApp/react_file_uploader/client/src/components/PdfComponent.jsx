import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles =  makeStyles((theme) => ({
    root: {
      margin: "auto",
      marginTop: "5em",
    },
    
  }));

const PdfComponent = ({ pathToPdf }) => {
    console.log("pdfComponent: " + pathToPdf)
    console.log(pathToPdf)
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <embed height="1000" width="100%" src={pathToPdf} alt='' type="application/pdf" />
        </div>
    )
}

export default PdfComponent