import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {MenuItem} from '@material-ui/core'
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField
} from '../../../libs/redux-material.utils';

import EventEmitter from '../../../libs/Events.utils';

let  requiredFields = []

const validate = (values) => {
    const errors = {};


    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    return errors
};

class Account extends Component{
    constructor(props){
        super(props)

        this.state = {

        }
        this._submitBtn = React.createRef()
        this._handleSubmit = this._handleSubmit.bind(this);
        this.childSubmit = this.childSubmit.bind(this);
    }

    componentDidMount() {
        const {data, is_edit} = this.props;

        requiredFields =   ['account_number', 'name','swift_code']; //ifsc
            Object.keys(data).forEach((key) => {
                const val = data[key];
                this.props.change(key, val);
            });
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

    render(){
        const {handleSubmit} = this.props;
        return(
            <div>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="account_number" component={renderOutlinedTextField} type={'number'}
                                   margin={'dense'}
                                   label="IBAN"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="name" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label="Account Holder's Name"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        {/*<div className={'formGroup'}>*/}
                        {/*    <Field fullWidth={true} name="ifsc" component={renderOutlinedTextField}*/}
                        {/*           margin={'dense'}*/}
                        {/*           label="IFSC Code"/>*/}
                        {/*</div>*/}
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="swift_code" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label="SWIFT Code"/>
                        </div>
                    </div>
                    <button ref={ref => {this._submitBtn = ref;}} type={'submit'} style={{ visibility: 'hidden' }}></button>
                </form>
            </div>
        )
    }
}

const ReduxForm = reduxForm({
    form: 'account',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Required Parameters'});
    }
})(Account);

export default connect(null, null,null,{ forwardRef: true })(ReduxForm);
