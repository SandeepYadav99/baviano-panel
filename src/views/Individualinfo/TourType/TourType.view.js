import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField, renderAutoComplete
} from '../../../libs/redux-material.utils';
import {MenuItem} from '@material-ui/core'

import EventEmitter from '../../../libs/Events.utils';


const validate = (values) => {
    const errors = {};
    const requiredFields = ['tour_type','category','service_area'];

    requiredFields.forEach(field => {
        if (!values[field] || (Array.isArray(values[field]) && (values[field]).length == 0)) {
            errors[field] = 'Required'
        }
    });
    return errors
};



class TourType extends Component{
    constructor(props){
        super(props);
        this.state = {

        };

        this._submitBtn = React.createRef();
        this.childSubmit = this.childSubmit.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        Object.keys(data).forEach((key) => {
            const val = data[key];
            this.props.change(key, val);
        })
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


    _convertData(data) {
        const temp = {};
        data.forEach((val) => {
            temp[val.id] = val.name;
        });
        return temp;
    }
    render(){
        const {handleSubmit, tour_types, cities, categories} = this.props;
        return(
            <div>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'tourtype'}
                                fullWidth={true}
                                name="tour_type"
                                component={renderOutlinedMultipleSelectField} margin={'dense'} label="Tour Types"
                                dataObj={this._convertData()}
                                extract={{value: 'id', title: 'name'}}
                                data={tour_types}>
                            </Field>
                        </div>
                    </div>
                        <div className={'formFlex'}>
                            <div className={'formGroup'}>
                            <Field
                                inputId={'servicearea'}
                                fullWidth={true}
                                name="service_area"
                                component={renderOutlinedMultipleSelectField} margin={'dense'} label="Service Area"
                                dataObj={this._convertData(cities)}
                                extract={{value: 'id', title: 'name'}}
                                data={cities}>
                            </Field>
                            </div>
                        </div>
                        <div className={'formFlex'}>
                            <div className={'formGroup'}>
                            <Field
                                inputId={'tourcategory'}
                                fullWidth={true}
                                name="category"
                                component={renderOutlinedMultipleSelectField}
                                margin={'dense'}
                                label="Tour Category"
                                dataObj={this._convertData(categories)}
                                extract={{value: 'id', title: 'name'}}
                                data={categories}>
                            </Field>
                        </div>
                        </div>
                    <button ref={ref => {this._submitBtn = ref;}} type={'submit'} style={{ visibility: 'hidden' }}></button>
                </form>
            </div>
        )
    }
}


const ReduxForm = reduxForm({
    form: 'tour_type',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Required Parameters'});
    }
})(TourType);

export default connect(null, null,null,{forwardRef:true})(ReduxForm);
