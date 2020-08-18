import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    Button, withStyles,
    ButtonBase, Paper,
    Card, CardHeader,
    Divider, Table,
    TableBody, TableCell,
    TableContainer, TableRow,
    Tabs, Tab,
} from "@material-ui/core";
import OrderTable from '../../components/Table/OrderTable.component'
import styles from './styles.module.css'
import {serviceGetOnlineDrivers} from "../../services/Driver.service";
import DriversDialog from './components/driverdialog/DriversDialog.component';
import Constants from '../../config/constants';
import GoogleMap from './components/googlemap/GoogleMapHtml.component';
import TimeStamps from './components/timestamps/TimeStampsTable.component';
import RejectDialog from './components/rejectdialog/RejectDialog.component';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_driver_dialog: false,
            drivers: [],
            tab_value: 0,
            is_reject_dialog: false
        };
        this.googleMap = null;
        this._handleReject = this._handleReject.bind(this);
        this._handleApprove = this._handleApprove.bind(this);
        this._handleDriverDialog = this._handleDriverDialog.bind(this);
        this._handleDriverClick = this._handleDriverClick.bind(this);
        this._handleTabChange = this._handleTabChange.bind(this);
        this._handleRejectDialogClose = this._handleRejectDialogClose.bind(this);
        this._handleRejectDialog = this._handleRejectDialog.bind(this);
    }

    _handleApprove() {
        const {data} = this.props;
        this.props.changeStatus({order_id: data.id, id: data.id, status: Constants.ORDER_STATUS.ACCEPTED}, 'ACCEPT');
    }

    _handleReject() {
        this.setState({
            is_reject_dialog: true,
        })
    }

    _handleRejectDialog(obj) {
        const {data} = this.props;
        this.props.changeStatus({
            order_id: data.id,
            id: data.id,
            status: Constants.ORDER_STATUS.REJECTED, ...obj
        }, 'REJECT');
    }

    _handleRejectDialogClose() {
        this.setState({
            is_reject_dialog: false,
        })
    }

    async _handleDriverDialog() {
        const state = !this.state.is_driver_dialog;
        this.setState({
            is_driver_dialog: state,
        });
        if (state) {
            const tempReq = await serviceGetOnlineDrivers({});
            if (!tempReq.error) {
                const data = tempReq.data;
                this.setState({
                    drivers: data,
                });
            }
        }
    }

    _handleDriverClick(driverId) {
        this.setState({
            is_driver_dialog: false,
        });
        const {data} = this.props;
        this.props.changeStatus({
            order_id: data.id,
            id: data.id,
            driver_id: driverId,
            status: Constants.ORDER_STATUS.ACCEPTED,
            retry_dispatching: false,
            is_retry: data.retry_dispatching
        }, 'ACCEPT');
    }

    _renderApprove() {
        const {data, classes, is_submit} = this.props;
        if (is_submit) {
            return null;
        }
        if (data.status == 'PENDING') {
            return (
                <div className={styles.approveCont}>
                    <Button variant={'contained'} className={this.props.classes.btnSuccess}
                            onClick={this._handleApprove}
                            type="button">
                        Approve
                    </Button>
                    <ButtonBase onClick={this._handleDriverDialog} classes={{root: classes.rightText}}>
                        <span className={styles.assignToDriver}>Assign Manually</span>
                    </ButtonBase>
                </div>
            )
        } else if (data.status == Constants.ORDER_STATUS.ACCEPTED && data.retry_dispatching) {
            return (<Button variant={'contained'} className={this.props.classes.btnSuccess}
                            onClick={this._handleDriverDialog}
                            type="button">
                Assign Driver Manually
            </Button>);
        }
    }

    _renderReject() {
        const {data, is_submit} = this.props;
        if (is_submit) {
            return null;
        }
        return (
            <Button variant={'contained'} className={this.props.classes.btnError}
                    onClick={this._handleReject}
                    type="button">
                Suspend Order
            </Button>
        )
    }

    _renderRejectReason = (reason) => {
        if (reason) {
            const {classes} = this.props;
            return (
                <TableRow>
                    <TableCell classes={{root: classes.tableCell}}>Reject Reason</TableCell>
                    <TableCell classes={{root: classes.tableCell}}>{reason}</TableCell>
                </TableRow>
            )
        }
        return null;
    }

    _renderDriver(driver) {
        if (driver) {
            const {classes} = this.props;
            return (
                <TableRow>
                    <TableCell classes={{root: classes.tableCell}}>Driver</TableCell>
                    <TableCell classes={{root: classes.tableCell}}>
                        <div className={styles.capitalize}>{driver.name}</div>
                        <div>{driver.contact}</div>
                    </TableCell>
                </TableRow>
            )
        }
        return null;
    }

    _renderStatus(val) {
        const status = val.replace('_', ' ');
        let color = 'orange';
        if (status == Constants.ORDER_STATUS.DELIVERED) {
            color = 'green';
        } else if (status == Constants.ORDER_STATUS.PAYMENT || status == Constants.ORDER_STATUS.REJECTED) {
            color = '#ff4610';
        } else if (status == 'PENDING' || val == 'INACTIVE') {
            color = 'orange'
        }
        return (<span style={{
            ...styles.spanFont,
            fontSize: '12px',
            color: 'white',
            background: `${color}`,
            padding: '3px 10px',
            borderRadius: '20px',
            textTransform: 'capitalize'
        }}>{Constants.ORDER_STATUS_TEXT[val]}</span>);
    }

    _renderInformation() {
        const {data, classes} = this.props;
        const {user} = data;
        const {tab_value} = this.state;
        if (tab_value == 0) {
            return (
                <div className={styles.infoContainer}>

                    <div className={styles.processButtons}>
                        {/*{this._renderApprove()}*/}
                        {this._renderReject()}
                    </div>
                    {/*<h3>Order Details</h3>*/}
                    {/*<hr/>*/}

                    <div className={styles.infoWindow}>
                        <div className={styles.detailsWindow}>
                            <Paper>
                                <Card className={classes.root}>
                                    <CardHeader
                                        classes={{root: classes.cardHeader}}
                                        title="Order Details"
                                    />
                                </Card>
                                <Divider/>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Customer</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>
                                                <div className={styles.capitalize}>{user.name}</div>
                                                <div>{user.contact}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Address</TableCell>
                                            <TableCell
                                                classes={{root: classes.tableCell}}>
                                                <a href={"https://www.google.com/maps/search/?api=1&query=" + data.loc.coordinates[1] + ',' + data.loc.coordinates[0]}
                                                   target={'_blank'}>
                                                    {data.address.address} - {data.address.area} <br/>
                                                    {data.address.landmark} {data.address.landmark ? '-' : ''}
                                                    <div className={styles.badge}>{data.address.city}</div>
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Order No</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>{data.order_no}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Status</TableCell>
                                            <TableCell
                                                classes={{root: classes.tableCell}}>{this._renderStatus(data.status)}</TableCell>
                                        </TableRow>
                                        {/*{this._renderRejectReason(data.reject_reason)}*/}
                                        {/*{this._renderDriver(data.driver)}*/}
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Payment Mode</TableCell>
                                            <TableCell
                                                classes={{root: classes.tableCell}}>{data.payment_mode}</TableCell>
                                        </TableRow>
                                        {/*<TableRow>*/}
                                        {/*    <TableCell classes={{root: classes.tableCell}}>Instructions</TableCell>*/}
                                        {/*    <TableCell classes={{root: classes.tableCell}}>*/}
                                        {/*            <span className={styles.capitalize}>*/}
                                        {/*                {data.instructions ? data.instructions : 'N/A'}*/}
                                        {/*            </span>*/}
                                        {/*    </TableCell>*/}
                                        {/*</TableRow>*/}
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Delivery
                                                Preference</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>
                                                    <span className={styles.capitalize}>
                                                        {data.delivery_preference}
                                                    </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Delivery Slot</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>
                                                {data.delivery_slot.unformatted}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>User Wallet
                                                Amount</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>
                                                Rs. {data.user.wallet_amount} /-
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                            </Paper>
                            <br/>
                        </div>
                        <div className={styles.timeStampTable}>
                            <TimeStamps data={data.timestamps}></TimeStamps>
                        </div>
                        <div className={styles.listWindow}>
                            <div className={'formFlex'}>
                                <div className={'formGroup'} style={{padding: '0px 10px'}}>
                                    <div>
                                        {/*{data.address}*/}
                                        <OrderTable data={data.products} amount={data.amount.total}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <RejectDialog
                        open={this.state.is_reject_dialog}
                        handleClose={this._handleRejectDialogClose}
                        handleSubmit={this._handleRejectDialog}
                    />
                </div>
            )
        }
        return null;
    }

    // _renderMap() {
    //     const {data} = this.props;
    //     const {tab_value} = this.state;
    //     if (tab_value == 1) {
    //         return (
    //             <GoogleMap
    //                 ref={(ref) => {
    //                     this.googleMap = ref;
    //                 }}
    //                 order_id={data.id}
    //             />
    //         )
    //     }
    //     return null;
    // }

    _handleTabChange(id, handleValue) {
        this.setState({
            tab_value: handleValue
        })
    }

    a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    render() {
        const {data, classes} = this.props;
        const {user} = data;
        const {tab_value} = this.state;
        return (
            <div className={styles.mainContainer}>
                <Tabs value={tab_value} onChange={this._handleTabChange} aria-label="simple tabs example">
                    <Tab label="Order Details" {...this.a11yProps(0)} />
                </Tabs>
                {this._renderInformation()}
                <div style={{height: '75px'}}></div>
            </div>
        )
    }
}

const useStyle = theme => ({
    btnSuccess: {
        backgroundColor: theme.palette.success.dark,
        color: 'white',
        marginRight: 5,
        marginLeft: 5,
        '&:hover': {
            backgroundColor: theme.palette.success.main,
        }
    },
    btnError: {
        backgroundColor: theme.palette.error.dark,
        color: 'white',
        marginLeft: 5,
        marginRight: 5,
        '&:hover': {
            backgroundColor: theme.palette.error.main,
        }
    },
    rightText: {
        textAlign: 'right',
        justifyContent: 'flex-end',
        marginRight: '7px',
        marginTop: '3px'
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    tableCell: {
        color: 'black',
        fontSize: '0.90rem'
    },
    cardHeader: {
        padding: '10px'
    }
});


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(useStyle, {withTheme: true})(Order)));
