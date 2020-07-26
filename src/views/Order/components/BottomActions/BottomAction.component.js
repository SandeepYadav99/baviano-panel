/**
 * Created by charnjeetelectrovese@gmail.com on 6/26/2020.
 */
import React, { Component } from 'react';
import styles from "./Style.module.css";
import {Button, MenuItem} from "@material-ui/core";
import {Bookmark, BookmarkBorder, Check, AddCircle as AddIcon} from "@material-ui/icons";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actionFetchBatch} from "../../../../actions/Batch.action";
import {Field, reduxForm} from "redux-form";
import {renderOutlinedSelectField} from "../../../../libs/redux-material.utils";
import EventEmitter from "../../../../libs/Events.utils";
import BatchDialog from './BatchDialog.component';


const validate = (values) => {
    const requiredFields = ['batch_id'];
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

class BottomAction extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dialog_open: false,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDialog = this._handleDialog.bind(this);
    }
    componentDidMount() {
        this.props.actionFetchBatch();
    }
    _handleSubmit(tData) {
        this.props.handleAssign(tData);
    }

    _handleDialog() {
        this.setState({
            dialog_open: !this.state.dialog_open
        })
    }
    render () {
        const { dialog_open } = this.state;
        const { selected, batches, handleSubmit } = this.props;
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className={styles.bottomSide}>
                    <label htmlFor="">
                        {selected} Selected
                    </label>
                </div>
                <div className={styles.bottomCenter}>

                    <form onSubmit={handleSubmit(this._handleSubmit)}>
                        <div className={styles.formFlex}>
                        <div className={styles.fieldCont}>
                        <Field
                            inputId={'type'}
                            fullWidth={true}
                            name="batch_id"
                            component={renderOutlinedSelectField}
                            margin={'dense'}
                            label={'Batches'}
                        >
                            {batches.map((val) => {
                                return (
                                    <MenuItem value={val.id}>{val.name} - {val.delivery_slot.unformatted}</MenuItem>
                                )})
                            }
                        </Field>
                        </div>
                        <div className={styles.buttonCont}>
                            <Button
                                type={'submit'}
                                startIcon={<Check/>}
                            >Assign</Button>
                        </div>
                        </div>
                    </form>
                </div>
                <div className={styles.bottomSide}>
                    <div className={styles.buttonCont}>
                        <Button
                            onClick={this._handleDialog}
                            startIcon={<AddIcon/>}
                        >Add Batch</Button>
                    </div>
                </div>
                <BatchDialog open={dialog_open} handleClose={this._handleDialog}></BatchDialog>
            </div>
        )
    }

}

const ReduxForm = reduxForm({
    form: 'batch_assigning',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        console.log(errors);
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(BottomAction);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchBatch: actionFetchBatch
    }, dispatch);
}
function mapStateToProps(state) {
    return {
        batches: state.batch.present,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
