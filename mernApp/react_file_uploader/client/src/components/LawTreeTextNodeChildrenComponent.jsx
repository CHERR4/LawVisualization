import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

// https://material-ui.com/es/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }, 
  capitulo: {
    fontsize: "2em",
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: "0.7em",
  }, 
  seccion: {
    fontsize: "2em",
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
    marginBottom: "0.7em",
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

function switchStyle(token, classes) {
  var tokenStr = String(token)
  if(isArtículo(tokenStr)) {
    return classes.articulo
  } else if (isSeccion(tokenStr)) {
    return classes.seccion
  } else if(isCapitulo(tokenStr)) {
    return classes.capitulo
  } else {
    return classes.apartado
  }
}


export default function LawTreeTextNodeChildrenComponent(data) {
  const classes = useStyles();
  data = data.children
  return (
    <Grid container>
      {data.map((item) =>
      Array.isArray(item.children) ?
        <div>
          {item.shortname ?  
          <div>
          <Typography className={switchStyle(item.shortname, classes)}>{item.shortname}</Typography> 
          <Typography className={switchStyle(item.name, classes)}>{item.name}</Typography> 
          </div>
          : <Typography className={switchStyle(item.name, classes)}>{item.name}</Typography>}
            <Grid container justify="center" spacing={2}>
              <Grid item xs={12}>
             <LawTreeTextNodeChildrenComponent children={item.children}/>
            </Grid>
          </Grid>
        </div>
        :         <div>
        {item.shortname ?  
        <div>
        <Typography className={switchStyle(item.shortname, classes)}>{item.shortname}</Typography> 
        <Typography  className={switchStyle(item.name, classes)}>{item.name}</Typography> 
        </div>
        : <Typography className={switchStyle(item.name, classes)}>{item.name}</Typography>}
      </div>
      )}
  </Grid>
);
}
