/**
 * Created by charnjeetelectrovese@gmail.com on 12/31/2019.
 */
import React, {Component} from 'react';
import RouteItem from './RouteItem.component';
import styles from './Index.module.css';
import Constants from "../../config/constants";


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


class RoutesList extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.objRef = {name: '', lat: null, lng: null, waiting: 1, color: 'FF0000', show_control: true};
        this.markers = [];
        this.state = {
            data: [JSON.parse(JSON.stringify(this.objRef))],
            map_loaded: false,
            distance: 0,
            duration: 0,
        };
        this.directionsDisplay = null;
        this.directionsService = null;
        this.routeLocations = [];
        this.line = null;
        this.int = null;
        this._handleClick = this._handleClick.bind(this);
        this._changeData = this._changeData.bind(this);
        this.initRoute = this.initRoute.bind(this);
        this._updateDataState = this._updateDataState.bind(this);
        this._renderMarkers = this._renderMarkers.bind(this);
        this._callCenter = this._callCenter.bind(this);
        this._smoothZoom = this._smoothZoom.bind(this);
        this._calcRoute = this._calcRoute.bind(this);
        this._createPolyline = this._createPolyline.bind(this);
        this._geoCodePosition = this._geoCodePosition.bind(this);
        this._initializeData = this._initializeData.bind(this);
        this.updateRouteType = this.updateRouteType.bind(this);
    }

    componentDidMount() {
        loadScript("https://maps.googleapis.com/maps/api/js?key=" + Constants.GOOGLE_MAP_KEY + "&libraries=places&callback=initRoute");
        window.initRoute = this.initRoute;
        this._initializeData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.state);
        if (JSON.stringify(prevProps.data) != JSON.stringify(this.props.data)) {
            this._initializeData();
        }

        if (this.props.routeType != prevProps.routeType) {
            this.updateRouteType();
        }
    }

    _initializeData () {
        const {data} = this.props;
        console.log('RoutesDID',data);
        if (data) {
            if (data.routes.length > 0) {
                this.setState({
                    data: data.routes.map((val) => {
                        return {...val, color: getRandomColor()}
                    }),
                    distance: data.distance,
                    duration: data.duration,
                }, () => {
                });
            } else {
                this.setState({
                    data: [JSON.parse(JSON.stringify(this.objRef))],
                    distance: 0,
                    duration: 0
                })
            }
        }
    }

    getState() {
        const { data, distance, duration } = this.state;
        const tempRoutes = data.filter((val) => {
            if (val.lat && val.lng) {
                return true;
            }
        });
        return { routes: tempRoutes, distance, duration };
    }

    updateRouteType() {
        const { data, distance, duration } = this.state;
        const { routeType } = this.props;
        if (routeType == 'SINGLE_LOCATION') {
            const tempData = data;
            tempData.splice(1, tempData.length);
            this.setState({
                routes: tempData,
                distance: 0,
                duration: 0
            });
        }
        // else if (routeType == 'ROUND_TRIP') {
        //     const tempData = data;
        //     const firstObj = data[0];
        //     firstObj.show_control = false;
        //     firstObj.
        //     tempData.push();
        //     this.setState({
        //         routes: tempData,
        //     });
        // }
    }
    initRoute() {
        if (!this.state.map_loaded) {
            this.setState({
                map_loaded: true
            });
            const google = window.google;
            // Create A Map
            this.map = new window.google.maps.Map(document.getElementById('map'), {
                center: {lat: 30.6942, lng: 76.8606},
                zoom: 12,
                mapTypeControl: false,
                scaleControl: false,
                zoomControl: false,
                streetViewControl: false,
                disableDefaultUI: true
                // styles: tempGoogleMapStyles
            });
            this.directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
            this.directionsService = new google.maps.DirectionsService();
            const prop = this;
            this.directionsDisplay.addListener('directions_changed', function () {
                prop._createPolyline(prop.directionsDisplay.getDirections());
            });
            // this.marker = new window.google.maps.Marker({
            //     position: {lat: 30.6942, lng: 76.8606},
            //     map: this.map,
            //     title: 'Location',
            //     draggable: false
            // });
            // const prop = this;
            // this.marker.addListener('dragend', function (evt) {
            //     prop.geoCodePosition(prop.marker.getPosition(), evt.latLng.lat(), evt.latLng.lng());
            // });

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
            if (this.state.data.length > 0) {
                this._calcRoute();
                this._renderMarkers();
            }
        }
    }

    _calcRoute() {
        const google = window.google;
        const locations = []
        let tempStartLoc = null;
        let tempEndLoc = null;
        const tempFilteredData = this.state.data.filter((val) => {
            if (val.lat && val.lng) {
                return true;
            }
        })
        tempFilteredData.forEach((val, index) => {
            if (index == 0) {
                tempStartLoc = `${val.lat},${val.lng}`;
            } else if (index + 1 == tempFilteredData.length) {
                tempEndLoc = `${val.lat},${val.lng}`;
            } else {
                const tempLoc = new window.google.maps.LatLng(val.lat, val.lng);
                locations.push({
                    location: tempLoc,
                    stopover: true
                });
            }
        });
        if (tempEndLoc && tempStartLoc) {
            // const waypoints = document.querySelectorAll('input[name="waypoint"]')
            // console.log('waypoints', waypoints);
            // waypoints.forEach(function (item) {
            //     if (item.value !== '') {
            //         locations.push({
            //             location: item.value,
            //             stopover: true
            //         })
            //     }
            // });

            var request = {
                origin: tempStartLoc,
                destination: tempEndLoc,
                waypoints: locations,
                // optimizeWaypoints: true,
                travelMode: "DRIVING"
            };
            const prop = this;
            this.directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    prop.directionsDisplay.setDirections(response);
                    console.log('its dragged')
                    //document.getElementById('Gresponse').innerHTML = JSON.stringify(response);
                    prop._createPolyline(response);
                }
            });
        }
    };

    _createPolyline(directionResult) {
        console.log(directionResult);

        const google = window.google;
        this.routeLocations = [];
        if (this.line && this.line !== undefined) {
            this.line.setMap(null)
            clearInterval(this.int)
        }
        ;
        this.line = new google.maps.Polyline({
            path: [],
            strokeColor: '#000000',
            strokeOpacity: 1,
            strokeWeight: 4,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    strokeColor: '#393'
                },
                offset: '100%'
            }]
        });
        var legs = directionResult.routes[0].legs;
        console.log(legs);
        let mapDistance = 0;
        let mapDuration = 0;
        legs.forEach((val) => {
            mapDistance += val.distance.value;
            mapDuration += val.duration.value;
        });
        mapDistance = parseFloat(mapDistance / 1000).toFixed(2);
        mapDuration = parseInt(mapDuration / 60);
        this.state.data.forEach((val) => {
            if (val.waiting) {
                mapDuration += parseInt(val.waiting);
            }
        });

        this.setState({
            duration: mapDuration,
            distance: mapDistance
        })
        for (let i = 0; i < legs.length; i++) {
            // console.log(legs[i].start_location.lat());
            var steps = legs[i].steps;
            for (let j = 0; j < steps.length; j++) {
                var nextSegment = steps[j].path;
                for (let k = 0; k < nextSegment.length; k++) {
                    this.line.getPath().push(nextSegment[k]);
                }
            }
        }
        this.line.setMap(this.map);
        var i = 1;
        var length = google.maps.geometry.spherical.computeLength(this.line.getPath());
        var remainingDist = length;

        // while (remainingDist > 0) {
        //     createMarker(this.map, this.line.GetPointAtDistance(100 * i), i + " km");
        //     remainingDist -= 100;
        //     i++;
        // }
