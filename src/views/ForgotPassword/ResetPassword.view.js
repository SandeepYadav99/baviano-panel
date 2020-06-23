/**
 * Created by charnjeetelectrovese@gmail.com on 3/13/2020.
 */
import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames'
import styles from './Forgot.module.css';
import {renderTextField} from '../../libs/redux-material.utils';
import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import {Button, withStyles} from '@material-ui/core';
import {serviceResetPassword} from "../../services/index.services";
import DashboardSnackbar from "../../components/Snackbar.component";
import { Link } from 'react-router-dom';

import EventEmitter from "../../libs/Events.utils";
import {updateTitle} from "../../libs/general.utils";

const validate = (values) => {
    const errors = {}
    const requiredFields = ['password', 'confirm_password'];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (values.confirm_password && values.password != values.confirm_password) {
        errors.confirm_password = 'Password doesn\'t matches';
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
    }
};


class ResetPasswordView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: false,
            open: false,
            is_sent: false,
            token: null,
            is_calling: false,
            success: false
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleLoginClick = this._handleLoginClick.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleReturn = this._handleReturn.bind(this);

    }

    async componentDidMount() {
        updateTitle('Reset Password');
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        if (token) {
            this.setState({
                token: token,
            });
        } else {
            this.props.history.push('/login');
        }
    }

    _handleLoginClick() {
        this.props.history.push('/login');
    }

    _handleSubmit(data) {
        this.setState({
            is_calling: true,
        });
        if (!this.state.is_calling) {
            serviceResetPassword({
                ...data,
                token: this.state.token
            }).then((val) => {
                this.setState({
                    is_calling: false,
                })
                if (!val.error) {
                    this.setState({
                        success: true
                    })
                    EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                        error: 'Password Changed Successfully',
                        type: 'success'
                    });
                    setTimeout(() => {
                        this.props.history.push('/login');
                    }, 1500);
                } else {
                    EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Invalid Token', type: 'error'});
                }
            });
        }
    }

    _handleClose(){
        this.setState({
            open: !this.state.open
        })
    }

    _handleReturn() {
        this.props.history.push('/login');
    }


    _renderForm() {
        const {handleSubmit} = this.props;
            return (
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={styles.loginSignupText} style={{fontWeight:'700',fontSize:'24px'}}>Change Password</div>
                    <p className={styles.bottomLine}>Enter your new password to reset the password.</p>
                    <div>
                        <br/>
                        <div>
                            <Field type={'password'} fullWidth={true} name="password" component={renderTextField}
                                   label="Password*"/>
                        </div>
                        <br/>
                        <div>
                            <Field type={'password'} fullWidth={true} name="confirm_password" component={renderTextField}
                                   label="Confirm Password*"/>
                        </div>
                        <br/>
                        <Button disabled={this.state.is_calling || this.state.success} variant={'contained'} color={'primary'} type="submit">
                            {this.state.is_calling ? (<div style={{ padding: '5px 20px', display: 'flex' }}><CircularProgress size={'18px'} color={'primary'}/></div>) : (this.state.success ? 'Redirecting' : 'Change Password') }
                        </Button>
                    </div>
                </form>
            );
    }

    render() {
        const {handleSubmit, classes} = this.props;
        return (
            <div className={styles.mainLoginView}>
                <div className={styles.loginFlex1}>
                    <div style={{color:'white',fontSize:'40px',fontWeight:'500'}}>
                        Welcome To Get A Tour
                    </div>
                    <div style={{width:'80%'}}>
                        <div className={styles.subText}>
                            Identify new growth opportunities for your business with the lucrative alliance with Get a Tour and list down all your tours with the platform
                            <br/> <br/>
                            Be it land tours or water tours, segways or air tours, activities or some special experience with tickets, board now with the Get a Tour platform and facilitate all your bookings automatically with us.
                            We have an exclusive application for your drivers which will get all the updates of your bookings and transfers.
                        </div>
                    </div>

                    <div className={styles.bottomContainer}>
                        <span style={{fontWeight:'bold',fontSize:'18px'}}> Know more about this : </span>
                        <span>
                    <Button  className={classes.btnBottom} onClick={this._handleSignupClick}  type="submit">
                                How It Works
                            </Button>
                    </span>

                        <span>
                    <Button  className={classes.btnBottom} onClick={this._handleSignupClick}  type="submit">
                                Contact us
                            </Button>
                    </span>

                        {/*<div style={{marginTop:'25px',fontStyle:'italic'}}>*/}
                        {/*Finish your registration in 3-simple steps on our intutive host platform and go live*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className={styles.loginFlex2}>
                    <br/>
                    {this._renderForm()}
                </div>
                <DashboardSnackbar/>

            </div>
        );
    }
}

ResetPasswordView = reduxForm({
    form: 'LoginPage',  // a unique identifier for this form
    validate,
    onSubmitFail: errors => {
        if (errors) {
            const tempErrors = Object.keys(errors);
            if (tempErrors.length > 1) {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Required Parameters', type: 'error' });
            } else if (tempErrors.length == 1) {
                console.log(errors[tempErrors[0]])
                const temp = errors[tempErrors[0]];
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: temp, type: 'error' });
            } else {

            }
        } else {

        }
    }
})(ResetPasswordView);

function mapDispatchToProps(dispatch){
    return bindActionCreators({
    }, dispatch);
}


export  default  connect(null, mapDispatchToProps)(withStyles(useStyles)(ResetPasswordView));
