import React, { useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase';
import store from '../store';
import { connect } from 'react-redux';
import { filterTree, filterArticulos, filterRegexp, filterWords } from '../actions/index';
import { useSelector } from 'react-redux'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';



import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  root: { 
    //  width: '100%',
    //minWidth: '50em'
    marginRight: '5em',
    alignContent: "center",
    justifyContent: "center",
    position: "relative"
  },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(0),
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
        marginLeft: "2em"
      },
      inputInput: {
        // padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        // paddingLeft:"theme.spacing(0)}px",
        // transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '40ch',
        },
        height: '2.1em'
      }, 
      button: {
        margin: theme.spacing(1),
        color: 'white',
      },
}));

const mapDispatchToProps = (dispatch) => {
  return {
    filterTree: filter => store.dispatch(filterTree(filter)),
    filterArticulos: filter => store.dispatch(filterArticulos(filter)),
    filterRegexp: filter => store.dispatch(filterRegexp(filter)),
    filterWords: filter => store.dispatch(filterWords(filter))
  }
}


const ConnectedSearchBox = (props) => {

    const [filter, setFilter] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false)
    const [type, setType] = useState('tree');
    const selectedFile = useSelector(state => state.selected_file);

    const classes = useStyles();

    const onChange = e => {
      setFilter(e.target.value)
    }

    const handleSearch = (event, newSearch) => {
      setType(newSearch)
    }

    const handleCaseSensitive = e => {
      setCaseSensitive(!caseSensitive)
    }

    const onSubmit = (e) => {
      e.preventDefault();
      console.log(filter)
      if(type === 'tree') {
        props.filterTree({filter, selectedFile});
      }
      if(type === 'articulo') {
        props.filterArticulos({filter, selectedFile, caseSensitive});
      }
      if(type === 'regexp') {
        props.filterRegexp({filter, selectedFile, caseSensitive});
      }
      if(type === 'words') {
        props.filterWords({filter, selectedFile, caseSensitive});
      }
      
    }

    return (
        <form onSubmit={onSubmit}>        
          <Grid container className={classes.root} alignItems="space-evenly">
            <Grid item xs={2} justify="center">
              <Grid container justify="flex-end">
              <FormControlLabel
                control={
                  <Switch
                    checked={caseSensitive}
                    onChange={handleCaseSensitive}
                    name="true"
                  />
                }
                label="Sensibilidad a Mayúsculas"
                labelPlacement="start"
              />
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container justify="flex-end">
                <div className={classes.search}>
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
            <Grid item xs={4} justify="center">
              <Grid container  className={classes.root}>
              <ToggleButtonGroup
                value={type}
                exclusive
                onChange={handleSearch}
                aria-label="text alignment"
                >
                <ToggleButton value="tree" aria-label="Tree search">
                  Token
                </ToggleButton>
                <ToggleButton value="articulo" aria-label="Articulo search">
                  Texto
                </ToggleButton>
                <ToggleButton value="regexp" aria-label="Regexp search">
                  Regexp
                </ToggleButton>
                <ToggleButton value="words" aria-label="words">
                  Palabras
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