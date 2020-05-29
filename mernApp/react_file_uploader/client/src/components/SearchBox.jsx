import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import store from '../store';
import { connect } from 'react-redux';
import { filterTree, filterArticulos } from '../actions/index';
import { useSelector } from 'react-redux'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      },
      searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
      }, 
      button: {
        margin: theme.spacing(1),
        color: 'white',
      },
}));

const mapDispatchToProps = (dispatch) => {
  return {
    filterTree: filter => store.dispatch(filterTree(filter)),
    filterArticulos: filter => store.dispatch(filterArticulos(filter))
  }
}


const ConnectedSearchBox = (props) => {

    const [filter, setFilter] = useState('');
    const [type, setType] = useState('tree');
    const selectedFile = useSelector(state => state.selected_file);

    const classes = useStyles();

    const onChange = e => {
      setFilter(e.target.value)
    }

    const handleSearch = (event, newSearch) => {
      setType(newSearch)
    }

    const onSubmit = (e) => {
      e.preventDefault();
      console.log(filter)
      if(type === 'tree') {
        props.filterTree({filter, selectedFile});
      }
      if(type === 'articulo') {
        props.filterArticulos({filter, selectedFile});
      }
      
    }

    return (
        <form onSubmit={onSubmit}>        
          <Grid container className={classes.root} spacing ={2}>
            <Grid item xs={6}>
              <Grid container justify="center">
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                </div>
                  <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={onChange}
                  />

                </div>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container justify="center">
              <ToggleButtonGroup
                value={type}
                exclusive
                onChange={handleSearch}
                aria-label="text alignment"
                >
                <ToggleButton value="tree" aria-label="Tree search">
                  Tree
                </ToggleButton>
                <ToggleButton value="articulo" aria-label="Articulo search">
                  Articulo
                </ToggleButton>
              </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
      </form>
    )
}

const SearchBox = connect(null, mapDispatchToProps)(ConnectedSearchBox)

export default SearchBox;