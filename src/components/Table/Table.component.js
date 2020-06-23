import React, {Component} from 'react';
import classnames from 'classnames';
import styles from './style.module.css';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = {
    table: {
        minWidth: 450,
    },
};

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    // createData('Region 1',),
    // createData('Region 2',),
    createData('Region1', 262, 16.0, 24, 6.0),
    createData('Region2', 305, 3.7, 67, 4.3),
    // createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class TableTask extends Component {
    render(){
        const {handleSubmit,classes, data} = this.props;
        return (
            <TableContainer component={Paper}><br/>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell align="right">Area</TableCell>
                            <TableCell align="right">Landmark</TableCell>
                            <TableCell align="right">City</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*{this.props.tempData.map(row => (*/}
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {data.address}
                                </TableCell>
                                <TableCell align="right">{data.area}</TableCell>
                                <TableCell align="right">{data.landmark}</TableCell>
                                <TableCell align="right">{data.city}</TableCell>
                                {/*<TableCell align="right">{row.protein}</TableCell>*/}
                            </TableRow>
                        {/*))}*/}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default withStyles(useStyles)(TableTask)
