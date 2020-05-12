import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
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
                <Card>
                  <CardHeader title={item.name}/>
                </Card> : null}
              </Grid>
              <Grid item xs={12}>
             {LawTreeCardNodeChildrenComponent(item.children)}
            </Grid>
          </Grid>
          </ExpansionPanelDetails>  
        </ExpansionPanel>
        : <Card>
          <CardHeader title={item.name}/>
        </Card>
      )}
  </Grid>
);
}
