import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import PageBox from '../../../components/PageBox/PageBox.component';
import styles from './Contact.module.css'
import File from '../../../components/FileComponent/FileComponent.component'
import EventEmitter from '../../../libs/Events.utils';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField, renderFileField, renderCountryContact
} from '../../../libs/redux-material.utils';

let requiredFields = [];

const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
        if (values.company_contact && values.company_contact.length < 10) {
            errors.company_contact = 'Minimum 10 digits'
        }

        if (values.personal_contact && values.personal_contact.length < 10) {
            errors.personal_contact = 'Minimum 10 digits'
        }
    });
    return errors
};

const contactNormalize = (value, prevValue) => {
    if (value.length > 13) {
        return prevValue
    } else {
        return value;
    }
}

class ContactView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this._submitBtn = React.createRef();
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this.childSubmit = this.childSubmit.bind(this);
    }

    componentDidMount() {
        const {data, is_edit} = this.props;
        if (is_edit) {
            requiredFields = ['company_contact', 'registration_no', 'company_address', 'personal_contact'];
            if (!data.company_logo) {
                // requiredFields.push('company_logo');
            }
            if (!data.company_proof) {
                requiredFields.push('company_proof');
            }
            Object.keys(data).forEach((key) => {
                if (['company_logo', 'company_proof'].indexOf(key) == -1) {
                    const val = data[key];
                    this.props.change(key, val);
                }
            });
        } else {
            requiredFields = ['company_contact', 'registration_no', 'company_address', 'personal_contact', 'company_proof']; //'company_logo'
            Object.keys(data).forEach((key) => {
                const val = data[key];
                this.props.change(key, val);
            });
        }

    }


    _handleSubmit(data) {
        this.props.submitCallback({
            ...data
        });
    }

    _handleFileChange(file, name) {
        const tempFiles = this.state.files;
        tempFiles[name] = file;
        this.setState({
            files: tempFiles
        });
    }

    handleFileChange(e) {
        e.preventDefault();
        if (e.target.files[0]) {
            this.setState({
                file: e.target.files[0],
                file_title: 'File Selected',
                file_url: URL.createObjectURL(e.target.files[0])
            });
            e.target.value = null;
        }
    }

    childSubmit() {
        if (this._submitBtn) {
            // this.props.handleSubmit(this._handleSubmit);
            this._submitBtn.click();
            // this._submitBtn.submit();
            // this._submitBtn.dispatch(new Event('submit'));
        }
    }

    render() {
        const {handleSubmit, common, data} = this.props;
        return (
            <div>

                <form onSubmit={handleSubmit(this._handleSubmit)} onSubmitFail={() => {
                    alert('dasd')
                }}>

                    {/*<div className={styles.contactFlex}>*/}
                    {/*    <div>*/}
                    {/*        <img src={this.state.file_url} alt=""/>*/}
                    {/*    </div>*/}

                    {/*    <div className={styles.file_upload}>*/}
                    {/*        <label>{this.state.file_title}</label>*/}
                    {/*        <input id="upload" onChange={this.handleFileChange.bind(this)}*/}
                    {/*               className="file-upload__input" type="file" name="file-upload" accept="image/x-png,image/gif,image/jpeg"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <div className={styles.profileInfo}>
                                <div>
                                    <Field
                                        max_size={1024 * 1024 * 5}
                                        type={['jpg', 'png', 'pdf', 'jpeg']}
                                        fullWidth={true}
                                        name="company_logo"
                                        component={renderFileField}
                                        label="Company Logo"
                                        show_image
                                        default_image={data.company_logo}
                                    />
                                </div>
                                <div className={styles.nameInfo}>
                                    <div className={styles.name}>{common.name}</div>
                                    {/*<div*/}
                                    {/*    className={styles.city}>{common.city.toLowerCase()}, {common.country.toLowerCase()}*/}
                                    {/*</div>*/}
                                    <div className={styles.email}>{common.email}
                                    </div>
                                    <div className={styles.representative}>Representative: {common.representative_name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="company_address" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   multiline
                                   rows={4}
                                   label="Company's Address"/>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="company_contact" component={renderCountryContact}
                                   margin={'dense'}
                                   label="Company's Phone"/>
                        {/*           normalize={contactNormalize}*/}
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="registration_no" component={renderOutlinedTextField}
                                   margin={'dense'} type={'text'}
                                   label="Company Registration No"/>
                        </div>
                    </div>

                    <div className={'formFlex'} style={{alignItems: 'center'}}>
                        <div className={'formGroup'}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="company_proof"
                                component={renderFileField}
                                accept={'application/pdf, image/*'}
                                label="Company Registration Proof"
                                link={data ? data.company_proof : null}
                            />
                        </div>

                    </div>
                    <button ref={ref => {
                        this._submitBtn = ref;
                    }} type={'submit'} style={{visibility: 'hidden'}}></button>
                </form>

            </div>
        )
    }
}

const ReduxForm = reduxForm({
    form: 'contactinfo',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Required Parameters'});
    }

})(ContactView);

export default connect(null, null, null, {forwardRef: true})(ReduxForm);
