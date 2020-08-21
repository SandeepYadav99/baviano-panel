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
    serviceCustomerPackageTransaction,
} from "../../../../services/CustomersRequest.service";
import {Button, CircularProgress} from "@material-ui/core";
import PackageDialog from "../PackageDialog/AddDialog.componet";

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

class PackageTransaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isCalling: true,
        }
        this._handlePackagingDialog = this._handlePackagingDialog.bind(this);
        this._handleClosePackageDialog = this._handleClosePackageDialog.bind(this);
        this._handleDialogSubmit = this._handleDialogSubmit.bind(this);
    }

    async componentDidMount() {
        const {userId} = this.props;
        const req = await serviceCustomerPackageTransaction({user_id: userId});
        if (!req.error) {
            const data = req.data;
            this.setState({
                data: data,
                isCalling: false,
                userId: null,
                showPackageDialog: false,
            });
        }
    }
    _handleClosePackageDialog() {
        this.setState({
            showPackageDialog: false
        })
    }

    _handlePackagingDialog() {
        this.setState({
            showPackageDialog: true
        })
    }

    _renderDialogButton() {
        const { pending } = this.props;
        if (pending > 0) {
            return (<Button onClick={this._handlePackagingDialog}>Deduct Amount</Button>)
        }  return null;
    }
    _handleDialogSubmit() {
        this.setState({
            showPackageDialog: false
        })
        this.props.handlePackagingDeduct();
    }
    render() {
        const {handleSubmit, classes, pending, userId} = this.props;
        const {data, isCalling} = this.state;
        if (!isCalling) {
            return (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                    <label style={{
                        margin: '0px',
                        marginBottom: '5px',
                        display: 'block',
                        fontSize: '16px',
                        fontWeight: '400'
                    }} htmlFor="">Package Transaction List ({pending})</label>
                        </div>
                        <div>
                            {this._renderDialogButton()}
                        </div>
                    </div>
                    <TableContainer className={classes.container} component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Qty</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Driver Info</TableCell>
                                    <TableCell align="right">By</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.data.map(row => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {row.createdAt}
                                        </TableCell>
                                        <TableCell align="right">{row.qty}</TableCell>
                                        <TableCell align="right">
                                            {row.type}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.driver_name}
                                            <br/>
                                            {row.driver_contact}
                                        </TableCell>

                                        <TableCell align="right">{row.transaction_type}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <PackageDialog
                        userId={userId}
                        pending={pending}
                        open={this.state.showPackageDialog}
                        handleClose={this._handleClosePackageDialog}
                        handleSubmitDeduct={this._handleDialogSubmit}
                    />
                </div>
            )
        } else {
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress/>
                </div>
            )
        }
    }
}

export default withStyles(useStyles)(PackageTransaction)
