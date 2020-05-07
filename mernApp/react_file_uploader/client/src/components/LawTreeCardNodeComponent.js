import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Card from '@material-ui/core/Card'
import LawTreeComponent from './LawTreeComponent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import LawTreeCardNodeChildrenComponent from './LawTreeCardNodeChildrenComponent';
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

export default function LawTreeCardNodeComponent(data) {
  const classes = useStyles();
  return (
      <div className={classes.root}>
          <ExpansionPanel>   
            <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
            {data.name}
            </ExpansionPanelSummary>      
            <ExpansionPanelDetails>
              {Array.isArray(data.children) ? LawTreeCardNodeChildrenComponent(data.children) : null}
            </ExpansionPanelDetails>   
          </ExpansionPanel>
    </div>
  );
}
