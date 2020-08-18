import React, {Component} from 'react';
import {Button, MenuItem, withStyles, FormControlLabel, Switch, IconButton} from '@material-ui/core';
import {Delete as DeleteIcon} from '@material-ui/icons';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderOutlinedSelectField,
    renderOutlinedTextField,
} from '../../../../libs/redux-material.utils';
import EventEmitter from "../../../../libs/Events.utils";
import styles from '../../Style.module.css';
import {bindActionCreators} from "redux";
import {serviceSendNotification} from "../../../../services/Notification.service";
import {actionFetchBatch} from "../../../../actions/Batch.action";

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        } else if (values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
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
            show_confirm: false,
            toUsers: 'ALL'
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleToUsers = this._handleToUsers.bind(this);
    }

    componentDidMount() {
        this.props.actionFetchBatch();
        const {data} = this.props;
        if (data) {
            requiredFields = ['title', 'message', 'action_code', 'to_users', 'batch_id'];
            Object.keys(data).forEach((val) => {
                if (['status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
        } else {
            requiredFields = ['title', 'message', 'action_code', 'to_users', 'batch_id'];
        }
    }

    _handleSubmit(tData) {
        serviceSendNotification({...tData});
        this.props.reset();
    }

    _handleToUsers(e) {
        const val = e.target.value;
        this.setState({
            toUsers: val
        });
    }

    _renderBatchMenu() {
        const {toUsers} = this.state;
        if (toUsers == 'BATCH') {
            return (
                <div className="formFlex">
                    <div className="formGroup">
                        <Field
                            inputId={'batch_id'}
                            fullWidth={true}
                            name="batch_id"
                            component={renderOutlinedSelectField}
                            margin={'dense'}
                            label={'Batch'}
                        >
                            {this.props.batches.map((val) => {
                                return (<MenuItem value={val.id}>{val.name}</MenuItem>);
                            })};
                        </Field>
                    </div>
                </div>
            )
        }
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
                    <div className="formFlex">
                        <div className="formGroup">
                            <Field
                                inputId={'to_users'}
                                fullWidth={true}
                                name="to_users"
                                component={renderOutlinedSelectField}
                                margin={'dense'}
                                label={'To Users'}
                                onChange={this._handleToUsers}
                            >
                                <MenuItem value={'ALL'}>All</MenuItem>
                                <MenuItem value={'ACTIVE_USERS'}>Active Users</MenuItem>
                                <MenuItem value={'ACTIVE'}>Active Subscriptions</MenuItem>
                                <MenuItem value={'INACTIVE'}>Inactive Subscriptions</MenuItem>
                                <MenuItem value={'BATCH'}>Batch</MenuItem>
                            </Field>
                        </div>
                    </div>
                    {this._renderBatchMenu()}


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

function mapStateToProps(state) {
    return {
        batches: state.batch.present,
    }
};
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchBatch: actionFetchBatch,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
