import React from 'react';
import SearchAppBar from '../components/SearchAppBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LawTree, LawUpload, LawWordCloud, LawText } from '../pages'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSelector } from "react-redux";

import clsx from 'clsx';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
}));



function App() {
  const classes = useStyles();
  const open = useSelector(state => state.open);
  return (
    <Typography>
    <Router>
      <Grid container>
        <SearchAppBar/>
        <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route path="/lawTree" exact component={LawTree}/>
          <Route path="/lawUpload" exact component={LawUpload}/>
          <Route path="/lawWordcloud" exact component={LawWordCloud}/>
          <Route path="/lawText" exact component={LawText}/>
        </Switch>
      </main>   
      </Grid>
    </Router>
    </Typography>
  )
}

export default App;
