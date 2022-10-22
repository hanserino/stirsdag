
/**
 * Map specifics
 */
let centerCords = [10.788729707904333, 59.97173140613864];
let zoomLevel = 11.8;
let coords = [];
const lineColor = "#f83b75";
const lineWidth = 3;
let ready = false;

const mapOptions = {
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v10',
    center: [10.788729707904333, 59.97173140613864],
    zoom: 11.8,
    scrollZoom: false,
    closePopupOnClick: true,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    keyboard: false,
};

const popupOptions = {
    closeButton: true,
    closeOnClick: false,
    autoPan: true,
    keepInView: true
}

const markers = {
    "type": "FeatureCollection",
    "id": "markers",
    "features": [
        {
            "type": "Feature",
            "id": "start",
            "text": "Møteplass: Statuen til Laila Schou Nilsen",
            "icon": "🏃‍",
            "properties": {
                "description": "<h3><strong>Laila Schou Nilsen</strong></h3><p>Møt opp litt før 18:00, så får du minglet litt med de andre før toget går.</p><img width=\"300\" src=\"/assets/media/pics/mapPics/laila.jpg\">"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    10.78960483675896,
                    59.946334264867964
                ],
            }
        },
        {
            "type": "Feature",
            "id": "end",
            "text": "Kjelsås trikkestasjon",
            "icon": "🏁",
            "properties": {
                "description": "<h3><strong>Kjelsås Trikkestasjon</strong></h3><p>Her avsluttes Stirsdag Classic. Noen ganger tar vi en matbit etterpå. Andre ganger ikke. </p><img width=\"300\" src=\"/assets/media/pics/mapPics/kjelsas.jpg\">"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    10.783729,
                    59.962675
                ]
            }
        },
        {
            "type": "Feature",
            "id": "",
            "text": "Peloton",
            "icon": "🍕",
            "properties": {
                "description": "<h3><strong>Pizza og pils på <a href=\"http://pelotonoslo.no/\" target=\"_blank\">Peloton</a></strong></h3><img width=\"300\" src=\"/assets/media/pics/mapPics/peloton.jpg\">"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    10.7543495,
                    59.9174939
                ]
            }
        }
    ]
};

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuc2VyaW5vIiwiYSI6ImNqOHprMWUzZjI3N3czM29icjNlOW1lN2oifQ.SBJSmMYduwt6C_MWPMdelQ';


/**
 * All things map
 */
function map(el) {
    if(el){
        console.log(el);
        
        const map = new mapboxgl.Map(mapOptions);
        const popup = new mapboxgl.Popup(popupOptions);

        fetch('/assets/data/coordinates.json').then(function (response) {
            return response.json().then(function (data) {
                coords = data;

                map.on('load', function () {
                    map.addLayer({
                        "id": "route",
                        "type": "line",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": coords
                                }
                            }
                        },
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": lineColor,
                            "line-width": lineWidth
                        }
                    });
                });
            });
        }).catch(error => {
            console.log(error);
        });

        markers.features.forEach(function (marker) {
            var markerEl = document.createElement('div'); 
            markerEl.className = 'marker';
            markerEl.innerHTML = marker.icon;
            markerEl.style.fontSize = "2.5rem";
            markerEl.style.width = '3rem';
            markerEl.style.height = '3rem';
            markerEl.style.lineHeight = '1';

            markerEl.addEventListener('click', function (e) {
                popup.setLngLat(marker.geometry.coordinates)
                    .setHTML(marker.properties.description)
                    .addTo(map);
            });

            // Adds marker to map
            new mapboxgl.Marker(markerEl)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        });

    }
}