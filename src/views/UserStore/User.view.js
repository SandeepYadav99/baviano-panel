import React, {Component} from 'react';
import PageBox from '../../components/PageBox/PageBox.component';
import startsWith from 'lodash.startswith';
import {Button, MenuItem, withStyles, FormControlLabel, Switch,IconButton} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderFileField,
    renderOutlinedMultipleSelectField, renderCountryContact
} from '../../libs/redux-material.utils';
import EventEmitter from "../../libs/Events.utils";
import {CountryPhone} from '../../components/index.component';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import styles from './Style.module.css';
import {bindActionCreators} from "redux";
import {serviceProviderEmailExists} from "../../services/ProviderRequest.service";
import {serviceProviderUserCheck} from "../../services/ProviderUser.service";

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
    return errors
};

const countNormalize = (value, prevValue) => {
    if (value.length > 500) {
        return prevValue;
    }
    return value;
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


let lastValue = '';
let isValueExists = false;

const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.email) {
            const value = values.email;
            if (lastValue == value && isValueExists && false) {
                reject({name: 'Email Already Registered'});
            } else {
                const tempQuery = {email: value};
                const {data} = props;
                if (data) {
                    tempQuery['id'] = data.id;
                }
                serviceProviderUserCheck(tempQuery).then((data) => {
                    console.log(data);
                    lastValue = value;
                    if (!data.error) {
                        const error = {};
                        let isError = false;
                        if (data.data.is_exists) {
                            error['email'] = 'Email Already Registered';
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

class ProviderUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_active: true,
            show_confirm: false,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleActive = this._handleActive.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['name', 'email', 'contact', 'role'];
            Object.keys(data).forEach((val) => {
                if (['image', 'contact', 'country_code', 'status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                } else if (val == 'contact') {
                    this.props.change(val, `${data['country_code']} ${data['contact']}`)
                }
            });
            this.setState({
                is_active: data.status == 'ACTIVE',
            })
        } else {
            requiredFields = ['name', 'image', 'email', 'password', 'contact', 'role'];
        }
    }

    _handleSubmit(tData) {
        console.log(tData)
        const fd = new FormData();
        Object.keys(tData).forEach((key) => {
            fd.append(key, tData[key]);
        });
        const {data} = this.props;
        fd.append('status', (this.state.is_active ? 'ACTIVE' : 'INACTIVE'));
        if (data) {
            this.props.handleDataSave(fd, 'UPDATE')
        } else {
            this.props.handleDataSave(fd, 'CREATE')
        }
    }

    _handleActive() {
        this.setState({
            is_active: !this.state.is_active,
        });
    }


    _handleFileChange(file) {
        this.setState({
            company_proof: file
        })
    }

    _renderActive() {
        const {data} = this.props;
        if (data) {
            return (<FormControlLabel
                control={
                    <Switch color={'primary'} checked={this.state.is_active} onChange={this._handleActive.bind(this)}
                            value="is_active"/>
                }
                label="Active ?"
            />);
        } else {
            return null
        }
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
        } return null;
    }


    render() {
        const {handleSubmit, data} = this.props;
        return (
            <div >
                <div className={styles.headerFlex}>
                    <h2>UserStore</h2>
                    {data && <IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                         onClick={this._handleDelete}
                                         type="button">
                        <DeleteIcon />
                    </IconButton> }
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={''} style={{marginRight: '20px'}}>
                            <Field
                                max_size={2 * 1024 * 1024}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="image"
                                component={renderFileField}
                                // label="User Image"
                                link={data ? data.image : ''}
                                show_image
                                default_image={data ? data.image : null}
                            />
                        </div>
                        <div className={'formGroup'}>
                            <div>
                                <Field fullWidth={true} name="name" component={renderOutlinedTextField}
                                       margin={'dense'}
                                       label="Full Name"/>
                            </div>
                            <br/>
                            <div>
                                <Field fullWidth={true}
                                       type={'email'}
                                       name="email"
                                       component={renderOutlinedTextField}
                                       margin={'dense'}
                                       label="Email"/>
                            </div>
                        </div>
                    </div>


                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="contact"
                                   type={'number'}
                                   component={renderCountryContact}
                                   margin={'dense'}
                                   label="Phone No"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                type={'password'}
                                fullWidth={true}
                                name="password"
                                margin={'dense'}
                                component={renderOutlinedTextField}
                                label="Password"/>
                        </div>
                    </div>


                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="role"
                                   component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="User Role">
                                <MenuItem value={'MANAGER'}>Manager</MenuItem>
                                <MenuItem value={'CUSTOMER_CARE'}>Customer Care</MenuItem>
                                <MenuItem value={'CEO'}>CEO</MenuItem>
                            </Field>
                        </div>
                    </div>
                    {this._renderActive()}

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
    iconBtnError: {
        color: theme.palette.error.dark
    }
});


const ReduxForm = reduxForm({
    form: 'category',  // a unique identifier for this form
    validate,
    asyncValidate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(ProviderUser));

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
