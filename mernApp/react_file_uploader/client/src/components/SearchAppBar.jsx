import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useHistory } from 'react-router-dom'
import { AccountTree, CloudUpload, TextFields } from '@material-ui/icons';
import  SearchBox  from './SearchBox'
import { changeMenu } from '../actions'
import store from '../store/index';
import { connect, useSelector } from 'react-redux';
import ToolBarApp from './ToolBar'

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

const mapDispatchToProps = (dispatch) => {
  return {
    changeMenu: value => store.dispatch(changeMenu(value)),
  }
}


const ConnectedPersistentDrawerLeft = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const open = useSelector(state => state.open);
  const history = useHistory();
  const goLawTree = () => history.push('/lawTree');
  const goUpload = () => history.push('/lawUpload');
  const goLawText = () => history.push('/lawText');
  const goWordcloud = () => history.push('/lawWordcloud');

  const handleDrawer = (value) => props.changeMenu(value);


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Grid container direction="row" alignItems="baseline">          
            <Grid item>
              <Grid container >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => handleDrawer(true)}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={8}>
                <ToolBarApp/>
            </Grid>
          </Grid>
        </Toolbar> 
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => handleDrawer(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
         <ListItem button key="Tree" onClick={goLawTree}>
           <ListItemText primary="Tree"/>
           <AccountTree/>
         </ListItem>
         <ListItem button key="Upload" onClick={goUpload}>
           <ListItemText primary="Upload"/>
           <CloudUpload/>
         </ListItem>
         <ListItem button key="Text" onClick={goLawText}>
           <ListItemText primary="Text"/>
           <TextFields/>
         </ListItem>
        </List>
        <ListItem button key="Wordcloud" onClick={goWordcloud}>
           <ListItemText primary="Wordcloud"/>
           <TextFields/>
         </ListItem>
      </Drawer>
    </div>
  );
}

const SearchAppBar = connect(null, mapDispatchToProps)(ConnectedPersistentDrawerLeft)

export default SearchAppBar