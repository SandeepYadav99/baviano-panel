import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import styles from '../Contact/Contact.module.css'
import {MenuItem,Select} from '@material-ui/core'
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField, renderFileField
} from '../../../libs/redux-material.utils';

import EventEmitter from '../../../libs/Events.utils';

import File from '../../../components/FileComponent/FileComponent.component'

let requiredFields = [];

const validate = (values) => {
    const errors = {};


    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    return errors
};

class KYC extends Component{
    constructor(props){
        super(props);

        this.state = {
            file: null,
            file_title: '+ User Image',
            file_url: null,
            kyc_proof:null
        }
        this._submitBtn = React.createRef();
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this)
        this.childSubmit = this.childSubmit.bind(this);
    }

    componentDidMount() {
        const {data, is_edit} = this.props;
        if (is_edit) {
            requiredFields =  ['document_type', 'document_no'];
            Object.keys(data).forEach((key) => {
                if ([ 'proof', 'user_image', 'kyc_proof', 'id_proof'].indexOf(key) == -1) {
                    const val = data[key];
                    this.props.change(key, val);
                }
            });
        } else {
            requiredFields =  ['document_type', 'document_no', 'proof'];
            const skipValues = [];
            if (data.user_image) {
                skipValues.push('user_image');
            } else {
                // requiredFields.push('user_image')
            }
            if (data.id_proof || data.kyc_proof) {
                skipValues.push('kyc_proof');
                skipValues.push('id_proof');
            } else {
                requiredFields.push('kyc_proof');
                requiredFields.push('id_proof');
            }
            Object.keys(data).forEach((key) => {
                if (skipValues.indexOf(key) == -1) {
                    const val = data[key];
                    this.props.change(key, val);
                }
            });
        }

        // const {data} = this.props;
        // Object.keys(data).forEach((key) => {
        //     const val = data[key];
        //     this.props.change(key, val);
        // })
    }

    _handleSubmit(data) {
        console.log(data);
        this.props.submitCallback(data);
    }

    childSubmit() {
        if (this._submitBtn){
            // this.props.handleSubmit(this._handleSubmit);
            this._submitBtn.click();
            // this._submitBtn.submit();
            // this._submitBtn.dispatch(new Event('submit'));
        }
    }

    handleFileChange(e) {
        e.preventDefault();
        if (e.target.files[0]) {
            this.setState({
                file: e.target.files[0],
                open: false,
                file_title: 'File Selected',
                file_url: URL.createObjectURL(e.target.files[0])
            });
            e.target.value = null;
        }
    }

    _handleFileChange(file){
        this.setState({
            kyc_proof:file
        })
    }

    render(){
        const {handleSubmit, data} = this.props;
        return(
            <div>
                <form onSubmit={handleSubmit(this._handleSubmit)}>

                    <div className={'formFlex'} style={{alignItems:'center'}}>
                        {/*<div className={''} style={{ marginRight: '20px', marginLeft: '30px' }}>*/}
                        {/*    <Field*/}
                        {/*        max_size={1024*1024*5}*/}
                        {/*        type={['jpg', 'png']}*/}
                        {/*        fullWidth={true}*/}
                        {/*        name="user_image"*/}
                        {/*        component={renderFileField}*/}
                        {/*        label="User Image"*/}
                        {/*        show_image*/}
                        {/*        default_image={data.user_image}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className={'formGroup'}>

                            <Field fullWidth={true} name="document_no" component={renderOutlinedTextField} margin={'dense'}
                                   label="Document Number"/>
                        </div>



                    </div>

                    <div className={'formFlex'} style={{alignItems:'center'}}>


                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="document_type" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Document Type">
                                <MenuItem value={'Driving Licence'}>Driving Licence</MenuItem>
                                <MenuItem value={'Passport'}>Passport</MenuItem>
                                <MenuItem value={'Govt ID'}>Govt. ID</MenuItem>
                            </Field>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                max_size={1024*1024*5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="kyc_proof"
                                component={renderFileField}
                                accept={'image/*, application/pdf'}
                                label="Proof"
                                link={data ? data.id_proof : null}
                            />
                        </div>
                    </div>
                    <button ref={ref => {this._submitBtn = ref;}} type={'submit'} style={{ visibility: 'hidden' }}></button>
                </form>
            </div>
        )
    }
}

const ReduxForm = reduxForm({
    form: 'kyc',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Required Parameters' });
    }
})(KYC);

export default connect(null, null,null,{ forwardRef: true })(ReduxForm);
