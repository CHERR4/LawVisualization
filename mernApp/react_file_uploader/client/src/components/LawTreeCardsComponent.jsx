import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LawTreeCardNodeChildrenComponent from './LawTreeCardNodeChildrenComponent';
import Grid from '@material-ui/core/Grid';
// https://material-ui.com/es/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    width: '200%',
    marginRight: '5em',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function LawTreeCardsComponent(data) {
  const classes = useStyles();
  let array = []
  
  for(let i=0; i< data.data.length;i++){
    array.push(JSON.parse(data.data[i]))
  }
  console.log(array)
  return (
      <div className={classes.root}>
        {array.map((item) =>
        <Grid item xs={12}>
          <ExpansionPanel>   
            <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
            <h3>{item.name}</h3>
            </ExpansionPanelSummary>      
            <ExpansionPanelDetails>
              {Array.isArray(item.children) ? LawTreeCardNodeChildrenComponent(item.children) : null}
            </ExpansionPanelDetails>   
          </ExpansionPanel>
          </Grid>
        )}
    </div>
  );
}