// put markers at the ends
//         createMarker(map,line.getPath().getAt(0),length/200+" km");
//         createMarker(map,line.getPath().getAt(line.getPath().getLength()-1),(length/1000).toFixed(2)+" km");
        this.line.setMap(this.map);


        function createMarker(map, latlng, title) {
            // console.log('LATLNG', latlng);
            if (latlng) {
                this.routeLocations.push([latlng.lat(), latlng.lng()]);
            }
            // var marker = new google.maps.Marker({
            //     position:latlng,
            //     map:map,
            //     title: title
            // });
        }
    };

    _smoothZoom(map, max, cnt) {
        const prop = this;
        if (cnt >= max) {
            return;
        } else {
            this.z = window.google.maps.event.addListener(map, 'zoom_changed', function (event) {
                window.google.maps.event.removeListener(prop.z);
                prop._smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function () {
                map.setZoom(cnt)
            }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
        }
    }

    _callCenter(data) {
        console.log('Google map', data);
        if (window.google && this.map) {
            var location = new window.google.maps.LatLng(data[0], data[1]);
            // this.map.setZoom(14);
            this.map.panTo(location);
            this._smoothZoom(this.map, 14, this.map.getZoom());
        }
    }



    _updateDataState(newData) {
        this.setState({
            data: newData
        }, () => {
            this._renderMarkers();
        });
    }

    _handleClick(type, index = 0) {
        const oldState = this.state.data;
        if (type == 'ADDITION' ) {
            if (this.props.routeType != 'SINGLE_LOCATION') {
                const temp = JSON.parse(JSON.stringify(this.objRef));
                temp.color = getRandomColor();
                oldState.push(temp);
            }
        } else {
            oldState.splice(index, 1);
        }
        this._updateDataState(oldState);
    }

    _changeData(index, data) {
        const tempData = this.state.data;
        tempData[index] = {...tempData[index], ...data};
        const temp = tempData[index];
        if (temp.lat && temp.lng) {
            this._callCenter([temp.lat, temp.lng]);
        }
        this._updateDataState(tempData);
    }

    _geoCodePosition(index, pos, lat, lng) {
        const prop = this;
        const google = window.google;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
                latLng: pos
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    const tempData = prop.state.data;
                    tempData[index].name = results[0].formatted_address;
                    tempData[index].lat = lat;
                    tempData[index].lng = lng;
                    prop._updateDataState(tempData);
                }
            }
        );
    }

    _renderMarkers() {
        if (this.map) {
            this.markers.forEach((val) => {
                val.setMap(null);
            });
            this.markers = [];
            const google = window.google;

            if (this.state.data.length >= 2) {
                const startLoc = this.state.data[0];
                const endLoc = this.state.data[1];
                this._calcRoute();
            }
            this.state.data.forEach((val, index) => {
                // var pinColor = "FE7569";
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + val.color,
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(10, 34));
                if (val.lat && val.lng) {
                    const temp = new window.google.maps.Marker({
                        position: {lat: val.lat, lng: val.lng},
                        map: this.map,
                        title: val.name,
                        draggable: true,
                        icon: pinImage
                    });
                    this.markers.push(temp);
                    const prop = this;
                    temp.addListener('dragend', function(evt) {
                        prop._geoCodePosition(index, temp.getPosition(), evt.latLng.lat(), evt.latLng.lng());
                    });
                }
            })
        }
    }

    _renderItems() {
        return this.state.data.map((val, index) => {
            return (<RouteItem changeData={this._changeData} handlePress={this._handleClick} key={index} index={index}
                               data={val}/>)
        });
    }

    render() {
        if (this.state.map_loaded) {
            return (
                <div className={''}>
                    <div style={{flex: 1}}>
                        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <div>
                                <label htmlFor="">Distance </label>
                                {this.state.distance} K.m.
                            </div>
                            <div>
                                <label htmlFor="">Duration </label>
                                {this.state.duration} Min.
                            </div>
                            <div></div>
                        </div>
                        <div style={{height: '5px'}}></div>
                        {this._renderItems()}
                    </div>
                    <div style={{flex: 1}}>

                        <main style={{height: '250px', flex: 1, marginTop: '20px'}}>
                            <div id="map" style={{height: '100%', width: '100%'}}></div>
                        </main>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }
}

function loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0];
    console.log(index);
    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}

export default RoutesList;
