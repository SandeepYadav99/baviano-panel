import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import PageBox from '../../components/PageBox/PageBox.component';
import {MenuItem, Button, FormControlLabel, Switch, ButtonBase} from '@material-ui/core';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderOutlinedMultipleSelectField,
    renderFileField,
    renderNewSelectField,
    renderOutlinedTextFieldWithLimit,
    renderTimePicker
} from '../../libs/redux-material.utils';
import File from '../../components/FileComponent/FileComponent.component'
import RoutesList from '../../components/RouteComponent/Routes.component';
import EventEmitter from "../../libs/Events.utils";
import styles from './Tour.module.css';
import {serviceDeleteTourImage} from "../../services/Tour.service";
import { Clear as DeleteIcon, Bookmark as BookmarkFilled, BookmarkBorder as BookmarkEmpty } from '@material-ui/icons';

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    console.log('validate', requiredFields);
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    return errors
};

const normalizeTwoFifty = (value, prevValue) => {
    if (value.length > 250) {
        return prevValue
    } else {
        return value;
    }
};

const normalizeFiveHun = (value, prevValue) => {
    if (value.length > 500) {
        return prevValue
    } else {
        return value;
    }
};

const tourNormalize = (value, prevValue) => {
    if (value.length > 50) {
        return prevValue
    } else {
        return value;
    }
}

const toursNormalize = (value, prevValue) => {
    if (value.length > 100) {
        return prevValue
    } else {
        return value;
    }
}


class Tour extends Component {
    constructor(props) {
        super(props);
        this.routes = null;
        this.state = {
            vehicle_plate: null,
            is_active: false,
            tour_type: null,
            selectedLatLng: [],
            route_data: {routes: [], distance: 0, duration: 0},
            thumbnail_index: 0,
            remote_images: [],
            deleted_images: [],
            is_delete_calling: false,
        };
        // const {data} = props;
        // if (data) {
        //     this.edit_data = {routes: data.routes, distance: data.distance, duration: data.duration};
        // } else {
        //     this.edit_data = {routes: [], distance: 0, duration: 0};
        // }
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._updateLatLng = this._updateLatLng.bind(this);
        this._handleActive = this._handleActive.bind(this);
        this._handleTourType = this._handleTourType.bind(this);
        this._initializeData = this._initializeData.bind(this);
        this._handleServiceAreaChange = this._handleServiceAreaChange.bind(this);
        this._handleDeleteImage = this._handleDeleteImage.bind(this);
        this._handleThumbnail = this._handleThumbnail.bind(this);
    }


