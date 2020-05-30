import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LawTreeCardNodeChildrenComponent from './LawTreeCardNodeChildrenComponent';
import Grid from '@material-ui/core/Grid';
import { useSelector } from "react-redux";
import { Typography } from '@material-ui/core';


// https://material-ui.com/es/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    width: '1 00%',
  },
  heading: {
    alignContent: "center",
  },
  capitulo: {
  }, 
  seccion: {

  },
  articulo: {

  },
  apartado: {

  },
  titulo: {

  }
}));

function isCapitulo(token) {
  var regexp = /Capítulo/
  var pos = token.search(regexp)
  return pos === 1 || pos === 0
}

function isArtículo(token) {
  var regexp = /Artículo/
  var pos = token.search(regexp)
  return pos === 1 || pos === 0
}

function isSeccion(token) {
  var regexp = /Sección/
  var pos = token.search(regexp)
  return pos === 1 || pos === 0
}

function isTitulo(token) {
  var regexp = /Título/
  var pos = token.search(regexp)
  return pos === 1 || pos === 0
}

function switchStyle(token, classes) {
  var tokenStr = String(token)
  if(isArtículo(tokenStr)) {
    return classes.articulo
  } else if (isSeccion(tokenStr)) {
    return classes.seccion
  } else if(isCapitulo(tokenStr)) {
    return classes.capitulo
  } else if(isTitulo(tokenStr)){
    return classes.titulo
  } else {
    return classes.apartado
  }
}

export default function LawTreeCardsComponent() {
  const selected_file = useSelector(state => state.selected_file)
  const data = useSelector(state => state.law_tree);
  const classes = useStyles();
  let array = []
  if(Array.isArray(data)){
    for(let i=0; i< data.length;i++){
      array.push(JSON.parse(data[i]))
    }
  } else {
    array.push(JSON.parse(data))
  }

  console.log(array)
  return ( 
    array[0] !== null ?
      <div className={classes.root}>
        {selected_file ? <h2 className={classes.heading}>{selected_file}</h2> : null}
        {array ? array.map((item) =>
        <Grid item xs={12}>
          <ExpansionPanel>   
            <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
            <h3>{item.shortname}</h3>
            </ExpansionPanelSummary>      
            <ExpansionPanelDetails>
              <Grid container>
                  <Grid item xs={12}>
                      <Grid container>
                        <p>{item.name}</p>
                      </Grid>
                  </Grid>
                  <Grid item xs={12}>
                      <Grid container>
                        {Array.isArray(item.children) ? <LawTreeCardNodeChildrenComponent children={item.children}/> : null}
                      </Grid>
                  </Grid>
              </Grid>
            </ExpansionPanelDetails>   
          </ExpansionPanel>
          </Grid>
        ) : null}
    </div>
    : null
  );
}
