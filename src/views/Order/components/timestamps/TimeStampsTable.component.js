/**
 * Created by charnjeetelectrovese@gmail.com on 4/27/2020.
 */
import React, {Component} from 'react';
import {
    withStyles, Paper,
    Card, CardHeader,
    Divider, Table,
    TableBody, TableCell,
    TableContainer, TableRow
} from '@material-ui/core';
import styles from './Style.module.css';
import Constants from '../../../../config/constants';
import DateUtils from '../../../../libs/DateUtils.lib';

class TimeStampsTable extends Component {
    constructor(props) {
        super(props);

    }

    _renderRows() {
        const {data, classes} = this.props;
        return Object.keys(data).map((key, index) => {
            const val = data[key];
            return (
                <TableRow key={'timestamp'+index}>
                    <TableCell classes={{ root: classes.tableCell}}>{Constants.ORDER_STATUS_TEXT[key.toUpperCase()]}</TableCell>
                    <TableCell classes={{ root: classes.tableCell}}>{DateUtils.changeTimezoneFromUtc(val)}</TableCell>
                </TableRow>
            )
        });
    }

    render() {
        const {classes, data} = this.props;
        return (
            <Paper>
                <Card className={classes.root}>
                    <CardHeader
                        classes={{ root: classes.cardHeader }}
                        title="Time Stamps"
                    />
                </Card>
                <Divider/>
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        {this._renderRows(data)}

                    </TableBody>
                </Table>
            </Paper>
        );
    }

}

const useStyle = theme => ({
    tableCell: {
        color: 'black',
        fontSize: '0.90rem',
        textTransform: 'capitalize',
    },
    cardHeader: {
        padding: '10px'
    }
});


export default (withStyles(useStyle, {withTheme: true})(TimeStampsTable));
