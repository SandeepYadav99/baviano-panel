import React, {Component} from 'react';
import moment from 'moment';
import styles from './style.module.css';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Constants from '../../config/constants';
const useStyles = {
    table: {
        minWidth: 450,
    },
};


class TableTask extends Component {
    ccyFormat(num) {
        return `${Constants.CURRENCY} ${num.toFixed(2)}`;
    }

    _renderDelivery(row) {
        let deliverDate = moment(row.start_date);
        deliverDate = deliverDate.format('DD-MM-YYYY');
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
                {deliverDate}
                <br/>
                <span style={{ textTransform: 'capitalize' }}>{weekData}</span>
            </div>);
        } else if (row.is_adhoc) {
            return (
                <div>
                    {deliverDate}
                    <br/>
                    <span style={{ textTransform: 'capitalize' }}>ADHOC</span>
                </div>
            )
        } else {
            return (
                <div>
                    {deliverDate}
                    <br/>
                    <span style={{ textTransform: 'capitalize' }}>{row.type}</span>
                </div>
            )
        }
    }

    render(){
        const {handleSubmit,classes, amount} = this.props;
        return (
            <TableContainer component={Paper} >
                <Table className={classes.table} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={3}>
                                Details
                            </TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Delivery Data</TableCell>
                            <TableCell align="right">Quantity - Price</TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((row) => {
                            const qty = row.quantity ? row.quantity : (row.qty ? row.qty : 0);
                            return (<TableRow key={row.desc}>
                                <TableCell>{row.name} { row.is_trial ? ('(TRIAL PRODUCT)') : '' } {row.status === 'SKIPPED' ? 'SKIPPED' : ''}

                                </TableCell>
                                <TableCell align="right">{this._renderDelivery(row)}</TableCell>
                                <TableCell align="right">{qty} X {parseFloat(row.price) } /-
                                    <br/>
                                    <span>{row.unit_step * qty} {row.unit}</span>
                                </TableCell>
                                <TableCell align="right">{this.ccyFormat(parseFloat(qty) * parseFloat(row.price))}

                                </TableCell>
                            </TableRow>)
                        }
                        )}

                        <TableRow>
                            <TableCell rowSpan={5} />
                            <TableCell >Subtotal</TableCell>
                            <TableCell align="right">{this.ccyFormat(amount)}</TableCell>
                        </TableRow>
                        {/*<TableRow>*/}
                        {/*    <TableCell >Total</TableCell>*/}
                        {/*    <TableCell align="right">{this.ccyFormat(amount)}</TableCell>*/}
                        {/*</TableRow>*/}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default withStyles(useStyles)(TableTask)
