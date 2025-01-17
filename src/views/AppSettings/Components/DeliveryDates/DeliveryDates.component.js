/**
 * Created by charnjeetelectrovese@gmail.com on 7/23/2020.
 */
import React, {Component} from 'react';
import {Button, MenuItem, withStyles, FormControlLabel, Switch,IconButton} from '@material-ui/core';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderOutlinedTextField,
} from '../../../../libs/redux-material.utils';
import EventEmitter from "../../../../libs/Events.utils";
import styles from '../../Style.module.css';
import {bindActionCreators} from "redux";

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        } else if( values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
            errors[field] = 'Required'
        }
    });
    if (!values['order_after']) {
        errors['order_after'] = 'Required'
    } else if (values['order_after'] == 0) {
        errors['order_after'] = 'Order After cannot be 0'
    }
    return errors
};

class MinValue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_active: true,
            show_confirm: false
        };
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['order_after'];
            Object.keys(data).forEach((val) => {
                if (['status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
        } else {
            requiredFields = ['order_after'];
        }
    }

    _handleSubmit(tData) {
        const {data} = this.props;
        if (data) {
            this.props.handleDataSave({...tData }, 'UPDATE')
        } else {
            this.props.handleDataSave({...tData }, 'CREATE')
        }

    }

    render() {
        const {handleSubmit, data} = this.props;
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h2>Order After Sign-up (In Days)</h2>
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="order_after" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   type={'number'}
                                   label="Order After (Days)"/>
                        </div>
                    </div>


                    <div style={{float: 'right'}}>
                        <Button variant={'contained'} color={'primary'} type={'submit'}>
                            Submit
                        </Button>
                    </div>
                </form>
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
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(MinValue));

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
