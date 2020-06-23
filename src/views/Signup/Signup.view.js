/**
 * Created by charnjeetelectrovese@gmail.com on 12/19/2019.
 */

import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import {Link} from 'react-router-dom';
import styles from './index.module.css';
import {
    renderCountryContact,
    renderOutlinedMultipleSelectField,
    renderOutlinedSelectField,
    renderOutlinedTextField,
    renderTextField
} from '../../libs/redux-material.utils';
import {Button, MenuItem, withStyles} from '@material-ui/core';
import {
    serviceCreateRequest,
    serviceGetCityData,
    serviceProviderEmailExists
} from "../../services/ProviderRequest.service";
import EventEmitter from "../../libs/Events.utils";
import DashboardSnackbar from "../../components/Snackbar.component";
import GooglePlace from './GooglePlace.view';

let lastEmail = '';
let isEmailExists = false;

const validate = (values) => {
    const errors = {}
    const requiredFields = [ 'contact_person', 'contact', 'address', 'company_name', 'city_id', 'country_id', 'email'];


    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });


    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    return errors
};


const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            if (lastEmail == values.email && isEmailExists) {
                reject({email: 'Email Already Registered'});
            } else {
                serviceProviderEmailExists({email: values.email}).then((data) => {
                    console.log(data);
                    lastEmail = values.email;
                    if (!data.error) {
                        if (data.data.email_exists) {
                            EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                                error: 'Email Already Taken',
                                type: 'error'
                            });
                            reject({email: 'Email Already Registered'});
                        }
                    }
                    resolve({});
                })
            }
        } else {
            resolve({});
        }
    });
};

const useStyles = {
    btnColor: {
        backgroundColor: 'white',
        marginTop: '20px',
        paddingLeft: '20px',
        color: '#2196F3',
        marginRight: '15px',
        paddingRight: '20px',
        '&:hover': {
            backgroundColor: 'white'
        }
    },
    btnBottom: {
        backgroundColor: 'white',
        paddingLeft: '20px',
        color: '#2196F3',
        marginRight: '10px',
        marginLeft: '15px',
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
        backgroundColor: '#2196F3',
        '&:hover': {
            color: 'white',
            backgroundColor: '#2196F3',
        }
    }

};

