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
    serviceGetDriverSupportList,
} from "../../../../services/Driver.service";
import {Button, CircularProgress} from "@material-ui/core";

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

class SupportMessages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isCalling: true,
        }
    }

    async componentDidMount() {
        const {driverId} = this.props;
        const req = await serviceGetDriverSupportList({driver_id: driverId});
        if (!req.error) {
            const data = req.data;
            this.setState({
                data: data,
                isCalling: false,
                userId: null,
            });
        }
    }



    render() {
        const {handleSubmit, classes , driverId} = this.props;
        const {data, isCalling} = this.state;
        if (!isCalling) {
            return (
                <div style={{ marginTop: '60px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <label style={{
                                margin: '0px',
                                marginBottom: '5px',
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '400'
                            }} htmlFor="">Support Messages</label>
                        </div>
                    </div>
                    <TableContainer className={classes.container} component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Concern</TableCell>
                                    <TableCell align="right">Message</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Link</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.data.map(row => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {row.concern}
                                        </TableCell>
                                        <TableCell align="right">{row.message}</TableCell>
                                        <TableCell align="right">
                                            {row.date}
                                        </TableCell>
                                        <TableCell align="right">
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${row.loc.coordinates[1]},${row.loc.coordinates[0]}`} target={'_blank'}>Map Link</a>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default withStyles(useStyles)(SupportMessages)
