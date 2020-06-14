import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LawTreeTextNodeChildrenComponent  from './LawTreeTextNodeChildrenComponent';
import Grid from '@material-ui/core/Grid';
import { useSelector } from "react-redux";
import { Typography } from '@material-ui/core';

// https://material-ui.com/es/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '1em',
    width: '200%',
  },
  heading: {
    alignContent: "center",
  },
  capitulo: {
    fontSize: "3em",
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: "0.7em",
  }, 
  seccion: {
    fontSize: "2.5em",
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: "0.5em",
  },
  articulo: {
    fontsize: "2em",
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "left",
    marginBottom: "0.7em",
  },
  apartado: {
    fontsize: "2em",
    fontWeight: theme.typography.fontWeightRegular,
    marginBottom: "0.7em",
  },
  titulo: {
    fontsize: "2em",
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
    marginBottom: "0.7em",
  },
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
  var regexp2 = /TÍTULO/
  var pos = token.search(regexp)
  if(!(pos === 1 || pos === 0)) {
    pos = token.search(regexp2)
  }
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

export default function LawTreeTextComponent() {
  const selected_file = useSelector(state => state.selected_file)
  const data = useSelector(state => state.law_tree);
  console.log(data)
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
    array[0] !== null  ?
      <div className={classes.root}>
        {selected_file ? <h2 className={classes.heading}>{selected_file}</h2> : null}
        {array ? array.map((item) =>
        <Grid item xs={12}> 
            <Typography className={switchStyle(item.shortname, classes)}>{item.shortname}</Typography>
            {item.name? <Typography className={switchStyle(item.name, classes)}>{item.name}</Typography> : null}
              {Array.isArray(item.children) ? <LawTreeTextNodeChildrenComponent children={item.children}/> : null} 
          </Grid>
        ) : null}
    </div>
    : null
  );
}
