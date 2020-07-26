import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, withStyles} from "@material-ui/core";
import Table from '../../components/Table/Table.component'
import styles from './styles.module.css'
import SubscriptionList from './component/subscriptions/Subscriptions.component';
import TransactionsList from './component/transactions/Transactions.component';

class CustomerInfo extends Component{
    constructor(props){
        super(props);

        this.state={}
        this._handleReject = this._handleReject.bind(this);
        this._handleApprove = this._handleApprove.bind(this);
    }

    _handleApprove() {
        const {data} = this.props;
        this.props.changeStatus([data.id], 'APPROVE');
    }

    _handleReject() {
        const {data} = this.props;
        this.props.changeStatus([data.id], 'REJECT');
    }

    _renderApprove() {
        const { data } = this.props;
        if (data.status != 'ACTIVE') {
            return (
                <Button variant={'contained'} className={this.props.classes.btnSuccess} onClick={this._handleApprove}
                        type="button">
                    Approve
                </Button>
            )
        }
    }

    _renderReject() {
        const { data } = this.props;
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

    _renderImages(){
        const {data} = this.props;
        return data.images.map((val)=>{
            return(
                <div style={{marginRight:'10px'}}>
                    <a href={val} target='_blank'> <img src={val} style={{height:'80px',width:'80px'}}/> </a>
                </div>
            )
        })
    }

    _renderRoute(){
        const {data} = this.props;
        return data.routes.map((val,index)=>{
            return(
                <div>
                    {index+1}-{val.name}
                    <div>Waiting Time: {val.waiting}Min</div>
                    <hr/>
                </div>
            )
        })
    }

    render(){
        const {data} = this.props;
        return(
            <div className={'toursinfo'} style={{padding: '10px'}}>
                <h3>Customer Details</h3>
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
                        <div style={{ textTransform: 'capitalize' }}>
                            {data.name}
                        </div>
                    </div>
                    <div className={'formGroup'}>
                        <label>Contact</label>
                        <div>
                            {data.country_code}-{data.contact}
                        </div>
                    </div>
                </div>

                <div className={'formFlex'}>


                    <div className={'formGroup'}>
                        <label>OTP</label>
                        <div>
                            {data.verification_code}
                        </div>
                    </div>
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
                        <label>Subscriptions</label>
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



                <br/>

                <div style={{textAlign: 'right'}}>
                    {/*{this._renderApprove()}*/}
                    {/*{this._renderReject()}*/}
                </div>

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