    componentDidMount() {
        console.log('tourview', this.props.data);
        this._initializeData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(prevProps.data) != JSON.stringify(this.props.data)) {
            this._initializeData();
        }
    }

    _convertMinutesToTime(min) {
        const hours = (min / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);

        const temp = new Date();
        temp.setHours(rhours);
        temp.setMinutes(rminutes);

        return temp;
    }
    _initializeData() {
        this.setState({
            is_refreshing: true,
        });
        const {data} = this.props;
        if (data) {
            requiredFields = ['tour_type', 'category', 'type_category', 'city_id', 'name', 'overview', 'description',
                'instructions', 'price', 'price_type', 'vehicle_id', 'driver_id', 'preparation_time', 'route_type'];
            Object.keys(data).forEach((val) => {
                if (['images', 'start_time', 'end_time'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);

                    if (val == 'tour_type_id') {
                        this.setState({
                            tour_type: data.tour_type_id,
                        }, () => {
                            this.props.change('tour_type', data.tour_type_id);
                            this.setState({
                                ad: Math.random()
                            })
                            setTimeout(() => {
                                this.props.change('type_category', data.type_category);
                                this.props.change('category', data.category);
                                this.props.change('vehicle_id', data.vehicle_id);
                                this.props.change('driver_id', data.driver_id);
                                this.setState({
                                    ad: Math.random()
                                });
                            }, 500);

                        });
                    }

                }
            });

            const offset = (new Date()).getTimezoneOffset();
            const startMinutes = data.start_time - offset;
            const endMinutes = data.end_time - offset;

            const startTime = this._convertMinutesToTime(startMinutes);
            const endTime = this._convertMinutesToTime(endMinutes);

            this.props.change('start_time', startTime);
            this.props.change('end_time', endTime);


            this.setState({
                is_active: data.status == 'ACTIVE',
                route_data: {routes: data.routes, distance: data.distance, duration: data.duration},
                remote_images: JSON.parse(JSON.stringify(data.images)),
                thumbnail_index: data.thumbnail_index >= 0 ? data.thumbnail_index : 0,
            });
        } else {
            this.setState({
                route_data: {routes: [], distance: 0, duration: 0}
            })
            this.props.reset();
            this.props.change('route_type', 'NORMAL');
            requiredFields = ['tour_type', 'category', 'type_category', 'city_id', 'name', 'images', 'overview',
                'description', 'instructions', 'price', 'price_type', 'vehicle_id', 'driver_id', 'preparation_time',
                'route_type'];
        }
    }

    _handleActive() {
        this.setState({
            is_active: !this.state.is_active,
        });
    }

    _handleSubmit(tData) {
        console.log('_handleSubmit', tData);
        const {form_values} = this.props;
        if (this.routes) {
            const tempData = this.routes.getState();
            const routes = tempData.routes;
            const routeType = form_values ? form_values.route_type : 'NORMAL';
            if (routes.length >= 2 || (routeType == 'SINGLE_LOCATION' && routeType.length >= 1)) {
                const fd = new FormData();
                Object.keys(tData).forEach((key) => {
                    if (['images', 'start_loc', 'end_loc', 'routes', 'distance', 'duration', 'status', 'start_time', 'end_time', 'thumbnail_index'].indexOf(key) == -1) {
                        fd.append(key, tData[key]);
                    }
                });
                if ('images' in tData) {
                    tData.images.forEach((val) => {
                        fd.append('images', val);
                    })
                }
                fd.append('routes', JSON.stringify(routes));
                fd.append('start_loc', JSON.stringify(routes[0]));
                fd.append('end_loc', JSON.stringify(routes[routes.length - 1]));
                fd.append('distance', tempData.distance);
                fd.append('duration', tempData.duration);
                fd.append('status', (this.state.is_active ? 'ACTIVE' : 'INACTIVE'));
                fd.append('thumbnail_index', this.state.thumbnail_index);

                if (tData.start_time) {
                    const startMinutes = (tData.start_time.getUTCHours() * 60) + tData.start_time.getUTCMinutes();
                    fd.append('start_time', startMinutes);
                } else {
                    const tempDate = new Date();
                    const startMinutes = (tempDate.getUTCHours() * 60) + tempDate.getUTCMinutes();
                    fd.append('start_time', startMinutes);
                }
                if (tData.end_time) {
                    const endMinutes = (tData.end_time.getUTCHours() * 60) + tData.end_time.getUTCMinutes();
                    fd.append('end_time', endMinutes);
                } else {
                    const tempDate = new Date();
                    const endMinutes = (tempDate.getUTCHours() * 60) + tempDate.getUTCMinutes();
                    fd.append('end_time', endMinutes);
                }



                const {data} = this.props;
                if (data) {
                    // fd.append('id', data.id);
                    this.props.handleDataSave(fd, 'UPDATE')
                } else {
                    this.props.handleDataSave(fd, 'CREATE')
                }
            } else {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                    error: 'Please enter more than 2 routes',
                    type: 'error'
                });
            }
        }
    }

    _handleFileChange(file) {
        this.setState({
            vehicle_plate: file
        })
    }

    _updateLatLng(latitude, longitude) {
        // // initValues = {...initValues, latitude, longitude };
        // // console.log((this.refs.latitude)._getInputNode());
        // // ReactDom.findDOMNode(this.refs.latitude).getElementsByTagName("input")[0].focus();
        // this.props.change('latitude', latitude);
        // this.props.change('longitude', longitude);
        // if (this.latInput) {
        //     console.log((this.latInput));
        // }
    }

    _renderStatus() {
        const {data} = this.props;
        if (data) {
            return (<FormControlLabel
                control={
                    <Switch color={'primary'} checked={this.state.is_active} onChange={this._handleActive.bind(this)}
                            value="is_active"/>
                }
                label="Active ?"
            />);
        } else {
            return null;
        }
    }

    _renderDriversMenu() {
        const {drivers} = this.props;
        return drivers.map((val) => {
            return (<MenuItem value={val.id}>{val.name}</MenuItem>);
        })
    }

    _renderVehicleMenu() {
        const {vehicles} = this.props;
        const temp = [];
        vehicles.forEach((val) => {
            if (val.tour_type == this.state.tour_type) {
                temp.push(<MenuItem value={val.id}>{val.name}</MenuItem>);
            }
        });
        return temp;
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

    _renderCategories() {
        const {categories} = this.props;
        return categories.map((val) => {
            return (<MenuItem value={val.id}>{val.name}</MenuItem>);
        });
    }


    _handleTourType(e) {
        this.setState({
            tour_type: e.target.value
        })
    }

    _renderServiceArea() {
        const {service_areas} = this.props;
        return service_areas.map((val) => {
            return (<MenuItem data-val={val} value={val.id}>{val.name}</MenuItem>);
        });
    }

    _handleServiceAreaChange(e) {
        const temp = e._targetInst.pendingProps['data-val'];
        this.setState({
            selectedLatLng: [temp.coordinates[1], temp.coordinates[0]],
        });
    }

    _handleDeleteImage(type, index, uniIndex) {
        console.log(type, index);
        const {thumbnail_index, remote_images } = this.state;
        const { data } = this.props;
        if (uniIndex <= thumbnail_index) {
            this.setState({
                thumbnail_index: thumbnail_index == 0 ? 0 : thumbnail_index -1,
            });
        }
        if (type == 'LOCAL') {
            const {form_values} = this.props;
            if (form_values && 'images' in form_values) {
                const images = form_values.images;
                images.splice(index, 1);
                this.props.change('images', images);
                this.setState({
                    d: 1
                });
            }
        } else {
            if (!this.state.is_delete_calling) {
                this.setState({
                    is_delete_calling: true,
                });
                serviceDeleteTourImage({id: data.id, index}).then(() => {
                    if (remote_images.length == 0) {
                        requiredFields.push('images');
                    }
                    this.setState({
                        is_delete_calling: false,
                    });
                });
                const images = remote_images;
                images.splice(index, 1);
                this.setState({
                    remote_images: images,
                });
                this.props.handleImageDelete(data.id, index);

            }
        }
    }

    _handleThumbnail(type, index) {
        this.setState({
            thumbnail_index: index
        });
    }


    _renderImages() {
        const { thumbnail_index, remote_images } = this.state;
        const {data, form_values} = this.props;
        const imagesArr = [];
        let tempIndex = 0;
        if (data) {
            remote_images.forEach((val, index) => {
                imagesArr.push(
                    <div className={styles.imgContainer}>
                        <div className={styles.imgLikeBtn}>
                            <ButtonBase onClick={this._handleThumbnail.bind(this, 'REMOTE', tempIndex)}>{thumbnail_index == tempIndex ? (<BookmarkFilled/>) : (<BookmarkEmpty/>)}</ButtonBase>
                        </div>
                        <div className={styles.imgBtn}>
                            <ButtonBase onClick={this._handleDeleteImage.bind(this, 'REMOTE', index, tempIndex)}><DeleteIcon/></ButtonBase>
                        </div>
                        <a href={val} target={'_blank'}><img src={val} key={'tour_images' + index}
                                                             className={styles.img} alt=""/></a>
                    </div>
                    );
                tempIndex++;
            });
        } else {
        }
        if (form_values && 'images' in form_values) {
            form_values.images.forEach((val, index) => {
                imagesArr.push(
                    <div className={styles.imgContainer}>
                        <div className={styles.imgLikeBtn}>
                            <ButtonBase onClick={this._handleThumbnail.bind(this, 'LOCAL', tempIndex)}>{thumbnail_index == tempIndex ? (<BookmarkFilled/>) : (<BookmarkEmpty/>)}</ButtonBase>
                        </div>
                        <div className={styles.imgBtn}>
                            <ButtonBase onClick={this._handleDeleteImage.bind(this, 'LOCAL', index, tempIndex)}><DeleteIcon /></ButtonBase>
                        </div>
                        <img
                            src={URL.createObjectURL(val)}
                            className={styles.img} alt=""/>
                    </div>
                );
                tempIndex++;
            });
        }
        if (imagesArr.length > 0) {
            return (
                <div style={{marginLeft: '15px'}}>
                    <div className={styles.formHeading}>Tour Images</div>
                    <hr className={styles.bottomLine}/>
                    <div className={styles.flexWrap}>
                        {imagesArr}
                    </div>
                    <br/>
                </div>
            )
        }
        return null;
    }

    render() {
        const {handleSubmit, country_currency, form_values} = this.props;
        console.log('tour render', this.props);
        return (
            <div>
                <h3>Tours's Detail</h3>
                <hr/>
                <form onSubmit={handleSubmit(this._handleSubmit)}>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'tour'}
                                fullWidth={true}
                                name="tour_type"
                                onChange={this._handleTourType}
                                component={renderOutlinedSelectField} margin={'dense'} label="Tour Type">
                                {this._renderTourTypes()}
                            </Field>
                        </div>

                        <div className={'formGroup'}>
                            <Field
                                inputId={'type_category'}
                                fullWidth={true}
                                name="type_category"
                                component={renderOutlinedSelectField}
                                margin={'dense'}
                                label="Type Category">
                                {this._renderTypeCategories()}
                            </Field>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="category"
                                   component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Tour Category">
                                {this._renderCategories()}
                            </Field>
                        </div>
                    </div>

                    <div className={'formFlex'} style={{alignItems: 'center'}}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="name" component={renderOutlinedTextField}
                                   margin={'dense'} normalize={tourNormalize}
                                   label="Tour Title"/>
                        </div>
                        <div className={'formGroup'}>
                            <Field
                                max_size={1024 * 1024 * 5}
                                type={['jpg', 'png', 'pdf', 'jpeg']}
                                fullWidth={true}
                                name="images"
                                multiple
                                component={renderFileField}
                                label="Images"
                            />
                        </div>
                    </div>

                    {this._renderImages()}
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>

                            <Field fullWidth={true} name="instructions" component={renderOutlinedTextFieldWithLimit}
                                   multiline
                                   rows="4"
                                   margin={'dense'}
                                   maxLimit={250}
                                   normalize={normalizeTwoFifty}
                                   label="Important Instructions"/>

                        </div>

                        <div className={'formGroup'}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Field fullWidth={true} name="price" component={renderOutlinedTextField} type={'number'}
                                       margin={'dense'}
                                       label="Tour Price"/>
                                <div style={{marginLeft: '10px'}}>
                                    {country_currency}
                                </div>
                            </div>
                            <Field fullWidth={true} name="price_type" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Price Type">
                                <MenuItem value={'PER_PERSON'}>Per Person</MenuItem>
                                <MenuItem value={'FIXED'}>Fixed</MenuItem>
                            </Field>
                        </div>
                    </div>


                    <div className={'formFlex'}>

                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="vehicle_id" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Associated Vehicle">
                                {this._renderVehicleMenu()}
                            </Field>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="driver_id" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Associated Driver">
                                {this._renderDriversMenu()}
                            </Field>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="overview" component={renderOutlinedTextFieldWithLimit}
                                   multiline
                                   rows="3"
                                   margin={'dense'}
                                   maxLimit={250}
                                   normalize={normalizeTwoFifty}
                                   label="Tour Overview"/>
                        </div>

                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="description" component={renderOutlinedTextFieldWithLimit}
                                   multiline
                                   rows="3"
                                   margin={'dense'}
                                   maxLimit={500}
                                   normalize={normalizeFiveHun}
                                   label="Tour Description"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="city_id"
                                   component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="City"
                                   onChange={this._handleServiceAreaChange}
                            >
                                {this._renderServiceArea()}
                            </Field>
                        </div>
                    </div>
                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="start_time"
                                   component={renderTimePicker}
                                   margin={'dense'}
                                   label="Start Time"
                                   ampm={false}
                                   is_utc={true}
                                   minDate={new Date()}
                            />
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="end_time"
                                   component={renderTimePicker}
                                   margin={'dense'}
                                   label="End Time"
                                   ampm={false}
                            />
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="preparation_time" component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Preparation Type">
                                <MenuItem value={5}>5 Min.</MenuItem>
                                <MenuItem value={10}>10 Min.</MenuItem>
                                <MenuItem value={15}>15 Min.</MenuItem>
                                <MenuItem value={30}>30 Min.</MenuItem>
                                <MenuItem value={60}>1 Hr.</MenuItem>
                            </Field>
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}  name="route_type"
                                   component={renderOutlinedSelectField}
                                   margin={'dense'}
                                   label="Route Type">
                                <MenuItem value={'NORMAL'}>Normal</MenuItem>
                                <MenuItem value={'SINGLE_LOCATION'}>Single Location</MenuItem>
                                <MenuItem value={'ROUND_TRIP'}>Round Trip</MenuItem>
                            </Field>
                        </div>
                    </div>


                    <div className={'formFlex'} style={{position: 'relative'}}>
                        <div className={'formGroup'}>
                            <RoutesList
                                ref={(ref) => {
                                    this.routes = ref
                                }}
                                routeType={form_values ? form_values.route_type : 'NORMAL'}
                                data={this.state.route_data}/>
                        </div>
                    </div>


                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            {this._renderStatus()}
                        </div>
                        <div>
                            <Button variant={'contained'} color={'primary'} type={'submit'}>
                                Submit
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}

const ReduxForm = reduxForm({
    form: 'tour_form',  // a unique identifier for this form
    validate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        console.log(errors);
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(Tour);

function mapStateToProps(state) {
    return {
        form_values: state.form.tour_form ? state.form.tour_form.values : null,
        country_currency: state.auth.user_profile.country_currency,
    };
}

export default connect(mapStateToProps, null)(ReduxForm);
