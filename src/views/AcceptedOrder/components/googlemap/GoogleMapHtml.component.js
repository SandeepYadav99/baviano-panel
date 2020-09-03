/**
 * Created by charnjeetelectrovese@gmail.com on 8/27/2019.
 */
import React, {Component} from 'react'
import axios from 'axios'
import Constants from '../../../../config/constants';
import {getSocketInstance} from "../../../../libs/socket.utils";

const tempGoogleMapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

class GoogleMapHtml extends Component {
    constructor(props) {
        super(props);
        this.state = {
            booking_date: null,
            current_location: null,
            delivery_address: null,
            delivery_loc: null,
            last_timestamp: null,
            order_id: null,
            order_no: null,
            pickup_address: null,
            pickup_loc: null,
            products_count: null,
            status: null,
            user: null,
            is_set: false,
            map_rendered: false,
            rendered: false,
        };
        this.map = null;
        this.caseMarkers = {};
        this.truckMarkers = {};
        this.dataMarkers = [];
        this.z = null;
        this.google = null;
        this.directionsDisplay = null;
        this.directionsService = null;
        this.routeLocations = [];
        this.line = null;
        this.int = null;
        this._socket = getSocketInstance();
        this.driverMarker = null;
        this._smoothZoom = this._smoothZoom.bind(this);
        this._orderData = this._orderData.bind(this);
        this.subscribeToSockets = this.subscribeToSockets.bind(this);
        this.initMap = this.initMap.bind(this);
        this._addMarker = this._addMarker.bind(this);
        this._calcRoute = this._calcRoute.bind(this);
        this._createPolyline = this._createPolyline.bind(this);
        this._orderUpdate = this._orderUpdate.bind(this);
    }

    componentDidMount() {
        const {order_id} = this.props;
        if (this._socket) {
            this._socket.emit('subscribe', order_id);
            this.subscribeToSockets();
        }
        // this.getVenues()
        this.renderMap();
    }

    subscribeToSockets() {
        if (this._socket) {
            const e = Constants.SOCKET_EVENTS;
            this._socket.on(Constants.SOCKET_EVENTS.ORDER_DATA, this._orderData);
            this._socket.on(e.ORDER_ACCEPTED, this._orderUpdate.bind(this, e.ORDER_ACCEPTED));
            this._socket.on(e.ORDER_ASSIGNED, this._orderUpdate.bind(this, e.ORDER_ASSIGNED));
            this._socket.on(e.ORDER_ON_PICKUP_LOCATION, this._orderUpdate.bind(this, e.ORDER_ON_PICKUP_LOCATION));
            this._socket.on(e.ORDER_ON_WAY, this._orderUpdate.bind(this, e.ORDER_ON_WAY));
            this._socket.on(e.ORDER_ON_DROP_LOCATION, this._orderUpdate.bind(this, e.ORDER_ON_DROP_LOCATION));
            this._socket.on(e.ORDER_DELIVERED, this._orderUpdate.bind(this, e.ORDER_DELIVERED));
            this._socket.on(e.ORDER_LOCATION_UPDATE, this._orderUpdate.bind(this, e.ORDER_LOCATION_UPDATE));
        }
    }


    componentWillUnmount() {
        const {is_error, booking_id} = this.state;
        if (!is_error) {
            if (this._socket) {
                // this._socket.emit('unsubscribe', booking_id);
                this._socket.removeListener(Constants.SOCKET_EVENTS.ORDER_DATA, this._orderData);
            }
        }
    }

    _orderUpdate(type, msg) {
        console.log(msg, type);
        if (type == Constants.SOCKET_EVENTS.ORDER_LOCATION_UPDATE) {
            const data = msg.message;
            this._renderTruckMarkers({ lat: data.lat, lng: data.lng })
        } else if (type == Constants.SOCKET_EVENTS.ORDER_ASSIGNED) {

        } else {
            const data = msg.message;
            this.setState({
                status: data.status,
            })
        }
    }

