import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {MenuItem, Button, IconButton, Tabs, Tab} from '@material-ui/core';
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
import BatchDeliveryList from './component/Batches/Batches.component';
import SupportMessagesList from './component/SupportMessages/SupportMessage.component';
import DriverJobCalender from "./component/JobCalendar/JobCalendar.component";
import ReferredList from './component/ReferredData/ReferredList.component';
import DriverPayouts from './component/DriverPayouts/DriverPayouts.component';
import Constants from '../../config/constants';

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
            license_proof: null,
            tab_value: 0,
        };
        this.languages = [{id: 'ENGLISH', name: 'ENGLISH'}, {id: 'GERMANY', name: 'GERMANY'}];
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
        this._handleTabChange = this._handleTabChange.bind(this);
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

    a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }


    _handleTabChange(id, handleValue) {
        this.setState({
            tab_value: handleValue
        })
    }
    _renderCardButton() {
        const { data } = this.props;
        return (
            <Button >
                <a target={'_blank'} href={`${Constants.DEFAULT_APP_URL}/drivers/qrcode/${data.id}`}>Download Card</a>
            </Button>
        )
    }

    _renderForm() {
        const {tab_value} = this.state;
        if (tab_value == 0) {
            const {handleSubmit, data, country_code, country_currency} = this.props;
            return (
                <div>
                    <div className={styles.headerFlex}>
                        <h2>Driver Information</h2>
                        {data && (<div>{this._renderCardButton()}<IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                             onClick={this._handleDelete}
                                             type="button">
                            <DeleteIcon/>
                        </IconButton></div>)}
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
                                    type={['jpg', 'png', 'pdf', 'jpeg']}
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


                        <div className={'formFlex'} style={{alignItems: 'center'}}>
                            <div className={'formGroup'}>
                                <Field fullWidth={true} name="address" component={renderOutlinedTextField}
                                       margin={'dense'}
                                       multiline
                                       rows={2}
                                       label="Address"/>
                            </div>

                        </div>
                        <div style={{float: 'right'}}>
                            <Button variant={'contained'} color={'primary'} type={'submit'}>
                                Submit
                            </Button>
                        </div>
                    </form>
                    {this._renderDialog()}
                    {data && (<div>
                        <BatchDeliveryList driverId={data.id}/>
                    </div>)}
                    {data && (<div>
                        <SupportMessagesList driverId={data.id}/>
                    </div>)}
                    {data && (
                        <div>
                            <ReferredList userId={data.id}></ReferredList>
                        </div>
                    )}
                </div>

            )
        } return null;
    }
    _renderCalendar() {
        const {tab_value} = this.state;
        const {data} = this.props;
        if (tab_value == 1) {
            return (
                <DriverJobCalender driverId={data.id}/>
            )
        }
        return null;
    }

    _renderMonthlyDeliveries() {
        const {tab_value} = this.state;
        const {data} = this.props;
        if (tab_value == 2) {
            return (
                <DriverPayouts driverId={data.id}/>
            )
        }
        return null;
    }

    render () {
        const { data } = this.props;
        const {tab_value} = this.state;
        return (
            <div className={styles.mainContainer}>
                <Tabs value={tab_value} onChange={this._handleTabChange} aria-label="simple tabs example">
                    <Tab label="Driver Detail" {...this.a11yProps(0)} />
                    {data && (<Tab label="Driver Calendar" {...this.a11yProps(1)} />)}
                    {data && (<Tab label="Monthly Deliveries" {...this.a11yProps(2)} />)}
                </Tabs>
                {this._renderForm()}
                {this._renderCalendar()}
                {this._renderMonthlyDeliveries()}
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
