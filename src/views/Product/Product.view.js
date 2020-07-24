import React, {Component} from 'react';
import {Button, MenuItem, withStyles, FormControlLabel, Switch,IconButton} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import Constants from '../../config/constants';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderFileField,
    renderOutlinedMultipleSelectField, renderOutlinedTextFieldWithLimit, renderCheckbox
} from '../../libs/redux-material.utils';
import EventEmitter from "../../libs/Events.utils";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import styles from './Style.module.css';
import {bindActionCreators} from "redux";

let requiredFields = [];
const validate = (values) => {
    console.log(values);
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field] && values[field] != 0) {
            errors[field] = 'Required'
        } else if( values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
            errors[field] = 'Required'
        } else if (values[field] && Array.isArray(values[field]) && (values[field]).length == 0) {
            errors[field] = 'Required'
        }
    });
    if (values.list_price == 0) {
        errors.list_price = 'Value cannot be zero';
    }
    if (values.price == 0) {
        errors.price = 'Value cannot be zero';
    }
    if (values.list_price && values.price) {
        if (parseFloat(values.list_price) > parseFloat(values.price)) {
            errors.list_price = 'Value should be less than MRP';
        }
    }
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

const nameNormalize = (value, prevValue) => {
    if (value.length > 50) {
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

const taglineNormalize = (value, prevValue) => {
    if (value.length > 50) {
        return prevValue
    } else {
        return value;
    }
}


class Product extends Component {
    constructor(props) {
        super(props);
        this.tags = Constants.PRODUCT_TAGS.map((val) => {
            return {id: val, name: val}
        });
        this.state = {
            is_active: true,
            is_featured: false,
            show_confirm: false,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleActive = this._handleActive.bind(this);
        this._handleFeatured = this._handleFeatured.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['name', 'unit_id', 'list_price', 'price', 'tags', 'category_ids',  'quantity', 'max_quantity', 'unit_step', 'min_value', 'min_percentage']; //'label',
            Object.keys(data).forEach((val) => {
                if (['status', 'image','is_featured'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
            this.setState({
                is_active: data.status == 'ACTIVE',
                is_featured: data.is_featured
            })
        } else {
            requiredFields = ['name', 'image', 'unit_id', 'list_price', 'price', 'tags', 'category_ids',  'quantity', 'max_quantity', 'unit_step', 'min_value', 'min_percentage']; //'label',
        }
    }

    _handleSubmit(tData) {
        console.log(tData)
        const fd = new FormData();
        Object.keys(tData).forEach((key) => {
            fd.append(key, tData[key]);
        });
        fd.append('status', (this.state.is_active ? 'ACTIVE' : 'INACTIVE'));
        fd.append('is_featured', (this.state.is_featured));
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

    _handleFeatured() {
        this.setState({
            is_featured: !this.state.is_featured,
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


    _renderFeatured() {
        return (<FormControlLabel
            control={
                <Switch color={'secondary'} checked={this.state.is_featured} onChange={this._handleFeatured}
                        value="is_featured"/>
            }
            label="Featured ?"
        />);
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
        } return null;
    }



    render() {
        const {handleSubmit, data, categories, units} = this.props;
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h2>Product</h2>
                    {data && <IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                         onClick={this._handleDelete}
                                         type="button">
                        <DeleteIcon />
                    </IconButton> }
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'} style={{alignItems: 'center'}}>
                        <div className={''} style={{ margin: '0px 20px' }}>
                            <Field
                                max_size={2 * 1024 * 1024}
                                type={['jpg', 'png', 'pdf']}
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
                                   normalize={nameNormalize}
                                   label="Product Name"/>
                            <Field
                                inputId={'category'}
                                fullWidth={true}
                                name="category_ids"
                                component={renderOutlinedMultipleSelectField}
                                margin={'dense'}
                                dataObj={this._convertData(categories)}
                                extract={{value: 'id', title: 'name'}}
                                data={categories}
                                label="Category">
                            </Field>
                        </div>

                    </div>

                    {/*<div className={'formFlex'}>*/}
                    {/*    <div className={'formGroup'}>*/}
                    {/*     */}

                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="description"
                                   component={renderOutlinedTextField}
                                   multiline
                                   rows="2"
                                   margin={'dense'}
                                   label="Description"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        {/*<div className={'formGroup'}>*/}
                            {/*<Field fullWidth={true}*/}
                                   {/*name="price"*/}
                                   {/*component={renderOutlinedTextField}*/}
                                   {/*type={'number'}*/}
                                   {/*margin={'dense'}*/}
                                   {/*label="MRP"/>*/}
                        {/*</div>*/}
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="tagline" component={renderOutlinedTextField}
                                // multiline
                                // rows="2"
                                   margin={'dense'}
                                // maxLimit={50}
                                   normalize={taglineNormalize}
                                   label="Tagline"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="list_price"
                                   component={renderOutlinedTextField}
                                   type={'number'}
                                   margin={'dense'}
                                   label="Price"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                // inputId={'quantity_unit'}
                                fullWidth={true}
                                name="unit_id"
                                component={renderOutlinedSelectField}
                                margin={'dense'}
                                label="Quantity Unit">
                                {units.map((val) => {
                                    return (<MenuItem value={val.id}>{val.name}</MenuItem>)
                                })}
                            </Field>
                        </div>
                        <div className={'formGroup'}>

                            <Field
                                fullWidth={true}
                                name="label"
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Label"/>
                        </div>
                    </div>

                    {/*<div className={'formFlex'}>*/}
                        {/*<div className={'formGroup'}>*/}
                            {/*<Field*/}
                                {/*inputId={'tags'}*/}
                                {/*fullWidth={true}*/}
                                {/*name="tags"*/}
                                {/*component={renderOutlinedMultipleSelectField}*/}
                                {/*margin={'dense'}*/}
                                {/*dataObj={this._convertData(this.tags)}*/}
                                {/*extract={{value: 'id', title: 'name'}}*/}
                                {/*data={this.tags}*/}
                                {/*label="Tags">*/}
                            {/*</Field>*/}
                        {/*</div>*/}
                    {/*</div>*/}


                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="quantity"
                                component={renderOutlinedTextField}
                                type={'number'}
                                margin={'dense'}
                                label="Quantity"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="max_quantity"
                                type={'number'}
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Max Quantity (0 for no limit)"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="min_value"
                                component={renderOutlinedTextField}
                                type={'number'}
                                margin={'dense'}
                                label="Min Value"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="min_percentage"
                                type={'number'}
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Min Percentage"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="unit_step"
                                component={renderOutlinedTextField}
                                type={'number'}
                                margin={'dense'}
                                label="Unit Step"/>
                        </div>
                        <div className={'formGroup'}>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            {this._renderFeatured()}
                        </div>
                        <div className={'formGroup'}>
                            {this._renderActive()}
                            <Field
                                fullWidth={true}
                                name="is_trial"
                                component={renderCheckbox}
                                margin={'dense'}
                                label="Is Trial?"/>
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
    form: 'product',  // a unique identifier for this form
    validate,
    // asyncValidate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        // EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(Product));

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