    _orderData(msg) {
        if (msg) {
            const data = msg.message;
            let shouldShowDriver = false;
            const st = Constants.ORDER_STATUS;
            if ([st.ASSIGNED, st.ON_PICKUP_LOCATION, st.OUT_FOR_DELIVERY, st.ON_DROP_LOCATION].indexOf(data.status) >= 0) {
                shouldShowDriver = true;
            }
            this.setState({
                ...data,
                is_set: true,
                show_driver: shouldShowDriver,
            }, () => {
                this._renderStartEndLocation()
            });
        }
    }

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

    callCenter(data) {
        console.log('Google map call center', data);
        if (window.google && this.map) {
            var location = new window.google.maps.LatLng(data[0], data[1]);
            // this.map.setZoom(14);
            this.map.panTo(location);
            this._smoothZoom(this.map, 12, this.map.getZoom());
        }
    }

    bearing(from, to) {
        console.log(from, to)
        // Convert to radians.
        var lat1 = (Math.PI * from[0]) / 180;
        var lon1 = (Math.PI * from[1]) / 180;
        var lat2 = (Math.PI * to[0]) / 180;
        var lon2 = (Math.PI * to[1]) / 180;
        // Compute the angle.
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0.0)
            angle += Math.PI * 2.0;
        if (angle == 0) {
            angle = 1.5;
        }
        return angle;
    }

    move(marker, latlngs, index, wait, newDestination) {
        marker.setPosition(latlngs[index]);
        if (index != latlngs.length - 1) {
            // call the next "frame" of the animation
            const prop = this;
            setTimeout(function () {
                prop.move(marker, latlngs, index + 1, wait, newDestination);
            }, wait);
        } else {
            // assign new route
            // marker.position = marker.destination;
            // marker.destination = newDestination;
        }
    }

    _renderTruckMarkers(location) {
        console.log(this.driverMarker);
        const google = window.google;
        if (!this.driverMarker) {
            const icon = {
                // url: require('../../assets/fire_brigade.svg'),
                // path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z',
                path: "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z",
                // scaledSize: new google.maps.Size(25, 50), // scaled size
                // origin: new google.maps.Point(0, 0), // origin
                // anchor: new google.maps.Point(0, 0), // anchor
                // rotation: 150
                fillColor: '#F00',
                fillOpacity: 2,
                scale: 0.85,
                anchor: new google.maps.Point(11, 11),
                strokeWeight: 0
            };
            // Create A Marker
            const marker = new window.google.maps.Marker({
                position: location,
                map: this.map,
                title: 'truck',
                icon: icon,
                // rotation: google.maps.geometry.spherical.computeHeading(prevPosn, marker.getPosition())
            });
            this.driverMarker = marker;
        } else {
            const tempMarker = this.driverMarker;
            if (tempMarker) {
                const oldPosition = tempMarker.getPosition();
                if (typeof oldPosition != 'undefined') {
                    const frames = [];
                    const fromLat = oldPosition.lat();
                    const fromLng = oldPosition.lng();

                    for (var percent = 0; percent < 1; percent += 0.01) {
                        const curLat = fromLat + percent * (parseFloat(location.lat) - fromLat);
                        const curLng = fromLng + percent * (parseFloat(location.lng) - fromLng);
                        frames.push(new google.maps.LatLng(curLat, curLng));
                    }

                    this.move(tempMarker, frames, 0, 20, tempMarker.getPosition());
                    // tempMarker.setPosition(newLatLng);
                    var icon = tempMarker.getIcon();
                    console.log(icon);
                    icon.rotation = (google.maps.geometry.spherical.computeHeading(
                        new window.google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng)),
                        new window.google.maps.LatLng(parseFloat(oldPosition.lat()), parseFloat(oldPosition.lng()))
                    ) + 180);
                    console.log(icon.rotation);
                    tempMarker.setIcon(icon);
                }
            }
        }
    }

    _calcRoute() {
        const {pickup_loc, delivery_loc, driver_location, status} = this.state;
        const google = window.google;
        const locations = []
        let tempStartLoc = null;
        let tempEndLoc = null;
        const tempFilteredData = [];
        if ([Constants.ORDER_STATUS.ASSIGNED].indexOf(status) >= 0) {
            tempFilteredData.push(driver_location);
            tempFilteredData.push(pickup_loc);
            tempFilteredData.push(delivery_loc);
        } else {
            tempFilteredData.push(driver_location);
            tempFilteredData.push(delivery_loc);
        }


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
            strokeColor: '#FFFFFF',
            strokeOpacity: 1,
            strokeWeight: 4,
            // icons: [{
            //     icon: {
            //         path: google.maps.SymbolPath.CIRCLE,
            //         scale: 8,
            //         strokeColor: '#393'
            //     },
            //     offset: '100%'
            // }]
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
        // this.state.data.forEach((val) => {
        //     if (val.waiting) {
        //         mapDuration += parseInt(val.waiting);
        //     }
        // });

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

    renderMap = () => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=" + Constants.GOOGLE_MAP_KEY + "&libraries=places,geometry&callback=initMap");
        window.initMap = this.initMap
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {map_rendered, is_set} = this.state;
        if ((prevState.map_rendered != map_rendered || prevState.is_set != is_set) && (map_rendered && is_set)) {
            setTimeout(() => {
                this._renderStartEndLocation();
            }, 500);
        }
    }

    getVenues = () => {
        const endPoint = "https://api.foursquare.com/v2/venues/explore?"
        const parameters = {
            client_id: "PMHC2WA1VCBHVYOPPSJ0QSBYTLRF4PNJ04OWVWV0PZJ0QFIR",
            client_secret: "CULSZZ44YAEBOWBFGPB4BF5ISRXXSNYR0EE3JV3CNE2ZWHV0",
            query: "food",
            near: "Sydney",
            v: "20182507"
        }

        axios.get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState({
                    venues: response.data.response.groups[0].items
                }, this.renderMap())
            })
            .catch(error => {
                console.log("ERROR!! " + error)
            })

    }


    _addMarker(location, address) {
        const google = window.google;
        console.log('addingMarker', location, address);
        var infowindow = new window.google.maps.InfoWindow();
        var contentString = `${address.name} - ${address.address}`;
        const icon = {
            url: require('../../../../assets/img/icons/start_marker.png'),
            scaledSize: new google.maps.Size(20, 35), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(11, 11) // anchor
        };
        // Create A Marker
        var marker = new window.google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: this.map,
            title: address.name,
            icon: icon
        });

        // Click on A Marker!
        marker.addListener('click', function () {

            // Change the content
            infowindow.setContent(contentString)

            // Open An InfoWindow
            infowindow.open(this.map, marker)
        });
    }


    _renderStartEndLocation() {

        const google = window.google;
        console.log('_renderStartEnd', google, this.state.is_set)
        if (google && this.state.is_set && this.directionsService && !this.state.rendered) {
            this.setState({
                rendered: true
            });
            const {pickup_loc, pickup_address, delivery_loc, delivery_address, user, driver_location} = this.state;
            this._addMarker(pickup_loc, pickup_address);
            this._addMarker(delivery_loc, {...delivery_address, name: user.name});
            this._calcRoute();
            if (this.state.show_driver) {
                console.log(driver_location, 'driverLoacatin');
                this._renderTruckMarkers(driver_location)
            }
            console.log('render Method called');
            this.callCenter([delivery_loc.lat, delivery_loc.lng])
        }
    }

    initMap = () => {

        const google = window.google;
        // this.google = window.google;
        // Create A Map
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: Constants.MAP_CENTER.lat, lng: Constants.MAP_CENTER.lng},
            zoom: 8,
            styles: tempGoogleMapStyles,
            mapTypeControl: false,
            scaleControl: false,
        });

        this.directionsDisplay = new google.maps.DirectionsRenderer({draggable: false});
        this.directionsService = new google.maps.DirectionsService();
        console.log('directionsService', this.directionsService);
        const prop = this;
        // this.directionsDisplay.addListener('directions_changed', function () {
        //     prop._createPolyline(prop.directionsDisplay.getDirections());
        // });
        this.setState({
            map_rendered: true,
        });

        // Create An InfoWindow


        // Display Dynamic Markers

        // this._renderDataMarkers(this.props.data, this.props.data_type)


    }

    render() {
        return (
            <main style={{height: '400px', width: '100%'}}>
                <div id="map" style={{height: '100%', width: '100%'}}></div>
            </main>
        )
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

export default GoogleMapHtml;
