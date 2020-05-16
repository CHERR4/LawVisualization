import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LawTreeCardNodeChildrenComponent from './LawTreeCardNodeChildrenComponent';
import Grid from '@material-ui/core/Grid';
import { useSelector } from "react-redux";

// https://material-ui.com/es/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '1em',
    width: '200%',
  },
  heading: {
    alignContent: "center",
  },
}));

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
    selected_file ?
      <div className={classes.root}>
        {selected_file ? <h2 className={classes.heading}>{selected_file}</h2> : null}
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
              {Array.isArray(item.children) ? <LawTreeCardNodeChildrenComponent children={item.children}/> : null}
            </ExpansionPanelDetails>   
          </ExpansionPanel>
          </Grid>
        )}
    </div>
    : null
  );
}
