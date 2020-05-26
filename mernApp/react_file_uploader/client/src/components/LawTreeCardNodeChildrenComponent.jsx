import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';

// https://material-ui.com/es/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


export default function LawTreeCardNodeChildrenComponent(data) {
  const classes = useStyles();
  data = data.children
  return (
    <Grid container className={classes.root} spacing={2}>
      {data.map((item) =>
      Array.isArray(item.children) ?
        <ExpansionPanel varian="outlined">   
          <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header">
          {item.shortname ? <h3>{item.shortname}</h3> : <h4>{item.name}</h4>}
          </ExpansionPanelSummary>    
          <ExpansionPanelDetails>
            <Grid container justify="center" spacing={2}>
              <Grid item xs={12}>
                {item.shortname ?               
                <div>
                  <h4>{item.name}</h4>
                  </div> : null}
              </Grid>
              <Grid item xs={12}>
             <LawTreeCardNodeChildrenComponent children={item.children}/>
            </Grid>
          </Grid>
          </ExpansionPanelDetails>  
        </ExpansionPanel>
        : <div>
          <ExpansionPanel varian="outlined"> 
          <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header">
          {item.shortname ? <h3>{item.shortname}</h3> : <h4>{item.name}</h4>}
          </ExpansionPanelSummary>    
            <ExpansionPanelDetails>
              <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                  {item.shortname ?               
                  <div>
                    <h4>{item.name}</h4>
                    </div> : null}
                </Grid>
                <Grid item xs={12}>
              </Grid>
            </Grid>
            </ExpansionPanelDetails>  
          </ExpansionPanel>
        </div>
      )}
  </Grid>
);
}
