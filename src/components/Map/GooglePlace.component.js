/**
 * Created by charnjeetelectrovese@gmail.com on 8/29/2019.
 */
import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import classnames from 'classnames';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import styles from './GoogolePlace.css';
import Constants from '../../config/constants';

class GooglePlaceComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
        };
        this.map = null;
        this.marker = null;
        this._smoothZoom = this._smoothZoom.bind(this);
        this.initMap = this.initMap.bind(this);
        this.geoCodePosition = this.geoCodePosition.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentDidMount() {
        loadScript("https://maps.googleapis.com/maps/api/js?key="+Constants.GOOGLE_MAP_KEY+"&libraries=places&callback=initMap");
        window.initMap = this.initMap
    }
    _smoothZoom (map, max, cnt) {
        const prop = this;
        if (cnt >= max) {
            return;
        }
        else {
            this.z = window.google.maps.event.addListener(map, 'zoom_changed', function(event){
                window.google.maps.event.removeListener(prop.z);
                prop._smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
        }
    }

    callCenter(data) {
        console.log('Google map', data);
        if(window.google && this.map) {
            var location = new window.google.maps.LatLng(data[0], data[1]);
            // this.map.setZoom(14);
            this.map.panTo(location);
            this._smoothZoom(this.map, 14, this.map.getZoom());
        }
    }

    initMap() {
        if (!this.state.map_loaded) {
            this.setState({
                map_loaded: true
            });
            const google = window.google;
            // Create A Map
            this.map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 30.6942, lng: 76.8606 },
                zoom: 12,
                // styles: tempGoogleMapStyles
            });
            this.marker = new window.google.maps.Marker({
                position: {lat: 30.6942, lng: 76.8606},
                map: this.map,
                title: 'Fire Station Position',
                draggable: true
            });
            const prop = this;
            this.marker.addListener('dragend', function(evt) {
                prop.geoCodePosition(prop.marker.getPosition(), evt.latLng.lat(), evt.latLng.lng());
            });

            // var cityCircle = new google.maps.Circle({
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.35,
            //     map: this.map,
            //     center: {lat: 30.6942, lng: 76.8606},
            //     radius: 1000,
            //     draggable: true,
            //     editable: true
            // });
        }
    }
    handleChange = address => {
        this.setState({
            address,
            latitude: null,
            longitude: null,
            errorMessage: '',
        });
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.latitude != prevState.latitude && this.state.longitude != prevState.longitude) {
            this.props.updateLatLng(this.state.latitude, this.state.longitude);
        }
    }

    geoCodePosition(pos, lat, lng) {
        const prop = this;
        const google = window.google;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
                latLng: pos
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    prop.setState({
                        address: results[0].formatted_address,
                        latitude: lat,
                        longitude: lng
                    })
                }
            }
        );
    }
    handleSelect = selected => {
        this.setState({ isGeocoding: true, address: selected });
        geocodeByAddress(selected)
            .then(res => getLatLng(res[0]))
            .then(({ lat, lng }) => {
                this.setState({
                    latitude: lat,
                    longitude: lng,
                    isGeocoding: false,
                });
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
                this.setState({ isGeocoding: false });
                console.log('error', error); // eslint-disable-line no-console
            });
    };

    handleCloseClick = () => {
        this.setState({
            address: '',
            latitude: null,
            longitude: null,
        });
    };

    handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({ errorMessage: status }, () => {
            clearSuggestions();
        });
    };


    render () {
        if (this.state.map_loaded) {
            const {
                address,
                errorMessage,
                latitude,
                longitude,
                isGeocoding,
            } = this.state;

            return (
                <div className={'googlePlaceContainer'}>
                    <PlacesAutocomplete
                        onChange={this.handleChange}
                        value={address}
                        onSelect={this.handleSelect}
                        onError={this.handleError}
                        shouldFetchSuggestions={address.length > 2}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                            return (
                                <div className="Demo__search-bar-container">
                                    <div className="Demo__search-input-container">
                                        <input
                                            {...getInputProps({
                                                placeholder: 'Search Places...',
                                                className: 'Demo__search-input',
                                            })}
                                        />
                                        {this.state.address.length > 0 && (
                                            <button
                                                className="Demo__clear-button"
                                                onClick={this.handleCloseClick}
                                            >
                                                x
                                            </button>
                                        )}
                                    </div>
                                    {suggestions.length > 0 && (
                                        <div className="Demo__autocomplete-container">
                                            {suggestions.map(suggestion => {
                                                const className = classnames('Demo__suggestion-item', {
                                                    'Demo__suggestion-item--active': suggestion.active,
                                                });

                                                return (
                                                    /* eslint-disable react/jsx-key */
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, { className })}
                                                    >
                                                        <strong>
                                                            {suggestion.formattedSuggestion.mainText}
                                                        </strong>{' '}
                                                        <small>
                                                            {suggestion.formattedSuggestion.secondaryText}
                                                        </small>
                                                    </div>
                                                );
                                                /* eslint-enable react/jsx-key */
                                            })}
                                            <div className="Demo__dropdown-footer">
                                                <div>
                                                    {/*<img*/}
                                                    {/*    src={require('../images/powered_by_google_default.png')}*/}
                                                    {/*    className="Demo__dropdown-footer-image"*/}
                                                    {/*/>*/}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    </PlacesAutocomplete>
                    {errorMessage.length > 0 && (
                        <div className="Demo__error-message">{this.state.errorMessage}</div>
                    )}

                    {/*{((latitude && longitude) || isGeocoding) && (*/}
                    {/*    <div>*/}
                    {/*        <h3 className="Demo__geocode-result-header">Geocode result</h3>*/}
                    {/*        {isGeocoding ? (*/}
                    {/*            <div>*/}
                    {/*                <i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" />*/}
                    {/*            </div>*/}
                    {/*        ) : (*/}
                    {/*            <div>*/}
                    {/*                <div className="Demo__geocode-result-item--lat">*/}
                    {/*                    <label>Latitude:</label>*/}
                    {/*                    <span>{latitude}</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="Demo__geocode-result-item--lng">*/}
                    {/*                    <label>Longitude:</label>*/}
                    {/*                    <span>{longitude}</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {/*<br/>*/}
                    <main style={{ height: '250px', flex: 1}}>
                        <div id="map" style={{ height: '100%', width: '100%' }}></div>
                    </main>
                </div>
            );
        } else {
          return (
              <div>
                  <CircularProgress />
              </div>
          )
        }
    }

}

function loadScript(url) {
    var index  = window.document.getElementsByTagName("script")[0];
    console.log(index);
    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}

export default GooglePlaceComponent;
