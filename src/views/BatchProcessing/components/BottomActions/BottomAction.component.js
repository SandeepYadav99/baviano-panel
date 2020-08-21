/**
 * Created by charnjeetelectrovese@gmail.com on 6/26/2020.
 */
import React, { Component } from 'react';
import styles from "./Style.module.css";
import {Button, CircularProgress, MenuItem} from "@material-ui/core";
import {Bookmark, BookmarkBorder, Check, AddCircle as AddIcon} from "@material-ui/icons";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {
    renderOutlinedSelectField,
    renderOutlinedTextField,
    renderTimePicker
} from "../../../../libs/redux-material.utils";
import EventEmitter from "../../../../libs/Events.utils";
import {serviceGetFreeDrivers} from "../../../../services/BatchProcessing.service";


const validate = (values) => {
    const requiredFields = ['driver_id','taken_time','temperature'];
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
    return errors
};

class BottomDriverAction extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dialog_open: false,
            drivers: [],
            driverCalling: true,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDialog = this._handleDialog.bind(this);
        this._getDrivers = this._getDrivers.bind(this);
    }
    componentDidMount() {
        this._getDrivers();
    }

    async _getDrivers() {
        const { batch_id } = this.props;
        this.setState({
            driverCalling: true,
        });
        const req = await serviceGetFreeDrivers({ batch_id });
        if (!req.error) {
            const data = req.data;
            this.setState({
                drivers: data,
                driverCalling: false,
            })
        }
    }

    _handleSubmit(tData) {
        const { batch_id } = this.props;
        this.props.handleAssign({...tData, batch_id: batch_id});
    }

    _handleDialog() {
        this.setState({
            dialog_open: !this.state.dialog_open
        })
    }

    _renderForm () {
        const { handleSubmit } = this.props;
        const { drivers, driverCalling } = this.state;
        if (!driverCalling) {
            return (<form onSubmit={handleSubmit(this._handleSubmit)}>
                <div className={styles.formFlex}>
                    <div className={styles.fieldCont}>
                        <Field
                            inputId={'type'}
                            fullWidth={true}
                            name="driver_id"
                            component={renderOutlinedSelectField}
                            margin={'dense'}
                            label={'Driver'}
                        >
                            {drivers.map((val) => {
                                return (
                                    <MenuItem value={val._id}>{val.name}</MenuItem>
                                )})
                            }
                        </Field>
                    </div>

                    <div className={styles.fieldContainer}>
                        <Field fullWidth={true}
                               name="temperature"
                               component={renderOutlinedTextField}
                               margin={'dense'}
                               type={'number'}
                               label="Temperature"
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <Field fullWidth={true}
                               name="taken_time"
                               component={renderTimePicker}
                               margin={'dense'}
                               label="Taken Time"
                               // ampm={false}
                               // is_utc={true}
                               minDate={new Date()}
                        />
                    </div>

                    <div className={styles.buttonCont}>
                        <Button
                            type={'submit'}
                            startIcon={<Check/>}
                        >Assign</Button>
                    </div>
                </div>
            </form>)
        } else {
            return (<div><CircularProgress/></div>)
        }
    }

    render () {
        const { dialog_open, drivers } = this.state;
        const { selected,  } = this.props;
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className={styles.bottomSide}>
                    <label htmlFor="">
                        {selected} Selected
                    </label>
                </div>
                <div className={styles.bottomCenter}>
                    {this._renderForm()}
                </div>
            </div>
        )
    }

}

const ReduxForm = reduxForm({
    form: 'driver_assigning',  // a unique identifier for this form
    validate,
    onSubmitFail: errors => {
        console.log(errors);
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(BottomDriverAction);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
function mapStateToProps(state) {
    return {
        batches: state.batch.present,
    }
}
export default connect(mapStateToProps, null)(ReduxForm);
