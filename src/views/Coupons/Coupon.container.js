/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, FormControlLabel, MenuItem, Switch, withStyles,IconButton} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderFileField,
    renderCheckbox,
    renderOutlinedMultipleSelectField,
    renderDatePicker
} from '../../libs/redux-material.utils';
import {serviceCheckCoupon} from "../../services/Coupons.service";
import EventEmitter from "../../libs/Events.utils";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import styles from './styles.module.css'

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field] && values[field] !=0) {
            errors[field] = 'Required'
        } else if( values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
            errors[field] = 'Required'
        }
    });

    if (values.discount && values.discount_type == 'PERCENT' && values.discount > 100) {
        errors.discount = 'Percentage must be less than 100';
    }
    return errors
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


let lastValue = '';
let isExists = false;

const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.coupon) {
            const value = values.coupon;
            if (lastValue == value && isExists) {
                reject({coupon: 'Coupon Already Registered'});
            } else {
                const data = props.data;
                serviceCheckCoupon({coupon: value, id: data ? data.id : null}).then((data) => {
                    console.log(data);
                    lastValue = value;
                    if (!data.error) {
                        if (data.data.exists) {
                            reject({coupon: 'Coupon Already Registered'});
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

const percentNormalize = (value, prevValue) => {
    if (value > 100) {
        return prevValue
    } else {
        return value;
    }
}

class CouponCreateContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            discount_type: null,
            is_active: true,
            show_confirm: false,

        };
        this.COUPON_TYPE = {
            GENERAL: 'GENERAL',
            USER: 'USER',
            // FIRST_TRANSACTION: 'FIRST TRANSACTION'
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleType = this._handleType.bind(this);
        this._handleDiscount = this._handleDiscount.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['coupon', 'discount_type', 'discount', 'valid_till', 'max_count', 'type', 'min_cart'];
            Object.keys(data).forEach((val) => {

                if (['image', 'status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                    if (val == 'type') {
                        this.setState({
                            type: temp
                        })
                    }
                }
            });
            this.setState({
                is_active: data.status == 'ACTIVE',
            });
        } else {
            requiredFields = ['coupon', 'discount_type', 'discount', 'valid_till', 'max_count', 'type', 'min_cart'];
            this.props.change('valid_till', new Date());
        }
    }

    // _handleTypeChange(e) {
    //     this.setState({
    //         type: e.target.value
    //     });
    // }

    _handleSubmit(tData) {
        console.log(tData);
        // const fd = new FormData();
        // Object.keys(tData).forEach((key) => {
        //     // if (key != 'valid_till') {
        //         fd.append(key, tData[key]);
        //     // }
        // });
        // console.log(tData['valid_till']);
        // const tempDate  = (tData['valid_till']);
        // const formattedDate = tempDate.getDate() + "-" + (tempDate.getMonth() + 1) + "-" + tempDate.getFullYear();
        // fd.append('valid_till', formattedDate);
        const {data} = this.props;
        const tempData = {...tData, status: (this.state.is_active ? 'ACTIVE' : 'INACTIVE')};
        if (data) {
            this.props.handleDataSave(tempData, 'UPDATE')
        } else {
            this.props.handleDataSave(tempData, 'CREATE')
        }
    }

    // _handleReject() {
    //     const {data} = this.props;
    //     this.props.changeStatus(data, 'REJECT');
    // }

    _renderReject() {
        if (this.props.data) {
            return (<Button variant={'contained'} className={this.props.classes.btnError} onClick={this._handleReject}
                            type="button">
                Reject
            </Button>);
        }
        return null;
    }

    _renderMenuTypes() {
        return Object.keys(this.COUPON_TYPE).map((key) => {
            const val = this.COUPON_TYPE[key];
            return (
                <MenuItem value={key}>{val}</MenuItem>
            )
        })
    }

    _handleChange() {
        this.setState({
            is_checked: !this.state.is_checked
        })
    }

    _renderCities() {
        return this.props.countries.map((val) => {
            return (
                <MenuItem value={val.id}>{val.title}</MenuItem>
            )
        })
    }

    _handleType(e) {
        const type = e.target.value;
        this.setState({
            type: type,
        });
        if (type == 'PRODUCT' || type == 'CATEGORY' || type == 'USER') {
            const index = requiredFields.indexOf('ref_ids');
            if (index == -1) {
                requiredFields.push('ref_ids');
            }
        } else {
            const index = requiredFields.indexOf('ref_ids');
            if (index != -1) {
                requiredFields.splice(index, 1);
            }
        }
    }

    _renderTypeRef() {
        const {type} = this.state;
        const {listData} = this.props;
        if (type == 'PRODUCT' || type == 'CATEGORY' || type == 'USER') {
            let label = 'Select ' + this.COUPON_TYPE[type];
            let list = [];
            if (type == 'CATEGORY') {
                list = listData.categories;
            } else if (type == 'PRODUCT') {
                list = listData.products;
            } else if (type == 'USER') {
                list = listData.users
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
                    name="ref_ids"
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

    _handleDiscount(e) {
        this.setState({
            discount_type: e.target.value
        });
    }

    _handleDiscountType() {

    }

    _handleActive() {
        this.setState({
            is_active: !this.state.is_active,
        });
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
            <div>
                <div className={styles.headerFlex}>
                    <h2>Coupon Info</h2>
                    {data && <IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                         onClick={this._handleDelete}
                                         type="button">
                        <DeleteIcon />
                    </IconButton> }
                </div>
                <hr/>
                {/*<Snackbar*/}
                {/*    open={this.state.open}*/}
                {/*    message="Data Saved!"*/}
                {/*    autoHideDuration={4000}*/}
                {/*    onRequestClose={this.handleRequestClose}*/}
                {/*/>*/}

                <form onSubmit={handleSubmit(this._handleSubmit)}>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="coupon" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label="Coupon"/>
                        </div>
                        <div className="formGroup">
                            <Field
                                inputId={'discount_type'}
                                fullWidth={true}
                                name="discount_type"
                                component={renderOutlinedSelectField}
                                margin={'dense'}
                                label="Discount Type"
                                onChange={this._handleDiscount}>
                                <MenuItem value={'FIXED'}>FIXED</MenuItem>
                                <MenuItem value={'PERCENT'}>PERCENT</MenuItem>
                            </Field>
                        </div>
                    </div>


                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="discount"
                                type={'number'}
                                normalize={this.state.discount_type == 'PERCENT' ? percentNormalize : null}
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Cashback"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="max_discount"
                                type={'number'}
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Max Cashback (Optional) "/>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="max_count"
                                type={'number'}
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Max Count (0 for Unlimited)"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="valid_till"
                                   component={renderDatePicker}
                                   margin={'dense'}
                                   label="Valid Till"
                                   ampm={false}
                                   minDate={new Date()}
                            />
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
                                label="Coupon Type"
                                onChange={this._handleType}
                            >
                                {this._renderMenuTypes()}
                            </Field>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            {this._renderTypeRef()}
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                name="use_multitimes"
                                component={renderCheckbox}
                                label={"User can use multi-times?"}
                            />
                        </div>
                        <div className="formGroup">
                            <Field
                                fullWidth={true}
                                name="min_cart"
                                type={'number'}
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Min Recharge Value (0 for Unlimited)"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            {this._renderActive()}
                        </div>
                        <div className={'formGroup'}>
                            <div style={{float: 'right'}}>
                                <Button variant={'contained'} color={'primary'} type={'submit'}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>


                    {/*<div style={{textAlign: 'right'}}>*/}
                    {/*<Button variant={'contained'} className={this.props.classes.btnSuccess} type="submit">*/}
                    {/*Approve*/}
                    {/*</Button>*/}
                    {/*{this._renderReject()}*/}
                    {/*</div>*/}
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
    form: 'createprovider',  // a unique identifier for this form
    validate,
    asyncValidate,
    // asyncBlurField: ['email'],
    enableReinitialize: true,
    onSubmitFail: errors => {
        console.log(errors);
        // EventEmitter.dispatch(EventEmitter.THROW_ERROR, 'Rejected');
    }
})(withStyles(useStyle, {withTheme: true})(CouponCreateContainer));

const mapStateToProps = state => {
    //console.log(user_profile);
    return {}
};

export default connect(mapStateToProps, null)(ReduxForm);
