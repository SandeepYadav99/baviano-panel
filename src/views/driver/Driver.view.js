import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {MenuItem, Button, IconButton} from '@material-ui/core';
import {Delete as DeleteIcon} from '@material-ui/icons';
import PageBox from '../../components/PageBox/PageBox.component';
import startsWith from 'lodash.startswith';
import {
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField,
    renderFileField, renderOutlinedTextFieldWithLimit, renderCountryContact,
} from '../../libs/redux-material.utils';
import EventEmitter from "../../libs/Events.utils";
import {CountryPhone} from '../../components/index.component';

import styles from './Driver.module.css';
import {bindActionCreators} from "redux";
import {serviceProviderEmailExists} from "../../services/ProviderRequest.service";
import {serviceDriverCheck} from "../../services/Driver.service";
import {withStyles} from "@material-ui/core/index";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (values.age && parseInt(values.age) < 18) {
        errors.age = 'Minimum age must be 18'
    }
    if (values.languages && values.languages.length == 0) {
        errors.languages = 'Required';
    }
    return errors
};

const countNormalize = (value, prevValue) => {
    if (value.length > 500) {
        return prevValue;
    }
    return value;
};

const educationNormalize = (value, prevValue) => {
    if (value.length > 300) {
        return prevValue
    } else {
        return value;
    }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


let lastContact = '';
let isContactExists = false;

const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.contact) {
            const value = values.contact;
            if (lastContact == value && isContactExists && false) {
                reject({contact: 'Contact Already Registered'});
            } else {
                const tempQuery = {contact: value};
                const {data} = props;
                if (data) {
                    tempQuery['id'] = data.id;
                }
                serviceDriverCheck(tempQuery).then((data) => {
                    console.log(data);
                    lastContact = value;
                    if (!data.error) {
                        const error = {};
                        let isError = false;
                        if (data.data.contact_exists) {
                            error['contact'] = 'Contact Already Registered';
                            isError = true;
                        }
                        if (isError) {
                            reject(error);
                        } else {
                            resolve({});
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

class Driver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            license_proof: null
        };
        this.languages = [{id: 'ENGLISH', name: 'ENGLISH'}, {id: 'GERMANY', name: 'GERMANY'}];
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['first_name', 'last_name', 'contact', 'address', 'age', 'gender', 'email'];
            Object.keys(data).forEach((val) => {
                if (['license_proof', 'user_image'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
        } else {
            requiredFields = ['first_name', 'last_name', 'contact', 'address', 'age', 'gender', 'email', 'user_image'];
        }
    }

    _handleSubmit(tData) {
        console.log(tData);
        const fd = new FormData();
        Object.keys(tData).forEach((key) => {
            fd.append(key, tData[key]);
        });
        const {data} = this.props;
        if (data) {
            // fd.append('id', data.id);
            this.props.handleDataSave(fd, 'UPDATE')
        } else {
            this.props.handleDataSave(fd, 'CREATE')
        }

    }

    _handleFileChange(file) {
        this.setState({
            company_proof: file
        })
    }

    _convertData(data) {
        const temp = {};
        data.forEach((val) => {
            temp[val.id] = val.name;
        });
        return temp;
    }

    _suspendItem() {
        const {data} = this.props;
        this.setState({
            show_confirm: false,
        });
        this.props.handleDelete(data.id);
    }

    _handleDialogClose() {
        this.setState({
            show_confirm: false,
        })
    }


    _handleDelete() {
        this.setState({
            show_confirm: true
        });
    }


    _renderDialog() {
        const {classes} = this.props;
        if (this.state.show_confirm) {
            return (<Dialog
                keepMounted
                TransitionComponent={Transition}
                open={this.state.show_confirm}
                onClose={this._handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{paper: classes.dialog}}
            >
                <DialogTitle id="alert-dialog-title">{"Are You Sure"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really want to delete the item?
                        <br/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleDialogClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={this._suspendItem} color="primary">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>)
        }
        return null;
    }


    render() {
        const {handleSubmit, data, country_code, country_currency} = this.props;
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h2>Driver Information</h2>
                    {data && <IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                         onClick={this._handleDelete}
                                         type="button">
                        <DeleteIcon/>
                    </IconButton>}
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>

                        </div>
                        <div className={'formGroup'}>

                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={''} style={{marginLeft: '15px', marginRight: '20px'}}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf']}
                                fullWidth={true}
                                name="user_image"
                                component={renderFileField}
                                label=""
                                show_image
                                default_image={data ? data.user_image : null}
                            />
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="first_name" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label="Driver First Name"
                                   errorText="Required"
                            />
                            <Field fullWidth={true} name="last_name" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   errorText="Required"
                                   label="Last Name"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="contact"
                                   component={renderCountryContact}
                                   type={'text'}
                                   margin={'dense'}
                                   country_code={country_code}
                                   label="Contact"
                            />
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="email" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   errorText="Incorrect Email"
                                   label="Email"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="age" component={renderOutlinedTextField} type={'number'}
                                   margin={'dense'}
                                   label="Age"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="gender" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Gender">
                                <MenuItem value={'MALE'}>Male</MenuItem>
                                <MenuItem value={'FEMALE'}>Female</MenuItem>
                            </Field>
                        </div>
                    </div>

                    {/*<div className={'formFlex'} style={{alignItems: 'center'}}>*/}

                    {/*<div className={'formGroup'}>*/}
                    {/*<div style={{ display: 'flex', alignItems: 'center' }}>*/}
                    {/*<Field fullWidth={true} name="base_price" component={renderOutlinedTextField}*/}
                    {/*type={'number'}*/}
                    {/*margin={'dense'}*/}
                    {/*label="Base Price"/>*/}
                    {/*<div style={{ marginLeft: '10px' }}>*/}
                    {/*{country_currency}*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={'formFlex'} style={{alignItems: 'center'}}>*/}

                    {/*<div className={'formGroup'}>*/}
                    {/*<Field fullWidth={true} name="license_no" component={renderOutlinedTextField}*/}
                    {/*type={'text'}*/}
                    {/*margin={'dense'}*/}
                    {/*label="Licence No"*/}

                    {/*/>*/}
                    {/*</div>*/}
                    {/*<div className={'formGroup'}>*/}
                    {/*<Field*/}
                    {/*max_size={1024 * 1024 * 5}*/}
                    {/*type={['jpg', 'png', 'pdf']}*/}
                    {/*fullWidth={true}*/}
                    {/*name="license_proof"*/}
                    {/*component={renderFileField}*/}
                    {/*label="License Proof"*/}
                    {/*link={data ? data.license_proof : null}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    <div className={'formFlex'} style={{alignItems: 'center'}}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="address" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   multiline
                                   rows={2}
                                   label="Address"/>
                        </div>
                        {/*<div className={'formGroup'}>*/}
                        {/*<Field*/}
                        {/*inputId={'language'}*/}
                        {/*fullWidth={true}*/}
                        {/*name="languages"*/}
                        {/*margin={'dense'}*/}
                        {/*label="Language Known"*/}
                        {/*component={renderOutlinedMultipleSelectField}*/}
                        {/*extract={{value: 'id', title: 'name'}}*/}
                        {/*dataObj={this._convertData(this.props.languages)}*/}
                        {/*data={this.props.languages}>*/}
                        {/*</Field>*/}
                        {/*</div>*/}
                    </div>

                    {/*<div className={'formFlex'} style={{alignItems: 'center'}}>*/}
                    {/*<div className={'formGroup'}>*/}
                    {/*<Field fullWidth={true} name="overview" component={renderOutlinedTextFieldWithLimit}*/}
                    {/*multiline*/}
                    {/*rows="3"*/}
                    {/*maxLimit={500}*/}
                    {/*margin={'dense'}*/}
                    {/*label="Overview"*/}
                    {/*normalize={countNormalize}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={'formFlex'}>*/}
                    {/*<div className={'formGroup'}>*/}
                    {/*<Field fullWidth={true} name="education" component={renderOutlinedTextFieldWithLimit}*/}
                    {/*multiline*/}
                    {/*rows="3"*/}
                    {/*margin={'dense'}*/}
                    {/*maxLimit={300}*/}
                    {/*normalize={educationNormalize}*/}
                    {/*label="Educational Details"/>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <div style={{float: 'right'}}>
                        <Button variant={'contained'} color={'primary'} type={'submit'}>
                            Submit
                        </Button>
                    </div>
                </form>
                {this._renderDialog()}

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
    iconBtnError: {
        color: theme.palette.error.dark
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

const ReduxForm = reduxForm({
    form: 'driver',  // a unique identifier for this form
    validate,
    asyncValidate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(Driver));

function mapStateToProps(state) {
    return {
        country_code: state.auth.user_profile.country_code,
        country_currency: state.auth.user_profile.country_currency,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
