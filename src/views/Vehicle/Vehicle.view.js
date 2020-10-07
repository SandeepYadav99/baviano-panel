import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import QRCode from 'qrcode.react';
import styles from './Vehicle.module.css'
import PageBox from '../../components/PageBox/PageBox.component';
import {MenuItem, Button} from '@material-ui/core';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField,
    renderFileField,
    renderNewSelectField
} from '../../libs/redux-material.utils';
import File from '../../components/FileComponent/FileComponent.component'
import {serviceCreateDriver, serviceDriverCheck} from "../../services/Category.service";
import {serviceCheckVehicle, serviceCreateVehicle} from "../../services/Vehicle.service";

import EventEmitter from "../../libs/Events.utils";

let requiredFields = [];

const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (requiredFields.indexOf('vehicle_plate') > -1 && !values.vehicle_front && !values.vehicle_rear && !values.vehicle_side) {
        errors.vehicle_side = 'Required';
        errors.vehicle_front = 'Required';
        errors.vehicle_rear = 'Required';
    }
    return errors
};

let lastValue = '';
let isExists = false;

const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.vehicle_number) {
            const value = values.vehicle_number;
            if (lastValue == value && isExists) {
                reject({vehicle_number: 'Vehicle Number Already Registered'});
            } else {
                const data = props.data;
                serviceCheckVehicle({vehicle_number: value, id: data ? data.id : null }).then((data) => {
                    console.log(data);
                    lastValue = value;
                    if (!data.error) {
                        if (data.data.exists) {
                            reject({vehicle_number: 'Vehicle Number Already Registered'});
                        }
                    }
                    resolve({});
                })
            }
        } else {
            resolve({});
        }
    });
};


class Vehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicle_registration: null,
        }
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleTourType = this._handleTourType.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['tour_type', 'type_category', 'capacity', 'vehicle_number', 'price'];
            Object.keys(data).forEach((val) => {
                if (val == 'tour_type') {
                    this.setState({
                        tour_type: data.tour_type,
                    }, () => {
                        this.props.change('type_category', data.type_category);
                    });
                }
                if (['documents', 'rear', 'plate', 'front', 'side', 'status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
        } else {
            requiredFields = ['tour_type', 'type_category', 'capacity', 'vehicle_number', 'price', 'vehicle_docs', 'vehicle_plate'];
        }
    }

    _handleSubmit(tData) {
        console.log(tData);
        const fd = new FormData();
        Object.keys(tData).forEach((key) => {
            fd.append(key, tData[key]);
        });

        if ('vehicle_docs' in tData && tData.vehicle_docs.length > 0) {
            tData.vehicle_docs.forEach((val) => {
                fd.append('vehicle_docs', val);
            })
        }

        const {data} = this.props;
        if (data) {
            this.props.handleDataSave(fd, 'UPDATE')
        } else {
            this.props.handleDataSave(fd, 'CREATE')
        }
    }

    _handleFileChange(file) {
        this.setState({
            vehicle_registration: file
        })
    }

    _renderTourTypes() {
        const {tour_types} = this.props;
        return tour_types.map((val) => {
            return (<MenuItem value={val.id}>{val.name}</MenuItem>);
        });
    }

    _renderTypeCategories() {
        const {tour_categories} = this.props;
        const temp = [];
        tour_categories.forEach((val) => {
            if (val.tour_type == this.state.tour_type) {
                temp.push(<MenuItem value={val.id}>{val.name}</MenuItem>);
            }
        });
        return temp;
    }


    _handleTourType(e) {
        this.setState({
            tour_type: e.target.value
        });
        this.props.change('type_category', null);
    }

    _renderImages() {
        const {data} = this.props;
        if (data) {
            return data.documents.map((val) => {
                const tempArr = val.split('.');
                const extension = (tempArr[tempArr.length - 1]).toLowerCase();
                if ((['jpeg', 'jpg', 'png']).indexOf(extension) >= 0) {
                    return (<a target={'_blank'} href={val}><img style={{width: '70px', height: '70px', marginLeft: '10px'}} src={val}
                                                                 alt=""/></a>)
                } else {
                    return (<a target={'_blank'} href={val}><img style={{width: '70px', height: '70px', marginLeft: '10px'}} src={require('../../assets/img/reactlogo.png')}
                                                                 alt=""/></a>)
                }
            });
        } return null;
    }

    render() {
        const {handleSubmit, data} = this.props;
        return (
            <div>
                <h3>Vehicle's Detail</h3>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'tour'}
                                fullWidth={true}
                                name="tour_type"
                                onChange={this._handleTourType}
                                component={renderOutlinedSelectField}
                                margin={'dense'} label="Tour Type">
                                {this._renderTourTypes()}
                            </Field>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="type_category" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Type Category">
                                {this._renderTypeCategories()}
                            </Field>
                        </div>
                    </div>


                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="capacity"
                                component={renderOutlinedTextField}
                                type={'number'}
                                margin={'dense'}
                                label="Capacity"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                fullWidth={true}
                                name="vehicle_number"
                                component={renderOutlinedTextField}
                                margin={'dense'}
                                label="Vehicle No"
                            />
                        </div>
                    </div>
                    <div className={'formFlex'} style={{alignItems: 'center'}}>

                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="price" component={renderOutlinedTextField} type={'number'}
                                   margin={'dense'}
                                   label="Default Price"/>
                        </div>
                        <div className={'formGroup'}>
                            {data && ( <>
                                <div>
                                    <QRCode
                                        value={data.id}
                                        size={75}
                                        bgColor={"#ffffff"}
                                        // fgColor={"#000000"}
                                        level={"L"}
                                        includeMargin={false}
                                        renderAs={"svg"}
                                        // imageSettings={{
                                        //     src: require('../../assets/img/logos/logo.png'),
                                        //     x: null,
                                        //     y: null,
                                        //     height: 18,
                                        //     width: 22,
                                        //     excavate: true,
                                        // }}
                                    />
                                </div>
                            </>)}
                        </div>
                    </div>

                    <div style={{marginLeft: '15px', marginTop: '20px'}}>
                        <div className={styles.vehicleHeading}>Vehicle Description</div>
                        <hr className={styles.bottomLine}/>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                max_size={1024 * 1024 * 2}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="vehicle_docs"
                                multiple
                                max_count={5}
                                component={renderFileField}
                                accept={'image/*, application/pdf'}
                                label="Vehicle Documents (Multiple)"
                            />
                            <div className={styles.documentsContainer}>
                            {this._renderImages()}
                            </div>
                        </div>

                    </div>
                    <div style={{marginLeft: '15px', marginTop: '20px'}}>
                        <div className={styles.vehicleHeading}>Vehicle Photographs</div>
                        <hr className={styles.bottomLine}/>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'} style={{ textAlign: 'center' }}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="vehicle_front"
                                component={renderFileField}
                                label="Vehicle Front Photograph"
                                show_image
                                default_image={data ? (data.front ? data.front : null ) : null}
                            />
                        </div>
                        <div className={'formGroup'} style={{ textAlign: 'center' }}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="vehicle_rear"
                                component={renderFileField}
                                label="Vehicle Rear Photograph"
                                show_image
                                default_image={data ? (data.rear ? data.rear : null ) : null}
                            />
                        </div>
                        <div className={'formGroup'} style={{ textAlign: 'center' }}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="vehicle_side"
                                component={renderFileField}
                                label="Vehicle Side Photograph"
                                show_image
                                default_image={data ? (data.side ? data.side : null ) : null}
                            />
                        </div>
                        <div className={'formGroup'} style={{ textAlign: 'center' }}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="vehicle_plate"
                                component={renderFileField}
                                label="Vehicle Plate Photograph"
                                show_image
                                default_image={data ? (data.plate ? data.plate : null ) : null}
                            />
                        </div>
                    </div>
                    <br/>

                    <br/>
                    <br/>
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

const ReduxForm = reduxForm({
    form: 'driver',  // a unique identifier for this form
    validate,
    asyncValidate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        console.log(errors);
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});

    }
})(Vehicle);

export default connect(null, null)(ReduxForm);
