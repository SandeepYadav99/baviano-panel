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
import {serviceGetCustomerSubscriptions} from "../../../../services/CustomersRequest.service";
import {CircularProgress} from "@material-ui/core";
import moment from "moment";

const useStyles = {
    table: {
        minWidth: 450,
    },
};

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

const rows = [
    createData('Region1', 262, 16.0, 24, 6.0),
    createData('Region2', 305, 3.7, 67, 4.3),
];

class UserSubscriptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isCalling: true,
        }
    }

    async componentDidMount() {
        const {userId} = this.props;
        const req = await serviceGetCustomerSubscriptions({user_id: userId});
        if (!req.error) {
            const data = req.data;
            this.setState({
                data: data,
                isCalling: false,
            });
        }
    }

    _renderDeliveryData(row) {
        if (row.type == 'CUSTOM') {
            let weekData = '';
            const weekArr = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            row.week_data.forEach((t, index) => {
                if (t) {
                    weekData += weekArr[index];
                    if (index + 1 != weekArr.length) {
                        weekData += ', ';
                    }
                }
            });
            return (<div>
                {row.start_date} - {row.next_date}
                <br/>
                <span style={{ textTransform: 'capitalize' }}>{weekData}</span>
            </div>);
        } else if (row.is_adhoc) {
            return (
                <div>
                    {row.start_date} - {row.next_date}
                    <br/>
                    <span style={{ textTransform: 'capitalize' }}>ADHOC</span>
                </div>
            )
        } else {
            return (
                <div>
                    {row.start_date} - {row.next_date}
                    <br/>
                    <span style={{ textTransform: 'capitalize' }}>{row.type}</span>
                </div>
            )
        }
    }
    render() {
        const {handleSubmit, classes} = this.props;
        const { data, isCalling } = this.state;
        if (!isCalling) {
            return (
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Start - Next Date</TableCell>
                                <TableCell align="right">Qty</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Batch</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map(row => (
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {row.product_name} { row.is_trial ? ' - (Trial)' : '' }
                                    </TableCell>
                                    <TableCell align="right">{this._renderDeliveryData(row)}</TableCell>
                                    <TableCell align="right">{row.quantity * row.unit_step} {row.unit}</TableCell>
                                    <TableCell align="right">Rs. {row.total_price} <br/> <span>{row.payment_mode}</span></TableCell>
                                    <TableCell align="right">{row.batch_name} <br/>
                                        {row.batch_slot}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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

export default withStyles(useStyles)(UserSubscriptions)
