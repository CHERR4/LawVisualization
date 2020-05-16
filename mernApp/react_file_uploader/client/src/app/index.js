import React from 'react';
import SearchAppBar from '../components/SearchAppBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LawTree, LawUpload, LawWordCloud } from '../pages'
import Grid from '@material-ui/core/Grid';



function App() {
  return (
    <Router>
      <Grid container>
        <SearchAppBar/>
        <Switch>
          <Route path="/lawTree" exact component={LawTree}/>
          <Route path="/lawUpload" exact component={LawUpload}/>
          <Route path="/lawWordcloud" exact component={LawWordCloud}/>
        </Switch>
      </Grid>
    </Router>
  )
}

export default App;
