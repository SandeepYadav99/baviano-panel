/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, MenuItem} from '@material-ui/core';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField
} from '../../libs/redux-material.utils';

const validate = (values) => {
    const errors = {};
    const requiredFields = ['type', 'representative_name', 'contact', 'address', 'company_name', 'city', 'country', 'tour_type', 'email'];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    return errors
};


const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        // isUserService({ mail: values.email }).then((data) => {
        //     if(!data.error) {
        //         if(data.data.email_exist) {
        //             resolve({ email: 'Taken' });
        //         }
        //     }
        // })
    });
};

class CreateContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'INDIVIDUAL'
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
    }

    componentDidMount() {
        const { data } = this.props;
        if (data) {
            Object.keys(data).forEach((val) => {
                const temp = data[val];
                this.props.change(val, temp);
            });
        } else {
            this.props.change('type', 'INDIVIDUAL');
        }
    }

    _handleTypeChange(e) {
        this.setState({
            type: e.target.value
        });
    }

    _handleSubmit(data) {
        console.log(data);
    }

    render() {
        const {handleSubmit} = this.props;
        return (
            <div>
                <h2>Create Provider</h2>
                {/*<Snackbar*/}
                {/*    open={this.state.open}*/}
                {/*    message="Data Saved!"*/}
                {/*    autoHideDuration={4000}*/}
                {/*    onRequestClose={this.handleRequestClose}*/}
                {/*/>*/}

                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'concernSelect'}
                                fullWidth={true}
                                name="type"
                                onChange={this._handleTypeChange}
                                component={renderOutlinedSelectField} margin={'dense'} label="Operator Type">
                                <MenuItem value={'INDIVIDUAL'}>Individual</MenuItem>
                                <MenuItem value={'COMPANY'}>Company</MenuItem>
                            </Field>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="company_name"
                                   component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label={this.state.type == 'INDIVIDUAL' ? 'Brand Name' : 'Company Name' }/>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="representative_name" component={renderOutlinedTextField} margin={'dense'}
                                   label="Representative Name"/>
                        </div>

                        <div className={'formGroup'}>
                        <Field
                            inputId={'tour_type'}
                            fullWidth={true}
                            name="tour_type"
                            component={renderOutlinedMultipleSelectField} margin={'dense'} label="Tour Types">
                            <MenuItem value={'LAND'}>LAND</MenuItem>
                            <MenuItem value={'WATER'}>WATER</MenuItem>
                        </Field>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="contact" type={'number'} component={renderOutlinedTextField} margin={'dense'}
                                   label="Phone No"/>
                        </div>
                        <div className={'formGroup'}>
                             <Field fullWidth={true} type={'email'} name="email" component={renderOutlinedTextField} margin={'dense'}
                                   label="Email"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'country'}
                                fullWidth={true}
                                name="country"
                                onChange={this._handleTypeChange}
                                component={renderOutlinedSelectField} margin={'dense'} label="Country">
                                <MenuItem value={'AFRICA'}>AFRICA</MenuItem>
                                <MenuItem value={'GOTHAM'}>GOTHAM</MenuItem>
                            </Field>
                        </div>

                        <div className={'formGroup'}>
                            <Field
                                inputId={'city'}
                                fullWidth={true}
                                name="city"
                                onChange={this._handleTypeChange}
                                component={renderOutlinedSelectField} margin={'dense'} label="City">
                                <MenuItem value={'ATLANTA'}>Atlanta</MenuItem>
                                <MenuItem value={'GOTHAM'}>GOTHAM</MenuItem>
                            </Field>
                        </div>


                    </div>

                    <div style={{textAlign: 'right'}}>
                        <Button variant={'contained'} color={'primary'} type="submit">
                            SAVE
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

}

const ReduxForm = reduxForm({
    form: 'createprovider',  // a unique identifier for this form
    validate,
    // asyncValidate,
    // asyncBlurField: ['email'],
    enableReinitialize: true
})(CreateContainer);

const mapStateToProps = state => {
    //console.log(user_profile);
    return {

    }
};

export default connect(mapStateToProps, null)(ReduxForm);
