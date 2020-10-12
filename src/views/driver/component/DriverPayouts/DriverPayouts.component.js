/**
 * Created by charnjeetelectrovese@gmail.com on 7/24/2020.
 */

import React, {Component} from 'react';
import classnames from 'classnames';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    serviceGetDriverBatchesList, serviceGetDriverMonthlyDeliveries,
} from "../../../../services/Driver.service";
import {Button, CircularProgress, MenuItem} from "@material-ui/core";
import {Field, reduxForm} from "redux-form";
import EventEmitter from "../../../../libs/Events.utils";
import {renderOutlinedSelectField, renderOutlinedTextField} from "../../../../libs/redux-material.utils";


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

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        } else if (values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
            errors[field] = 'Required'
        }
    });
    return errors
};


class DriverPayouts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {deliveries: []},
            isCalling: true,
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: [],
        };
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    async componentDidMount() {
        requiredFields = ['month', 'year'];
        const year = parseInt(moment(new Date()).format('YYYY'));
        const month = parseInt(moment(new Date()).format('MM'));
        const years = [];
        for (let i = year - 1; i <= (year); i++) {
            years.push(i);
        }
        this.setState({
            years: years,
        }, () => {
            this.props.change('month', month);
            this.props.change('year', year);
        })
        this._getData(month, year);
    }

    async _getData(month, year) {
        const {driverId} = this.props;
        const req = await serviceGetDriverMonthlyDeliveries({driver_id: driverId, month, year});
        if (!req.error) {
            const data = req.data;
            this.setState({
                data: data,
                isCalling: false,
                userId: null,
            });
        }
    }

    _handleSubmit(tData) {
        this._getData(tData.month, tData.year);
    }

    _renderMonths() {
        const {months} = this.state;
        return months.map((val) => {
            return (<MenuItem value={val}>{val}</MenuItem>);
        })
    }

    _renderYears() {
        const {years} = this.state;
        return years.map((val) => {
            return (<MenuItem value={val}>{val}</MenuItem>);
        })
    }

    _renderTable() {
        const { classes }  = this.props;
        const {data, isCalling} = this.state;
        if (!isCalling) {
            return (
                <TableContainer className={classes.container} component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Deliveries</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                {/*<TableCell align="right">Duration</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.deliveries.map(row => (
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {row.unformatted_date}
                                    </TableCell>
                                    <TableCell align="right">{row.deliveries}</TableCell>
                                    <TableCell align="right">
                                        Rs. {row.amount}
                                    </TableCell>
                                    {/*<TableCell align="right">*/}
                                    {/*    {row.duration} Hr.*/}
                                    {/*</TableCell>*/}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        } else {
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress/>
                </div>
            )
        }
    }

    render() {
        const {handleSubmit, classes, driverId} = this.props;
        return (
            <div style={{marginTop: '20px', padding: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <label style={{
                            margin: '0px',
                            marginBottom: '5px',
                            display: 'block',
                            fontSize: '16px',
                            fontWeight: '400'
                        }} htmlFor="">Driver Monthly Delivery List</label>
                    </div>
                </div>

                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="month" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Month">
                                {this._renderMonths()}
                            </Field>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="year" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Year">
                                {this._renderYears()}
                            </Field>
                        </div>
                    </div>
                    <div style={{justifyContent: 'flex-end', display: 'flex'}}>
                        <Button variant={'contained'} color={'primary'} type={'submit'}>
                            Submit
                        </Button>
                    </div>
                </form>

                <br/>
                {this._renderTable()}
            </div>
        )
    }
}


const ReduxForm = reduxForm({
    form: 'category',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyles, {withTheme: true})(DriverPayouts));

export default ReduxForm;
