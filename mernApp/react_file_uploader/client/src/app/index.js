import React from 'react';
import SearchAppBar from '../components/SearchAppBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LawTree, LawUpload, LawWordCloud, LawText } from '../pages'
import Grid from '@material-ui/core/Grid';
import { createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
const theme = createMuiTheme({
  props: {
    MuiTypography: {
      variantMapping: {
        h1: 'h2',
        h2: 'h2',
        h3: 'h2',
        h4: 'h2',
        h5: 'h2',
        h6: 'h2',
        subtitle1: 'h2',
        subtitle2: 'h2',
        body1: 'span',
        body2: 'span',
      },
    },
  },
});



function App() {
  return (
    <Typography>
    <Router>
      <Grid container>
        <SearchAppBar/>
        <Switch>
          <Route path="/lawTree" exact component={LawTree}/>
          <Route path="/lawUpload" exact component={LawUpload}/>
          <Route path="/lawWordcloud" exact component={LawWordCloud}/>
          <Route path="/lawText" exact component={LawText}/>
        </Switch>
      </Grid>
    </Router>
    </Typography>
  )
}

export default App;
