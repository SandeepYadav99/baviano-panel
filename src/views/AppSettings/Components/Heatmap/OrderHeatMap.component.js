
import React, {Component} from 'react'
import Constants from '../../../../config/constants';
import {Button} from '@material-ui/core';
import EventEmitter from "../../../../libs/Events.utils";
import {serviceGetHeatMapUsers} from "../../../../services/AppSettings.service";
import UserHeatMap from "./UserHeatMap.component";

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

class OrderHeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_set: false,
            map_rendered: false,
            rendered: false,
            polygon: [],
            isCalling: true,
            data: [],
        };
        this.map = null;
        this.google = null;
        this.heatmap = null;

        this._smoothZoom = this._smoothZoom.bind(this);
        this.initMap = this.initMap.bind(this);
        this._updatePolygon = this._updatePolygon.bind(this);
    }

    async componentDidMount() {
        const {order_id} = this.props;
        this.renderMap();
    }


    componentWillUnmount() {
        const {is_error, booking_id} = this.state;
        if (!is_error) {

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

        if (window.google && this.map) {
            var location = new window.google.maps.LatLng(data[0], data[1]);
            // this.map.setZoom(14);
            this.map.panTo(location);
            this._smoothZoom(this.map, 12, this.map.getZoom());
        }
    }

    _renderHeatMap() {
        const { data } = this.state;
        const google = window.google;
        this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: data,
            map: this.map
        });
        const gradient = [
            "rgba(0, 255, 255, 0)",
            "rgba(0, 255, 255, 1)",
            "rgba(0, 191, 255, 1)",
            "rgba(0, 127, 255, 1)",
            "rgba(0, 63, 255, 1)",
            "rgba(0, 0, 255, 1)",
            "rgba(0, 0, 223, 1)",
            "rgba(0, 0, 191, 1)",
            "rgba(0, 0, 159, 1)",
            "rgba(0, 0, 127, 1)",
            "rgba(63, 0, 91, 1)",
            "rgba(127, 0, 63, 1)",
            "rgba(191, 0, 31, 1)",
            "rgba(255, 0, 0, 1)"
        ];
        this.heatmap.set("gradient", gradient);
    }

    renderMap = () => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=" + Constants.GOOGLE_MAP_KEY + "&libraries=geometry,visualization&callback=initMap");
        window.initMap = this.initMap
    }


    _updatePolygon(data) {
        this.setState({
            polygon: data,
        });

    }


    initMap = () => {
        const {polygon} = this.props;
        const polygonArray = [];
        const google = window.google;
        // this.google = window.google;
        // Create A Map
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: Constants.MAP_CENTER.lat, lng: Constants.MAP_CENTER.lng},
            zoom: 10,
            // styles: tempGoogleMapStyles,
            mapTypeControl: false,
            scaleControl: false,
        });
        this.setState({
            map_rendered: true,
        }, () => {
            serviceGetHeatMapUsers({ }).then((res) => {
                if (!res.error) {
                    const data = res.data;
                    this.setState({
                        isCalling: false,
                        data: data.map((val) => { return new google.maps.LatLng(val[0], val[1]) }),
                    }, () => {
                        this._renderHeatMap()
                    });
                }
            });

        });

    };




    render() {
        return (
            <div>
                <main style={{height: '400px', width: '100%'}}>
                    <div id="map" style={{height: '100%', width: '100%'}}></div>
                </main>
            </div>
        )
    }
}

function loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}

export default OrderHeatMap;