class SignupView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: false,
            countries: [],
            cities: [],
            country_id: null,
            city: '',
            country: '',
            loc_data: {lat: null, lng: null, name: ''},
            is_submitted: false,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleCountryChange = this._handleCountryChange.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleGooglePlace = this._handleGooglePlace.bind(this);
        this._handleCityCountry = this._handleCityCountry.bind(this);
    }

    async componentDidMount() {
        const req = await serviceGetCityData();
        if (!req.error) {
            const data = req.data;
            const tempData = {};
            this.setState({
                countries: data.country,
                cities: data.city,
            })
        }
    }

    _handleCountryChange(e, val) {
        this.setState({
            country_id: val,
        });
    }

    _handleSubmit(data) {
        const {city, country} = this.state;
        if (city && country) {
            serviceCreateRequest({...data, city, country});
            EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Request Submitted Successfully', type: 'success'});
            this.props.reset();
            this.setState({
                is_submitted: true,
            })
        } else {
            EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter City Name', type: 'error'});
        }
    }

    _renderCountries() {
        return this.state.countries.map((val) => {
            return (<MenuItem value={val._id}>{val.name}</MenuItem>);
        })
    }

    _renderCities() {
        const temp = [];
        this.state.cities.forEach((val) => {
            if (val.country_id == this.state.country_id) {
                temp.push(<MenuItem value={val._id}>{val.name}</MenuItem>);
            }
        });
        return temp;
    }

    _handleTypeChange(e) {
        this.setState({
            type: e.target.value
        });
    }

    _handleGooglePlace(name, lat, lng) {
        this.setState({
            loc_data: {name, lat, lng},
        });
    }

    _handleCityCountry(city, country) {
        this.setState({
            city, country
        });
    }

    _renderForm() {
        if (this.state.is_submitted) {
            return (<>
                <h2 className={styles.headingText}>Thank You For Sign Up!</h2>
                <p style={{marginLeft: '10px', color: 'grey', marginTop: '5px'}}>Thank You for your interest in Get a Tour. Please hold back while we review your details and get back to you.
                    For all updates check your email. </p>
                <div>
                    <a href='http://91.205.173.97:3111' target='_blank' className={styles.explore}>Explore getatour.com</a>
                </div>
            </>);
        } else {
            const {handleSubmit, classes} = this.props;
            return (
                <>
                    <div style={{textAlign:'center'}}>
                        <img src={require('../../assets/img/logos/logo.png')} style={{height:'75px'}}/>
                    </div>
                    <h2 className={styles.headingText}>Tour Operator Sign Up</h2>
                    <div style={{marginLeft: '10px', color: 'grey', marginTop: '5px'}}>Please enter following details to
                        register
                    </div>
                    <br/>
                    <form onSubmit={handleSubmit(this._handleSubmit)}>
                        <div className={'formFlex'}>
                            <div className={'formGroup'}>
                                <Field
                                    fullWidth={true}
                                    name="company_name"
                                    component={renderOutlinedTextField}
                                    margin={'dense'}
                                    errorText={'Required'}
                                    label={'Company Name'}/>
                            </div>
                        </div>
                        <div className={'formFlex'}>

                            <div className={'formGroup'}>
                                <Field fullWidth={true}
                                       name="representative_name"
                                       component={renderOutlinedTextField}
                                       margin={'dense'}
                                       errorText={'Required'}
                                       label="Representative Name"/>
                            </div>
                            <div className={'formGroup'}>
                                <Field
                                    fullWidth={true}
                                    name="representative_designation"
                                    component={renderOutlinedTextField}
                                    margin={'dense'}
                                    errorText={'Required'}
                                    label={'Representative Designation'}/>
                            </div>
                        </div>


                        <div className={'formFlex'}>
                            <div className={'formGroup'}>
                                {/*<Field fullWidth={true} name="contact" type={'number'} component={renderOutlinedTextField}*/}
                                {/*       errorText={'Required'}*/}
                                {/*       margin={'dense'}*/}
                                {/*       label="Phone No"/>*/}
                                <Field fullWidth={true} name="contact" component={renderCountryContact} type={'text'}
                                       margin={'dense'}
                                       errorText="Required"
                                       label="Contact"/>
                            </div>
                            <div className={'formGroup'}>
                                <Field fullWidth={true}
                                       type={'email'} name="email" component={renderOutlinedTextField} margin={'dense'}
                                       label="Email"/>
                            </div>
                        </div>

                        <div className={'formFlex'}>
                            <div className={'formGroup'}>
                                <GooglePlace getCityCountry={this._handleCityCountry} data={this.state.loc_data}
                                             changeData={this._handleGooglePlace}></GooglePlace>
                            </div>
                        </div>


                        <div>
                            <span style={{marginLeft: '15px  '}}>Existing User ? <Link to='/login'>Login</Link></span>
                            <div style={{textAlign: 'center', marginTop: '20px'}}>
                                <Button variant={'contained'} type="submit" className={classes.colorButton}>
                                    SIGN UP
                                </Button>
                            </div>
                        </div>
                    </form>
                </>
            )
        }
    }

    render() {
        const {handleSubmit, classes} = this.props;
        return (
            <div className={styles.mainLoginView}>
                <div className={styles.loginFlex1}>
                    <div style={{color: 'white', fontSize: '40px', fontWeight: '500'}}>
                        Welcome To Get A Tour
                    </div>
                    <div style={{width: '80%'}}>
                        <div className={styles.subText}>
                            Identify new growth opportunities for your business with the lucrative alliance with Get a
                            Tour and list down all your tours with the platform
                            <br/> <br/>
                            Be it land tours or water tours, segways or air tours, activities or some special experience
                            with tickets, board now with the Get a Tour platform and facilitate all your bookings
                            automatically with us.
                            We have an exclusive application for your drivers which will get all the updates of your
                            bookings and transfers.
                        </div>
                        <div className={styles.textInfo}>
                            Interested in growing your business? Sign Up as
                        </div>
                        <div>

                            <Button className={classes.btnColor} onClick={this._handleSignupClick} type="submit">
                                Hotel Partner
                            </Button>

                            <Button className={classes.btnColor} onClick={this._handleClose} type="submit">
                                Tour Operator
                            </Button>

                        </div>
                    </div>

                    <div className={styles.bottomContainer}>
                        <span style={{fontWeight: 'bold', fontSize: '18px'}}> Know more about this : </span>
                        <span>
                    <Button className={classes.btnBottom} onClick={this._handleSignupClick} type="submit">
                                How It Works
                            </Button>
                    </span>

                        <span>
                    <Button className={classes.btnBottom} onClick={this._handleSignupClick} type="submit">
                                Contact us
                            </Button>
                    </span>

                        <div style={{marginTop: '25px', fontStyle: 'italic'}}>
                            Finish your registration in 3-simple steps on our intutive host platform and go live
                        </div>
                    </div>
                </div>
                <div className={styles.loginFlex2}>
                    {this._renderForm()}
                </div>
                <DashboardSnackbar/>
            </div>
        );
    }
}

SignupView = reduxForm({
    form: 'LoginPage',  // a unique identifier for this form
    validate,
    asyncValidate,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Required Parameters', type: 'error'});

    }
})(SignupView);

export default withStyles(useStyles)(SignupView);
