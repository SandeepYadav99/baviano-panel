/**
 * Created by charnjeetelectrovese@gmail.com on 1/21/2020.
 */
/**
 * Created by charnjeetelectrovese@gmail.com on 12/31/2019.
 */

import React from 'react';
import {TextField, IconButton} from '@material-ui/core';
import {AddCircle as AddIcon, RemoveCircleOutline as RemoveIcon} from '@material-ui/icons';
import styles from './index.module.css';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import classnames from "classnames";
import Constants from "../../config/constants";

class GooglePlaceSignup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loaded: false,
            isGeocoding: false,

        };
        this._handleSelect = this._handleSelect.bind(this);
        this._handleError = this._handleError.bind(this);
        this._handleCloseClick = this._handleCloseClick.bind(this);
        this._handleFocus = this._handleFocus.bind(this);
        this.initRoute = this.initRoute.bind(this);
        this._handleAddress = this._handleAddress.bind(this);
    }


    async handleSubmit(data) {

    }



    componentDidMount() {
        loadScript("https://maps.googleapis.com/maps/api/js?key=" + Constants.GOOGLE_MAP_KEY + "&libraries=places&callback=initRoute");
        window.initRoute = this.initRoute;
    }

    initRoute() {
        this.setState({
            is_loaded: true,
        });
    }

    _handleCloseClick() {

    }

    _handleFocus() {

    }


    _extractMapData(searchFor, data) {
        let temp = null;
        data.forEach((result) => {
            if (temp == null) {
                searchFor.forEach((text) => {
                    if (temp == null) {
                        result.address_components.some((val) => {
                            val.types.forEach((type) => {
                                if (type.match(new RegExp(text, 'i'))) {
                                    temp = val.long_name;
                                    return true
                                }
                            });
                            if (temp != null) {
                                return true;
                            }
                        });
                    } else {
                        return true;
                    }
                });
            } else {
                return true;
            }
        });
        return temp;
    }

    _handleAddress(data) {
        console.log(data);
        const tempCity = this._extractMapData(['locality', 'administrative_area_level_2'], data);
        const tempCountry = this._extractMapData(['country'], data);

        this.props.getCityCountry(tempCity, tempCountry)
    }

    _handleSelect = selected => {
        console.log('Route Item', selected);
        const prop = this;
        this.setState({isGeocoding: true});
        geocodeByAddress(selected)
            .then(res => {
                console.log('handleSelect', res);
                prop._handleAddress(res);
                return getLatLng(res[0]);
            })
            .then(({lat, lng}) => {
                this.setState({
                    isGeocoding: false,
                });
                this.props.changeData(selected, lat, lng);
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
        // const {index} = this.props;
        this.props.changeData(name, null, null);
        this.props.getCityCountry(null, null)
    };



    render() {
        const searchOptions = {
            types: ['(cities)']
        }
        const {name, lat, lng } = this.props.data;
        if (this.state.is_loaded) {
            return (
                <div>
                    <div className={styles.flexContainer} style={{}}>

                        <div className={styles.flex}>
                            <PlacesAutocomplete
                                onChange={this.handleChange}
                                value={name}
                                onSelect={this._handleSelect}
                                onError={this.handleError}
                                shouldFetchSuggestions={name.length > 2}
                                searchOptions={searchOptions}
                            >
                                {({getInputProps, suggestions, getSuggestionItemProps}) => {
                                    return (
                                        <div className={styles.Demo__search_bar_container}>
                                            <div className={styles.Demo__search_input_container}>
                                                <TextField
                                                    inputProps={{autoComplete:`off_${Math.random()}`,
                                                        autoCorrect: `off_${Math.random()}`,
                                                        spellCheck: `off_${Math.random()}`}}
                                                    fullWidth
                                                    variant={'outlined'}
                                                    margin={'dense'}
                                                    label={'City'}
                                                    {...getInputProps({
                                                    onFocus: this._handleFocus
                                                })} />
                                                {/*<input*/}
                                                {/*    */}
                                                {/*/>*/}
                                                {/*{name.length > 0 && (*/}
                                                {/*    <button*/}
                                                {/*        type={'button'}*/}
                                                {/*        className={styles.Demo__clear_button}*/}
                                                {/*        onClick={this._handleCloseClick}*/}
                                                {/*    >*/}
                                                {/*        x*/}
                                                {/*    </button>*/}
                                                {/*)}*/}
                                            </div>
                                            {suggestions.length > 0 && (
                                                <div className={styles.Demo__autocomplete_container}>
                                                    {suggestions.map(suggestion => {
                                                        const className = classnames(styles.Demo__suggestion_item, {
                                                            [styles.Demo__suggestion_item__active]: suggestion.active,
                                                        });

                                                        return (
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
                                                    })}
                                                    <div className={styles.Demo__dropdown_footer}>
                                                        <div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                            </PlacesAutocomplete>
                        </div>
                    </div>

                </div>
            );
        } return null;
    };
};

function loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0];
    console.log(index);
    var script = window.document.createElement("script");
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}


export default (GooglePlaceSignup)
