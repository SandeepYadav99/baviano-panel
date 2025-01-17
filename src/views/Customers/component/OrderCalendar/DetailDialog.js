import React from 'react';
import {Dialog, Slide} from "@material-ui/core";
import styles from "./Style.module.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const DetailDialog = ({isOpen, handleClose, data, type}) => {
    return (
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            maxWidth={'md'}
        >
            <div className={styles.dialogCont}>
                <div className={styles.mainContainer}>
                    <div className={styles.headingTuxi}>
                        <div className={styles.loginHeading}>Delivery Details</div>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Qty (Unit)</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((val) => {
                                        return (<TableRow>
                                            <TableCell>{val.name} - {val.delivery_type} {type==='Delivery' ? (val.is_skipped ? '(SKIPPED)' : '') : ''}</TableCell>
                                            <TableCell>{val.qty} ({val.unit})</TableCell>
                                            <TableCell>{val.status}</TableCell>
                                        </TableRow>)
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </Dialog>
    )
};

export default DetailDialog;
