/**
 * Created by charnjeetelectrovese@gmail.com on 12/31/2019.
 */

import React from 'react';
import {TextField, IconButton} from '@material-ui/core';
import {AddCircle as AddIcon, RemoveCircleOutline as RemoveIcon} from '@material-ui/icons';
import styles from './Index.module.css';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import classnames from "classnames";
import Constants from "../../config/constants";

class DescriptionChild extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loaded: false,
            isGeocoding: false
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleIsFeatured = this._handleIsFeatured.bind(this);
        this._handleSelect = this._handleSelect.bind(this);
        this._handleError = this._handleError.bind(this);
        this._handleCloseClick = this._handleCloseClick.bind(this);
        this._handleFocus = this._handleFocus.bind(this);
    }


    async handleSubmit(data) {

    }

    componentWillMount() {

    }

    _handleChange(e) {
        const temp = this.props.index;
        this.props.changeData(temp, {[e.target.name]: e.target.value});
    }

    _handleIsFeatured(e) {
        // console.log()
        this.props.changeData(this.props.index, {[e.target.name]: !this.props.data.is_featured});
    }

    _handleSelect = selected => {
        console.log('Route Item', selected);
        this.setState({isGeocoding: true});
        geocodeByAddress(selected)
            .then(res => getLatLng(res[0]))
            .then(({lat, lng}) => {
                this.setState({
                    isGeocoding: false,
                });
                this.props.changeData(this.props.index, {lat, lng, name: selected})
                if (this.map) {
                    if (this.marker) {
                        var newLatLng = new window.google.maps.LatLng(parseFloat(lat), parseFloat(lng));
                        this.marker.setPosition(newLatLng)
                    } else {

                    }
                    this.callCenter([lat, lng]);
                }
            })
            .catch(error => {
                this.setState({isGeocoding: false});
                console.log('error', error); // eslint-disable-line no-console
            });
    };

    _handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({errorMessage: status}, () => {
            clearSuggestions();
        });
    };

    handleChange = name => {
        const {index} = this.props;
        this.props.changeData(index, {'name': name, lat: null, lng: null});
    };

    _handleCloseClick() {
        this.props.changeData(this.props.index, {name: '', lat: null, lng: null,})
    }

    _handleFocus() {
        this.props.changeData(this.props.index, {});
    }

    render() {
        const {name, lat, lng, color, waiting} = this.props.data;
        return (
            <div>
                <div className={styles.flexContainer} style={{borderLeft: '3px solid', borderLeftColor: `#${color}`}}>

                    <div className={styles.flex}>
                        <PlacesAutocomplete
                            onChange={this.handleChange}
                            value={name}
                            onSelect={this._handleSelect}
                            onError={this.handleError}
                            shouldFetchSuggestions={name.length > 2}
                        >
                            {({getInputProps, suggestions, getSuggestionItemProps}) => {
                                return (
                                    <div className={styles.Demo__search_bar_container}>
                                        <div className={styles.Demo__search_input_container}>
                                            <input
                                                {...getInputProps({
                                                    placeholder: 'Search Places...',
                                                    className: `${styles.Demo__search_input}`,
                                                    onFocus: this._handleFocus
                                                })}
                                            />
                                            {name.length > 0 && (
                                                <button
                                                    type={'button'}
                                                    className={styles.Demo__clear_button}
                                                    onClick={this._handleCloseClick}
                                                >
                                                    x
                                                </button>
                                            )}
                                        </div>
                                        {suggestions.length > 0 && (
                                            <div className={styles.Demo__autocomplete_container}>
                                                {suggestions.map(suggestion => {
                                                    const className = classnames(styles.Demo__suggestion_item, {
                                                        [styles.Demo__suggestion_item__active]: suggestion.active,
                                                    });

                                                    return (
                                                        /* eslint_disable react/jsx_key */
                                                        <div
                                                            {...getSuggestionItemProps(suggestion, {className})}
                                                        >
                                                            <strong>
                                                                {suggestion.formattedSuggestion.mainText}
                                                            </strong>{' '}
                                                            <small>
                                                                {suggestion.formattedSuggestion.secondaryText}
                                                            </small>
                                                        </div>
                                                    );
                                                    /* eslint_enable react/jsx_key */
                                                })}
                                                <div className={styles.Demo__dropdown_footer}>
                                                    <div>
                                                        {/*<img*/}
                                                        {/*    src={require('../images/powered_by_google_default.png')}*/}
                                                        {/*    className={styles.Demo__dropdown_footer-image"*/}
                                                        {/*/>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        </PlacesAutocomplete>
                    </div>
                    <div>
                        <input min={0}
                               onChange={this._handleChange}
                               value={waiting}
                               name={'waiting'}
                               type="number"
                               className={styles.inputWaiting}
                               placeholder={'Waiting Minutes'}
                               title={'Waiting Minutes'}
                        />
                    </div>
                    <div className={styles.textCenter}>
                        <IconButton
                            label={this.props.index == 0 ? "+" : '-'}
                            onClick={() => {
                                this.props.handlePress(this.props.index == 0 ? "ADDITION" : 'DELETE', this.props.index);
                            }}
                        >
                            {this.props.index == 0 ? (<AddIcon/>) : (<RemoveIcon/>)}
                        </IconButton>
                        {/*<RaisedButton*/}
                        {/*    onClick={() => {*/}
                        {/*        this.props.handlePress(this.props.index == 0 ? "ADDITION" : 'DELETE', this.props.index);*/}
                        {/*    }}*/}
                        {/*    label={this.props.index == 0 ? "+" : '-'}*/}
                        {/*    style={styles.saveButton}*/}
                        {/*    secondary={true}/>*/}
                    </div>
                </div>

            </div>
        );
    };
};


export default (DescriptionChild)
