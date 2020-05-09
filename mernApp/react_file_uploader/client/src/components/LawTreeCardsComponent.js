import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Card from '@material-ui/core/Card'
import LawTreeComponent from './LawTreeComponent';
import LawTreeCardNodeComponent from './LawTreeCardNodeComponent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import LawTreeCardNodeChildrenComponent from './LawTreeCardNodeChildrenComponent'
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
          <ExpansionPanel>   
            <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
            {item.name}
            </ExpansionPanelSummary>      
            <ExpansionPanelDetails>
              {Array.isArray(item.children) ? LawTreeCardNodeChildrenComponent(item.children) : null}
            </ExpansionPanelDetails>   
          </ExpansionPanel>
        )}
      
    </div>
  );
}
