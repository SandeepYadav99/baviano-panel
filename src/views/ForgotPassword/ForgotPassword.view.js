/**
 * Created by charnjeetelectrovese@gmail.com on 12/13/2018.
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
import {Button, withStyles,ButtonBase} from '@material-ui/core';
import {ArrowBack} from '@material-ui/icons'
import {serviceForgotPassword } from "../../services/index.services";
import DashboardSnackbar from "../../components/Snackbar.component";
import { Link } from 'react-router-dom';

import EventEmitter from "../../libs/Events.utils";
import {updateTitle} from "../../libs/general.utils";

const validate = (values) => {
    const errors = {}
    const requiredFields = ['email'];

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
    }
};


class ForgotPasswordView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: false,
            open: false,
            is_sent: false,
            is_calling: false
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleLoginClick = this._handleLoginClick.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleReturn = this._handleReturn.bind(this);
        this._handleBack = this._handleBack.bind(this)
    }

    async componentDidMount() {
        updateTitle('Forgot Password');
    }


    _handleLoginClick() {
        this.props.history.push('/login');
    }

    _handleBack() {
        this.props.history.goBack();
    }

    _handleSubmit(data) {
        if (!this.state.is_calling) {
            this.setState({
                is_calling: true,
            });
            serviceForgotPassword(data).then((val) => {
                if (!val.error) {
                    EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                        error: 'Password Reset Email Sent',
                        type: 'success'
                    });
                    this.setState({
                        is_sent: true,
                        is_calling: false,
                    });
                } else {
                    this.setState({
                        is_calling: false,
                    })
                    EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Invalid Email Address', type: 'error'});
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
        const { is_sent } = this.state;
        if (is_sent) {
            return (
                <div>
                    <div className={styles.loginSignupText} style={{fontWeight:'700',fontSize:'24px'}}>Reset Email Sent.</div>
                    <p className={styles.bottomLine} style={{ lineHeight: '18px' }}>Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</p>
                    <div>
                        <br/>
                        <Button variant={'contained'} color={'primary'} onClick={this._handleReturn}>
                            Return to sign in
                        </Button>
                    </div>
                </div>
            )
        } else {
            return (
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={styles.loginSignupText} style={{fontWeight:'600',fontSize:'24px',display:'flex',alignItems:'center'}}>
                        {/*<ArrowBack onClick={this._handleBack}>*/}
                        {/*</ArrowBack>*/}
                        <div>
                        Forgot Password
                        </div>
                    </div>
                    <p className={styles.bottomLine} style={{color:'grey'}}>Enter your user account's verified email address and we will send you a password reset link.</p>
                    <div>
                        <br/>
                        <div>
                            <Field fullWidth={true} name="email" component={renderTextField} label="E-Mail*"/>
                        </div>
                            {/*<span style={{float:'right',marginTop:'5px'}}><Link to='/login'>Back To Login</Link></span>*/}
                        <br/>
                        <br/>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <Button  disabled={this.state.is_calling} variant={'contained'} type="submit" className={styles.resetButton}>
                            {this.state.is_calling ? (<div style={{ padding: '5px 20px', display: 'flex' }}><CircularProgress size={'18px'} color={'primary'}/></div>) : 'Send Password Reset Email' }
                        </Button>
                            <div>
                                <span className={styles.bottomSignup}><ButtonBase onClick={this._handleBack} className={styles.back}>Back To Login</ButtonBase></span>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
    }

    render() {
        const {handleSubmit,classes} = this.props;
        return (
            <div className={'forgot'}>
            <div className={styles.mainLoginView}>
                <div className={styles.loginFlex1}>

                        {/*<div style={{marginTop:'25px',fontStyle:'italic'}}>*/}
                        {/*Finish your registration in 3-simple steps on our intutive host platform and go live*/}
                        {/*</div>*/}
                    <div className={styles.heading}>
                        Milk Delivery Application Panel
                    </div>

                </div>
                <div className={styles.loginFlex2}>
                    <br/>
                    {this._renderForm()}
                </div>
                <DashboardSnackbar/>

            </div>
            </div>
        );
    }
}

ForgotPasswordView = reduxForm({
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
                // EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: temp, type: 'error' });
            } else {

            }
        } else {

        }
    }
})(ForgotPasswordView);

function mapDispatchToProps(dispatch){
    return bindActionCreators({
    }, dispatch);
}


export  default  connect(null, mapDispatchToProps)(withStyles(useStyles)(ForgotPasswordView));
