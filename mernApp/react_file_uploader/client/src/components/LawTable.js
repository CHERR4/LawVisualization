import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const LawTable = ({ dataframe }) => {
    console.log(dataframe)
    return(
        <TableContainer component={Paper}>
            <Table size="small" aria-label="law table">
                <TableHead>
                    <TableRow>
                        <TableCell> Id </TableCell>
                        <TableCell align="right"> Text </TableCell>
                        <TableCell align="right"> Children </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataframe.data.map((node) => (
                        <TableRow key = {node.id}>
                            <TableCell component="th" scope="row">
                                {node.id}
                            </TableCell>
                            <TableCell align="right">{node.text}</TableCell>
                            <TableCell align="right">{node.children}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default LawTable