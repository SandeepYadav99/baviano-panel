import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, ButtonBase, Tab, Tabs, withStyles} from "@material-ui/core";
import Table from '../../components/Table/Table.component'
import styles from './styles.module.css'
import SubscriptionList from './component/subscriptions/Subscriptions.component';
import TransactionsList from './component/transactions/Transactions.component';
import PackageTransactionsList from './component/transactions/PackageTransactions.component';
import CouponList from './component/coupons/CouponsList.component';
import Constants from "../../config/constants";
import RejectDialog from "./component/rejectdialog/RejectDialog.component";
import OrderCalendarComponent from "./component/OrderCalendar/OrderCalendar.component";
import ReferredComponent from './component/ReferredData/ReferredList.component';


class CustomerInfo extends Component{
    constructor(props){
        super(props);

        this.state={
            is_reject_dialog: false,
            tab_value: 0,
        };
        this._handleReject = this._handleReject.bind(this);
        this._handleApprove = this._handleApprove.bind(this);
        this._handleRejectDialogClose = this._handleRejectDialogClose.bind(this);
        this._handleRejectDialog = this._handleRejectDialog.bind(this);
        this._handlePackagingDeduct = this._handlePackagingDeduct.bind(this);
        this._handleTabChange = this._handleTabChange.bind(this);
    }

    _handleApprove() {
        const {data} = this.props;
        this.props.changeStatus({
            id: data.id,
            status: 'ACTIVE',
            type: 'ACTIVE'
        });
    }

    _handleRejectDialog(obj) {
        const {data} = this.props;
        this.props.changeStatus({
            id: data.id,
            status: 'SUSPENDED',
            type: 'SUSPENDED'
        });
    }

    _handleRejectDialogClose() {
        this.setState({
            is_reject_dialog: false,
        })
    }


    _handleReject() {
        this.setState({
            is_reject_dialog: true,
        })
    }

    _renderReject() {
        const {data, is_submit} = this.props;
        if (is_submit) {
            return null;
        }
        if (data.status == 'ACTIVE') {
            return (
                <Button variant={'contained'} className={this.props.classes.btnError}
                        onClick={this._handleReject}
                        type="button">
                    Suspend User
                </Button>
            )
        }
    }

    _renderApprove() {
        const {data, classes, is_submit} = this.props;
        if (data.status == 'SUSPENDED') {
            return (
                <div className={styles.approveCont}>
                    <Button variant={'contained'} className={this.props.classes.btnSuccess}
                            onClick={this._handleApprove}
                            type="button">
                        Activate
                    </Button>
                </div>
            )
        } return null;
    }

    _handlePackagingDeduct() {
        this.props.handleClose();
    }

    _handleTabChange(id, handleValue) {
        this.setState({
            tab_value: handleValue
        })
    }
    _renderInformation(){
        const {tab_value} = this.state;
        if (tab_value == 0) {
            const {data} = this.props;
            return (
                <div className={'toursinfo'} style={{padding: '10px'}}>
                    <div className={styles.topHeader}>
                        <div className={styles.headingCont}>
                            <h3>Customer Details</h3>
                        </div>
                        <div className={styles.processButtons}>
                            {this._renderApprove()}
                            {this._renderReject()}
                        </div>
                    </div>

                    <hr/>


                    <div className={'formFlex'}>
                        {/*<div className={'formGroup'}>*/}
                        {/*<label>User Image</label>*/}
                        {/*<div>*/}
                        {/*<img className={styles.userImage} src={data.user_image}/>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <div className={'formGroup'}>
                            <label>Name</label>
                            <div style={{textTransform: 'capitalize'}}>
                                {data.name}
                            </div>
                        </div>
                        <div className={'formGroup'}>
                            <label>Contact</label>
                            <div>
                                {data.country_code}-{data.contact}
                            </div>
                        </div>
                        <div className="formGroup">
                            {data.refer_code && (<div>
                                <label>Refer Code</label>
                                <div>
                                    {data.refer_code}
                                </div>
                            </div>)}
                        </div>
                    </div>

                    <div className={'formFlex'}>


                        <div className={'formGroup'}>
                            <label>OTP</label>
                            <div>
                                {data.verification_code}
                            </div>
                        </div>
                        {data.location_image && (<div className={'formGroup'}>
                            <div><label htmlFor="">Location Image</label></div>
                            <a href={data.location_image} target={'_blank'}>

                            <img src={data.location_image} style={{ width: '70px' }} alt=""/>
                            </a>
                        </div>)}
                    </div>


                    {/*<div className={'formFlex'}>*/}
                    {/*<div className={'formGroup'}>*/}
                    {/*<label></label>*/}
                    {/*<div>*/}
                    {/**/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}


                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <label>Address</label>
                            <div>
                                {/*{data.address}*/}
                                <Table data={data.address}/>
                            </div>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <div>
                                <SubscriptionList userId={data.id}/>
                            </div>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <label>Transactions</label>
                            <div>
                                <TransactionsList userId={data.id}/>
                            </div>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <PackageTransactionsList handlePackagingDeduct={this._handlePackagingDeduct}
                                                     pending={data.packages_pending} userId={data.id}/>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <label>Referred List</label>
                            <ReferredComponent userId={data.id}/>
                        </div>
                    </div>



                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <label>Coupons Used</label>
                            <div>
                                <CouponList userId={data.id}/>
                            </div>
                        </div>
                    </div>


                    <br/>

                    <div style={{textAlign: 'right'}}>
                        {/*{this._renderApprove()}*/}
                        {/*{this._renderReject()}*/}
                    </div>
                    <RejectDialog
                        open={this.state.is_reject_dialog}
                        handleClose={this._handleRejectDialogClose}
                        handleSubmit={this._handleRejectDialog}
                    />
                </div>
            )
        } return null;
    }
    _renderCalendar() {
        const {tab_value} = this.state;
        const { data } = this.props;
        if (tab_value == 1) {
            return (
                <OrderCalendarComponent userId={data.id} />
            )
        } return null;
    }
    a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    render () {
        const {tab_value} = this.state;
        return (
            <div className={styles.mainContainer}>
            <Tabs value={tab_value} onChange={this._handleTabChange} aria-label="simple tabs example">
                <Tab label="Customer Detail" {...this.a11yProps(0)} />
                <Tab label="Customer Calendar" {...this.a11yProps(1)} />
            </Tabs>
                {this._renderInformation()}
                {this._renderCalendar()}
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
    }
});


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(useStyle, {withTheme: true})(CustomerInfo)));
