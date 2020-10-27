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
    renderOutlinedMultipleSelectField, renderDatePicker
} from '../../libs/redux-material.utils';
import EventEmitter from "../../libs/Events.utils";
import {CountryPhone} from '../../components/index.component';
import styles from './Style.module.css';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import {bindActionCreators} from "redux";
import {serviceProviderEmailExists} from "../../services/ProviderRequest.service";
import {servicePromotionCheck} from "../../services/Promotion.service";

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field] || values[field] == ' ') {
            errors[field] = 'Required'
        } else if( values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
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
    if (value.length > 30) {
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

let lastValue = '';
let isValueExists = false;


class Promotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_active: true,
            type: 'GENERAL',
            show_confirm: false,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleActive = this._handleActive.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
        this._handleType = this._handleType.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['name', 'type'];
            Object.keys(data).forEach((val) => {
                if (['image', 'status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
            this.setState({
                is_active: data.status == 'ACTIVE',
                type: data.type,
            })
        } else {
            requiredFields = ['name', 'type'];
        }
    }

    _handleSubmit(tData) {
        console.log(tData)
        const fd = new FormData();
        Object.keys(tData).forEach((key) => {
            fd.append(key, tData[key]);
        });
        fd.append('status', (this.state.is_active ? 'ACTIVE' : 'INACTIVE'));
        const {data} = this.props;
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
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion?"}</DialogTitle>
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
    _handleType(e) {
        const type = e.target.value;
        this.setState({
            type: type,
        });
        if (type == 'CATEGORY') {
            const index = requiredFields.indexOf('ref_id');
            if (index == -1) {
                requiredFields.push('ref_id');
            }
        } else {
            const index = requiredFields.indexOf('ref_id');
            if (index != -1) {
                requiredFields.splice(index, 1);
            }
        }
    }

    _renderTypeRef() {
        const {type} = this.state;
        const {listData} = this.props;
        if ( type == 'CATEGORY') {
            let label = 'Select ' + ' Category';
            let list = [];
            if (type == 'CATEGORY') {
                list = listData.categories;
            }
            const menu = list.map((val) => {
                return (
                    <MenuItem value={val.id}>{val.name}</MenuItem>
                );
            });
            return (
                <Field
                    inputId={'type'}
                    fullWidth={true}
                    name="ref_id"
                    component={renderOutlinedSelectField}
                    margin={'dense'}
                    label={label}
                >
                    {menu}
                </Field>
            )
        }
        return null;

    }



    render() {
        const {handleSubmit, data} = this.props;
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h2>Promotion</h2>
                    {data && <IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                         onClick={this._handleDelete}
                                         type="button">
                        <DeleteIcon />
                    </IconButton> }
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'} style={{ alignItems: 'center' }}>
                        <div className={''} style={{ margin: '0px 20px'}}>
                            <Field
                                max_size={2 * 1024 * 1024}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="image"
                                component={renderFileField}
                                label=""
                                show_image
                                default_image={data ? data.image : ''}
                                link={data ? data.image : ''}
                            />
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="name" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   normalize={countNormalize}
                                   label="Promotion Title"/>
                        </div>
                    </div>
                    <br/>
                    <div className="formFlex">
                            <div className={'formGroup'}>
                                <Field fullWidth={true} name="description" component={renderOutlinedTextField}
                                       margin={'dense'}
                                       multiline
                                       rows={3}
                                       label="Promotion Description"/>
                            </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'type'}
                                fullWidth={true}
                                name="type"
                                component={renderOutlinedSelectField}
                                margin={'dense'}
                                label="Promotion Type"
                                onChange={this._handleType}
                            >
                                <MenuItem value={'GENERAL'}>General</MenuItem>
                                <MenuItem value={'OTHER'}>Other</MenuItem>
                            </Field>
                        </div>

                        <div className="formGroup">
                            <Field fullWidth={true}
                                   name="start_date"
                                   component={renderDatePicker}
                                   margin={'dense'}
                                   label="Date"
                                   ampm={false}
                                   minDate={new Date()}
                            />
                        </div>
                        {/*<div className={'formGroup'}>*/}
                        {/*    {this._renderTypeRef()}*/}
                        {/*</div>*/}
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            {this._renderActive()}
                        </div>
                    </div>
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
    form: 'promotion',  // a unique identifier for this form
    validate,
    // asyncValidate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(Promotion));


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
