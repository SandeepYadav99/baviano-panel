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
import {Button, CircularProgress} from "@material-ui/core";
import {serviceGetBatchJobDetail} from "../../../../services/BatchJob.service";
import styles from "../../../BatchProcessing/styles.module.css";

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

        }
    }

    async componentDidMount() {
        const {jobId} = this.props;

    }

    _renderProducts(products) {
        return products.map((val) => {
            return (<div className={styles.productInfo1}>
                <span className={styles.productName1}>{val.name}</span>
                <span
                    className={styles.productQty1}> {parseFloat(val.qty * val.unit_step).toFixed(2)} {val.unit} = Rs.{parseFloat(val.qty * val.price).toFixed(2)} </span>
            </div>)
        })
    }


    render() {
        const {handleSubmit, classes , jobId, data, isCalling} = this.props;
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
                    }} htmlFor="">Batches Delivery List</label>
                        </div>
                    </div>
                    <TableContainer className={classes.container} component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order No</TableCell>
                                    <TableCell align="right">User</TableCell>
                                    <TableCell align="right">Products</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Image</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map(row => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {row.order_no}
                                        </TableCell>
                                        <TableCell align="right">{row.user.name} <br/>{row.user.contact}</TableCell>

                                        <TableCell style={{ width: '30%' }} align="right">
                                            {this._renderProducts(row.products)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.status}
                                        </TableCell>
                                        <TableCell align="right">
                                            <a href={row.delivery_image} target={'_blank'}>
                                                <img src={row.delivery_image} style={{ width: '50px' }}  alt=""/>
                                            </a>
                                        </TableCell>


                                        {/*<TableCell align="right">*/}
                                        {/*    {row.duration} Hr.*/}
                                        {/*</TableCell>*/}

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

export default withStyles(useStyles)(PackageTransaction)
