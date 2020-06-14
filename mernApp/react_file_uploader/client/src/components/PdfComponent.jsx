import React from 'react';
import Grid from '@material-ui/core/Grid';


const PdfComponent = ({ pathToPdf }) => {
    console.log("pdfComponent: " + pathToPdf)
    console.log(pathToPdf)
    return (
      <Grid container alignItems="center" justify="center">
        <Grid item xs={12} container alignItems="center" justify="center">
          <embed height="1000em" width="50%" src={pathToPdf} alt='' type="application/pdf" />
        </Grid>
      </Grid>
    )
}

export default PdfComponent