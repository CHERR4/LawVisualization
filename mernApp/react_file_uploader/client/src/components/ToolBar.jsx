import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import  SearchBox  from './SearchBox'


const ToolBarApp = (props) => {

    return (
        <Grid container justify="space-between" spacing={2}>
            <Grid item xs={3} justify="flex-start">
                <Grid container>
                    <Typography variant="h6" noWrap>
                    Parlamento de Canarias
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <Grid container justify="flex-end">
                    <SearchBox/>
                </Grid>
            </Grid>
        </Grid>
    );
  }
  
  
  export default ToolBarApp