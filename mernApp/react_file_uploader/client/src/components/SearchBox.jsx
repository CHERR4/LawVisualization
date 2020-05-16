import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import store from '../store';
import { connect } from 'react-redux';
import { filterTree } from '../actions/index';
import { useSelector } from 'react-redux'


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
    filterTree: filter => store.dispatch(filterTree(filter))
  }
}

const ConnectedSearchBox = (props) => {

    const [filter, setFilter] = useState('');
    const selectedFile = useSelector(state => state.selected_file);

    const classes = useStyles();

    const onChange = e => {
      setFilter(e.target.value)
    }

    const onSubmit = (e) => {
      e.preventDefault();
      console.log(filter)
      props.filterTree({filter, selectedFile});
    }

    return (
        <form onSubmit={onSubmit}>
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
            <Button variant="text" 
            className={classes.button}
            startIcon={<SearchIcon />}>
              Search
            </Button>
          </div>
          
      </form>
    )
}

const SearchBox = connect(null, mapDispatchToProps)(ConnectedSearchBox)

export default SearchBox;