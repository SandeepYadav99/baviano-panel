import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    Button,
    Card,
    CardHeader,
    Divider,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tabs,
    withStyles,
} from "@material-ui/core";
import styles from './styles.module.css'
import Constants from '../../config/constants';
import GoogleMap from './components/googlemap/GoogleMapHtml.component';
import BatchJobList from './components/DeliveryList/DeliveryList.component';
import {serviceGetBatchJobDetail} from "../../services/BatchJob.service";
import {WaitingComponent} from "../../components/index.component";
import DriverReassign from "./components/DriverReassign/DriverReassign";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import {serviceCancelBatchJob, serviceReassignBatchJob} from "../../services/BatchProcessing.service";
import {actionUpdateBatchJob} from "../../actions/BatchJob.action";
import EventEmitter from "../../libs/Events.utils";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_driver_dialog: false,
            drivers: [],
            tab_value: 0,
            is_reject_dialog: false,
            batchJobs: [],
            isCalling: true,
            showDialog: false,
            isUpdating: false,
        };
        this.googleMap = null;
        this._handleReject = this._handleReject.bind(this);
        this._handleApprove = this._handleApprove.bind(this);
        this._handleTabChange = this._handleTabChange.bind(this);
        this._handleRejectDialogClose = this._handleRejectDialogClose.bind(this);
        this._handleRejectDialog = this._handleRejectDialog.bind(this);
        this._btnCancel = this._btnCancel.bind(this);
        this._jobReassignCallback = this._jobReassignCallback.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
        this._handleClose = this._handleClose.bind(this);
    }

    async componentDidMount() {
        const {data} = this.props;
        const req = await serviceGetBatchJobDetail({job_id: data.id});
        if (!req.error) {
            const data = req.data;
            this.setState({
                batchJobs: data,
                isCalling: false,
            });
        }
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
                </div>
            )
        }
    }

    _renderReject() {
        const {data, is_submit} = this.props;
        if (is_submit) {
            return null;
        }
        if (data.status == 'ACTIVE' || data.status == 'PENDING') {
            return (
                <Button variant={'contained'} className={this.props.classes.btnError}
                        onClick={this._handleReject}
                        type="button">
                    Reject
                </Button>
            )
        }
    }

    _btnCancel() {
        this.setState({
            showDialog: true,
        });
    }

    async _jobReassignCallback(driverId) {
        const { data } = this.props;
        const { isUpdating } = this.state;
        if (!isUpdating) {
            this.setState({
                isUpdating: true
            });
            const req = await serviceReassignBatchJob({job_id: data.id, driver_id: driverId});
            if (!req.error) {
                this.props.handleClose();
                this.props.actionUpdate(req.data);
            } else {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: req.message, type: 'error'});
            }
            this.setState({
                isUpdating: false
            });
        }
    }

    async _handleCancel() {
        this.setState({
            showDialog: false,
        });
        const { data } = this.props;
        const { isUpdating } = this.state;
        if (!isUpdating) {
            this.setState({
                isUpdating: true
            });
            const req = await serviceCancelBatchJob({job_id: data.id});
            if (!req.error) {
                this.props.handleClose();
                this.props.actionUpdate(req.data);
            } else {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: req.message, type: 'error'});
            }
            this.setState({
                isUpdating: false
            });
        }
    }

    _handleClose() {
        this.setState({
            showDialog: false,
        });

    }

    _renderStatus(val) {
        const status = val.status;
        const oStatus = Constants.DRIVER_JOB_STATUS;
        const colors = {
            [oStatus.REJECTED]: '#d50000',
            [oStatus.PENDING]: '#f9a825',
            [oStatus.IN_PROCESS]: '#ff9100',
            [oStatus.COMPLETED]: '#1b5e20',
        }
        const color = colors[status];
        return (<span
            style={{
                ...styles.spanFont,
                fontSize: '12px',
                color: 'white',
                background: `${color}`,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'capitalize'
            }}>{Constants.DRIVER_JOB_STATUS[val.status]}</span>);
    }

    _renderInformation() {
        const {data, classes} = this.props;
        const {user} = data;
        const {tab_value, batchJobs, isCalling} = this.state;
        if (tab_value == 0) {
            return (
                <div className={styles.infoContainer}>
                    {data.status === 'PENDING' && (<div className={styles.cancelBtnCont}>
                        <Button variant={'contained'} className={this.props.classes.btnError}
                                onClick={this._btnCancel}
                                type="button">
                            Cancel Job
                        </Button>
                    </div>)}
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
                                            <TableCell classes={{root: classes.tableCell}}>Batch Info</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>
                                                <div>
                                                    {data.batch_name}
                                                    <br/>
                                                    {data.unformatted_date}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Driver</TableCell>
                                            <TableCell
                                                classes={{root: classes.tableCell}}>
                                                {data.driver_name}
                                                <br/>
                                                {data.driver_contact}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Status</TableCell>
                                            <TableCell
                                                classes={{root: classes.tableCell}}>{this._renderStatus(data)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell classes={{root: classes.tableCell}}>Delivery Slot</TableCell>
                                            <TableCell classes={{root: classes.tableCell}}>
                                                    <span className={styles.capitalize}>
                                                        {data.delivery_slot.unformatted}
                                                    </span>
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>

                            </Paper>
                            <br/>
                        </div>
                        {/*<div className={styles.timeStampTable}>*/}
                        {/*    /!*<TimeStamps data={data.timestamps}></TimeStamps>*!/*/}
                        {/*</div>*/}
                        <div className={styles.listWindow}>
                            <div className={'formFlex'}>
                                <div className={'formGroup'} style={{padding: '0px 10px'}}>
                                    <div>
                                        <BatchJobList isCalling={isCalling} data={batchJobs} jobId={data.id}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    {[Constants.DRIVER_JOB_STATUS.IN_PROCESS, Constants.DRIVER_JOB_STATUS.PENDING].indexOf(data.status) >= 0 && (<div className={styles.approveCont}>
                        <div>
                        <h5 style={{margin: '0px'}}>Reassign Job</h5>
                        <DriverReassign
                            driver_id={data.driver_id}
                            batch_id={data.batch_id}
                            handleAssign={this._jobReassignCallback}
                        />
                        </div>
                    </div>)}
                </div>
            )
        }
        return null;
    }

    _renderMap() {
        const {data} = this.props;
        const {tab_value, batchJobs, isCalling} = this.state;

        if (tab_value == 1) {
            if (isCalling) {
                return (
                    <WaitingComponent/>
                );
            }
            return (
                <GoogleMap
                    ref={(ref) => {
                        this.googleMap = ref;
                    }}
                    orders={batchJobs}
                    data={data}
                    job_id={data.id}
                />
            )
        }
        return null;
    }

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
        const {tab_value, showDialog} = this.state;
        return (
            <div className={styles.mainContainer}>
                <Tabs value={tab_value} onChange={this._handleTabChange} aria-label="simple tabs example">
                    <Tab label="Order Details" {...this.a11yProps(0)} />
                    {data.status == 'IN_PROCESS' && (<Tab label="Map" {...this.a11yProps(1)} />)}
                </Tabs>
                {this._renderInformation()}
                {this._renderMap()}
                <Dialog
                    open={showDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this._handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Are You Sure?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you really want to perform the action?
                            <br/>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this._handleCancel} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
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
    return bindActionCreators({
        actionUpdate: actionUpdateBatchJob,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(useStyle, {withTheme: true})(Order)));
