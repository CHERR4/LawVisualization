import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import  SearchBox  from './SearchBox'


const ToolBarApp = (props) => {

    return (
        <div>
            <Grid container justify="space-between">
                <Grid item >
                    <Grid container justify="flex-start">
                        <Typography variant="h6" noWrap>
                        Parlamento de Canarias
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify="center">
                        <SearchBox/>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
  }
  
  
  export default ToolBarApp