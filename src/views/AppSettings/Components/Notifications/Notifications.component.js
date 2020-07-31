
import React, {Component} from 'react';
import {Button, MenuItem, withStyles, FormControlLabel, Switch,IconButton} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderOutlinedSelectField,
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
import {serviceSendNotification} from "../../../../services/Notification.service";

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

class NotificationComponent extends Component {
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
            requiredFields = ['title', 'message', 'action_code'];
            Object.keys(data).forEach((val) => {
                if (['status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
        } else {
            requiredFields = ['title', 'message', 'action_code'];
        }
    }

    _handleSubmit(tData) {
        serviceSendNotification({...tData});
        this.props.reset();
    }

    render() {
        const {handleSubmit, data} = this.props;
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h2>Notifications</h2>
                </div>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="title" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label="Title"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="message" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   label="Message"/>
                        </div>
                    </div>

                    <div className="formFlex">
                        <div className="formGroup">
                            <Field
                                inputId={'action_code'}
                                fullWidth={true}
                                name="action_code"
                                component={renderOutlinedSelectField}
                                margin={'dense'}
                                label={'Slot'}
                            >
                                <MenuItem value={'GENERAL'}>GENERAL</MenuItem>
                            </Field>
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
    form: 'notification',  // a unique identifier for this form
    validate,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(NotificationComponent));



export default connect(null, null)(ReduxForm);
