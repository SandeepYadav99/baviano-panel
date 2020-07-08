/**
 * Created by charnjeetelectrovese@gmail.com on 12/13/2018.
 */
import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './Login.module.css';
import {renderTextField} from '../../libs/redux-material.utils';
import {Button,withStyles, ButtonBase} from '@material-ui/core';
import {serviceLoginUser} from "../../services/index.services";
import { actionLoginUser } from '../../actions/auth_index.action';
import DashboardSnackbar from "../../components/Snackbar.component";
import { Link } from 'react-router-dom';

import EventEmitter from "../../libs/Events.utils";
import {updateTitle} from "../../libs/general.utils";

const validate = (values) => {
    const errors = {}
    const requiredFields = ['email', 'password'];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    return errors
}


const useStyles = {
    btnColor: {
        backgroundColor: 'white',
        marginTop: '20px',
        paddingLeft: '20px',
        color:'#2196F3',
        marginRight:'15px',
        paddingRight: '20px',
        '&:hover': {
            backgroundColor: 'white'
        }
    },
    btnBottom: {
        backgroundColor: 'white',
        paddingLeft: '20px',
        color:'#2196F3',
        marginRight:'10px',
        marginLeft:'15px',
        paddingRight: '20px',
        '&:hover': {
            backgroundColor: 'white'
        }
    },
    dialog: {
        padding: '10px 25px'
    },
    colorButton: {
        color: 'white',
        backgroundColor: '#0762BE',
        '&:hover': {
            color: 'white',
            backgroundColor: '#0762BE',
        }
    }

};

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: false
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleForgotPassword = this._handleForgotPassword.bind(this);
    }

    async componentDidMount() {
        updateTitle('Login');
    }

    _handleSubmit(data) {
        serviceLoginUser(data).then((val) => {
            if (!val.error) {
                this.props.actionLoginUser(val.data);
            } else {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Invalid Username/Password', type: 'error'});
            }
        });
    }

    _handleForgotPassword() {
        this.props.history.push('/forgot/password');
    }

    render() {
        const {handleSubmit,classes} = this.props;
        return (
            <div className={'login'}>
            <div className={styles.mainLoginView}>
                <div className={styles.loginFlex1}>
                    <div className={styles.heading}>
                        Milk Delivery Application Panel
                    </div>

                    {/*<div className={styles.innerFlex}>*/}
                        {/*<div>*/}
                            {/*<img src={require('../../assets/img/home/1.png')} className={styles.icons}/>*/}
                        {/*</div>*/}
                        {/*<div className={styles.textRight}>*/}
                            {/*<div className={styles.titleText}>Order Groceries & Food Items</div>*/}
                            {/*<div className={styles.subHeading}>Choose from a range of 1000+ products available at special prices.</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={styles.innerFlex} style={{marginTop:'30px'}}>*/}
                        {/*<div>*/}
                            {/*<img src={require('../../assets/img/home/2.png')} className={styles.icons}/>*/}
                        {/*</div>*/}
                        {/*<div className={styles.textRight}>*/}
                            {/*<div className={styles.titleText}>Hassle-free Doorstep Delivery</div>*/}
                            {/*<div className={styles.subHeading}>Get your orders delivered to your doorstep - safe,hygenic and quick.</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={styles.innerFlex} style={{marginTop:'30px'}}>*/}
                        {/*<div>*/}
                            {/*<img src={require('../../assets/img/home/3.png')} className={styles.icons}/>*/}
                        {/*</div>*/}
                        {/*<div className={styles.textRight}>*/}
                            {/*<div className={styles.titleText}>Realtime Order Tracking</div>*/}
                            {/*<div className={styles.subHeading}>Get real time updates on your orders & track your order.</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div style={{width:'80%'}}>*/}
                        {/*<div className={styles.subText}>*/}
                            {/*Identify new growth opportunities for your business with the lucrative alliance with Get a Tour and list down all your tours with the platform*/}
                            {/*<br/> <br/>*/}
                            {/*Be it land tours or water tours, segways or air tours, activities or some special experience with tickets, board now with the Get a Tour platform and facilitate all your bookings automatically with us.*/}
                            {/*We have an exclusive application for your drivers which will get all the updates of your bookings and transfers.*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={styles.bottomContainer}>*/}
                        {/*<span style={{fontWeight:'bold',fontSize:'18px'}}> Know more about this : </span>*/}
                        {/*<span>*/}
                    {/*<Button  className={classes.btnBottom} onClick={this._handleSignupClick}  type="submit">*/}
                                {/*How It Works*/}
                            {/*</Button>*/}
                    {/*</span>*/}

                        {/*<span>*/}
                    {/*<Button  className={classes.btnBottom} onClick={()=>{}}  type="submit">*/}
                                {/*Contact us*/}
                            {/*</Button>*/}
                    {/*</span>*/}
                    {/*</div>*/}
                </div>
                <div className={styles.loginFlex2}>
                    <div style={{textAlign:'center',marginBottom:'40px'}}>
                        <img src={require('../../assets/img/logo.png')}/>
                    </div>
                    <br/>
                    <h1 className={styles.headingText}>Login</h1>
                    {/*<div style={{color:'grey' ,marginTop:'5px'}}>Please enter Your Login Credentials</div>*/}
                    <br/>
                    <form onSubmit={handleSubmit(this._handleSubmit)}>
                        {/*<div className={styles.loginSignupText}>Login</div>*/}
                        <div>
                            <div>
                                <Field fullWidth={true} name="email" component={renderTextField} label="E-Mail"/>
                            </div>
                            <br/>
                            <div>
                                <Field type={'password'} fullWidth={true} name="password" component={renderTextField}
                                       label="Password"/>
                            </div>
                            <br/>
                            <div style={{ display: 'flex', float:'right' }}>
                                {/*<span className={styles.bottomSignup}>Don't have an account ? <Link to='/signup'>Sign Up here</Link></span>*/}
                                <span className={styles.bottomSignup}><ButtonBase onClick={this._handleForgotPassword} className={styles.forgotBtn}>Forgot Password?</ButtonBase></span>
                            </div>

                            <div style={{textAlign:'center',marginTop:'40px'}}>
                            <Button variant={'contained'}  type="submit" className={classes.colorButton}>
                                Login
                            </Button>
                            </div>
                        </div>
                    </form>
                </div>
                <DashboardSnackbar/>
            </div>
            </div>
        );
    }
}

LoginView = reduxForm({
    form: 'LoginPage',  // a unique identifier for this form
    validate,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter Credentials', type: 'error' });

    }
})(LoginView);

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionLoginUser: actionLoginUser
    }, dispatch);
}


export  default  connect(null, mapDispatchToProps)(withStyles(useStyles)(LoginView));
