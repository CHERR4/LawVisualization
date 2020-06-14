import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';




class Links extends Component {


    render() {

        return (
            <Fragment>
                <NavLink to="/" style={{ textDecoration: 'none', color: 'unset' }} >
                    <ListItem button>
                        <ListItemText primary="App"/>
                    </ListItem>
                </NavLink >
                <NavLink to="/lawTree" style={{ textDecoration: 'none', color: 'unset' }} >
                    <ListItem button>
                        <ListItemText primary="lawTree"/>
                    </ListItem>
                </NavLink >
                <NavLink to="/lawUpload" style={{ textDecoration: 'none', color: 'unset' }} >
                    <ListItem button>
                        <ListItemText primary="lawUpload"/>
                    </ListItem>
                </NavLink >
            </Fragment>
        )
    }
}

export default Links
