/**
 * Created by charnjeetelectrovese@gmail.com on 7/23/2020.
 */
import React, {Component} from 'react';
import {Button, MenuItem, withStyles, FormControlLabel, Switch,IconButton} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderOutlinedTextField,
} from '../../../../libs/redux-material.utils';
import EventEmitter from "../../../../libs/Events.utils";
import styles from '../../Style.module.css';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
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
    return errors
};

class ReferAmounts extends Component {
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
            requiredFields = ['min_transaction', 'refer_amount', 'max_refer_amount'];
            Object.keys(data).forEach((val) => {
                if (['status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
        } else {
            requiredFields = ['min_transaction', 'refer_amount', 'max_refer_amount'];
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
                    <h2>Min Value & Min Percentage</h2>
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="min_transaction" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   type={'number'}
                                   label="Min Transaction Value"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="refer_amount" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   type={'number'}
                                   label="Refer Amount"/>
                        </div>

                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="max_refer_amount" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   type={'number'}
                                   label="Max Total Refer Amount"/>
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
    form: 'refer_data_form',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(ReferAmounts));

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
