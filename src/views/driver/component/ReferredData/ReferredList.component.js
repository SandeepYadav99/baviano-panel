/**
 * Created by charnjeetelectrovese@gmail.com on 7/24/2020.
 */

import React, {Component} from 'react';
import classnames from 'classnames';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    serviceGetReferredList
} from "../../../../services/Driver.service";
import {CircularProgress} from "@material-ui/core";

const useStyles = {
    table: {
        minWidth: 450,
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 300,
    },
};

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

const rows = [
    createData('Region1', 262, 16.0, 24, 6.0),
    createData('Region2', 305, 3.7, 67, 4.3),
];

class WalletTransactions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isCalling: true,
        }
    }

    async componentDidMount() {
        const {userId} = this.props;
        const req = await serviceGetReferredList({user_id: userId});
        if (!req.error) {
            const data = req.data;
            this.setState({
                data: data,
                isCalling: false,
            });
        }
    }

    render() {
        const {handleSubmit, classes} = this.props;
        const { data, isCalling } = this.state;
        if (!isCalling) {
            return (
                <div style={{ marginTop: '20px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <label style={{
                                margin: '0px',
                                marginBottom: '5px',
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '400'
                            }} htmlFor="">Referred List</label>
                        </div>
                    </div>
                <TableContainer className={classes.container} component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map(row => (
                                <TableRow>
                                    <TableCell align="right">{row.refer_name} <br/> {row.refer_contact}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right">{row.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
            )
        } else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress  />
                </div>
            )
        }
    }
}

export default withStyles(useStyles)(WalletTransactions)
