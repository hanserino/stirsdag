
let forecast = { "data": {} };
let forecastUrl = 'https://www.yr.no/api/v0/locations/1-73569/forecast';

let stravaData = {};
const stravaUrl = "strava.com";

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
            "text": "Disen trikkestopp",
            "icon": "🏃‍",
            "properties": {
                "description": "<h3><strong>Disen trikkestopp</strong></h3><p>Møt opp litt før 18:00, så får du minglet litt.</p><img width=\"300\" src=\"./media/mapPics/disen.jpg\">"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    10.801359,
                    59.950604
                ],
            }
        },
        {
            "type": "Feature",
            "id": "end",
            "text": "Kjelsås trikkestasjon",
            "icon": "🏁",
            "properties": {
                "description": "<h3><strong>Kjelsås</strong></h3><p>Noen stikker hjem mens andre tar trikken ned til <br /> Peloton og tar en øl og pizza.</p><img width=\"300\" src=\"./media/mapPics/kjelsas.jpg\">"
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
                "description": "<h3><strong>Pizza og pils på <a href=\"http://pelotonoslo.no/\" target=\"_blank\">Peloton</a></strong></h3><img width=\"300\" src=\"./media/mapPics/peloton.jpg\">"
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


/**
 * Date specifics
 */
let date = new Date(),
    day = date.getDay();


/**
 * Other
 */

//Stirsdag is 2. day of the week
let isStirsdag = day === 2 ? true : false;

let isTouchDevice = function () {
    return (
        !!(typeof window !== 'undefined' &&
            ('ontouchstart' in window ||
                (window.DocumentTouch &&
                    typeof document !== 'undefined' &&
                    document instanceof window.DocumentTouch))) ||
        !!(typeof navigator !== 'undefined' &&
            (navigator.maxTouchPoints || navigator.msMaxTouchPoints))
    );
};

let daysUntilStirsdag = function (today) {
    console.log('today is '+today)
    if (today === 0) return 2;
    if (today === 1) return 1;
    if (today === 2) return 0;
    if (today === 3) return 6;
    if (today === 4) return 5;
    if (today === 5) return 4;
    if (today === 6) return 3;

    else {
        return empty;
    }
}

let nextStirsdagDate = moment(date).locale('nb').add(daysUntilStirsdag(day), 'days').format('Do MMMM');

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function setBackground(el, picNumber) {
    el.style.backgroundImage = `url("./media/headerPics/${picNumber}.jpg")`;
}

function weatherRow(item, goodIdea) {
    let goodIdeaEmoji = goodIdea ? '👍' : '👎';

    return `<tr>
                <td>${item}</td>
                <td>${goodIdeaEmoji}</td>
            </tr>`;
}

const answers = {
    yes: [
        "Jaaaa!!! Vi ses på <a href='https://goo.gl/maps/cuhG4nfLZtM2'>Disen Trikkestopp</a> kl 17:55!",
        "Hell yeah!!! Vi ses på <a href='https://goo.gl/maps/cuhG4nfLZtM2'>Disen Trikkestopp</a> kl 17:55!"
    ],
    no: [
        "Nope. Ta deg en bolle.",
        "Nei. Men ta deg en tur i skauen åkke som da, for faen.",
        "Nei. Kanskje i dag er dagen hvor du skal teste ut HK's famøse <a target='_blank' href='https://medium.com/skyblazers/oppskrift-ultraboller-8eb07c8421ff'>Ultrabolle-oppskrift</a>? 🍪"
    ]
}



function init() {
    /**
    * DOM elements
    */
    const headerEl = document.getElementById("header");
    const isitAnswerEl = document.getElementById("isitAnswer");
    const degreesEl = document.getElementById("degrees");
    const gearTableBody = document.getElementById("gearTableBody");
    const weatherText = document.getElementById("weatherText");
    const stravaEl = document.getElementById("strava");

    setBackground(headerEl, randomInt(1, 13));
    document.body.setAttribute("data-touch", isTouchDevice());
    headerEl.setAttribute("data-stirsdag", isStirsdag.toString());

    if (isStirsdag) {
        isitAnswerEl.innerHTML = answers.yes[randomInt(0, answers.yes.length)];
    } else {
        isitAnswerEl.innerHTML = `
            Nei, i dag er det dessverre bare vanlig ${moment().locale('nb').format('dddd')}. <br>
            Neste Stirsdag er tirsdag ${nextStirsdagDate}.
            <a href="https://www.facebook.com/pg/skyblazersrunning/events/">Meld deg på her</a>.`;
    }

    const quoteList = document.getElementsByClassName("quote-list")[0];
    const quoteItems = quoteList.getElementsByTagName("li");

    for (let i = 0; i < quoteItems.length; ++i) {
        quoteItems[i].dataset.activeQuote = false;
        let isActiveQuote = quoteItems[i].dataset.activeQuote;
        let pic = quoteItems[i].getElementsByTagName("img")[0];

        if (isTouchDevice()) {
            pic.onclick = function () {
                quoteItems[i].dataset.activeQuote = true;
                pic.scrollIntoView(true);
            }
        }
    }

    fetch(forecastUrl).then(function (response) {
        return response.json().then(function (data) {
            forecast.data = data;
            let yrInterval = 4 * daysUntilStirsdag(day);
            let stirsdagWeather = forecast.data.longIntervals[yrInterval];

            let tempText = "",
                feelsLikeText = "",
                precipText = "";

            if (stirsdagWeather.temperature.value != undefined) {
                tempText = `Moder Sti byr på imponerende <em>${stirsdagWeather.temperature.value}&deg;<abbr title="Celcius">C</abbr></em>.`;
            }

            if (stirsdagWeather.feelsLike.value != undefined) {
                feelsLikeText = `Pga. kombinasjonen av vind og luftfuktighet kommer det til å føles som ca. <em>${stirsdagWeather.feelsLike.value}&deg;<abbr title="Celcius">C</abbr></em>, så ikke la deg lure!<br />`;
            }

            if (stirsdagWeather.precipitation.value != undefined) {
                if (stirsdagWeather.precipitation.value > 2) {
                    precipText = `Med en nedbørsmengde på ca. <em>${stirsdagWeather.precipitation.value}<abbr title="milimeter">mm</abbr></em> kan dette bli en meget interessant Stirsdag. Kle deg etter forholdene. `;
                }
                if ((stirsdagWeather.precipitation.value > 1) && (stirsdagWeather.precipitation.value < 5)) {
                    precipText = `Med en nedbørsmengde på ca. <em>${stirsdagWeather.precipitation.value}<abbr title="milimeter">mm</abbr></em> blir det bittelitt utfordrende, men desto gøyere! (er det et ord?) `;
                }
                if ((stirsdagWeather.precipitation.value < 1) && (stirsdagWeather.precipitation.value > 0)) {
                    precipText = `Det blir muligens litt nedbør, men ikke nok til å frike ut.`;
                }
            }

            let willItRain = stirsdagWeather.precipitation > 0 ? true : false;
            let willItBeCold = stirsdagWeather.temperature.value < 5 ? true : false;
            let willitBeSuperCold = stirsdagWeather.temperature.value < -1 ? true : false;

            weatherText.innerHTML =
                `
                <p>Prognosen for Lillomarka ${nextStirsdagDate} lyder som følger: </p>
                <p>
                    ${tempText}
                    ${feelsLikeText}
                    ${precipText}
                </p>
                <p>Basert på værmeldingen har vi også generert denne lekre tabellen til deg: </p>
            `;

            gearTableBody.innerHTML += weatherRow('Regntøy', willItRain, willItRain);
            gearTableBody.innerHTML += weatherRow('Splitshorts', true, true);
            gearTableBody.innerHTML += weatherRow('Terrengsko', true, true);
            gearTableBody.innerHTML += weatherRow('Hodelykt', false, false);
            gearTableBody.innerHTML += weatherRow('Solbriller', false, false);
            gearTableBody.innerHTML += weatherRow('Godt humør', true, true);

        });
    }).catch(error => {
        console.log(error);
        weatherText.innerHTML = `Noe gikk galt med lastingen av vær-data. <a href="tel:004792841558">Ring HK eller sjekk <a href="https://www.yr.no/nb/oversikt/dag/1-73744/Norge/Oslo/Oslo/Disen">Trollvann på YR.no</a>`;
        gearTable.innerHTML = "";
    });


    fetch(stravaData).then(function (response) {
        return response.json().then(function (data) {
            stravaData.data = data;
            let champ = "";
            
            console.log(stravaData);

        })
    }).catch(error => {
        console.log('strava error ', error);
        stravaEl.innerHTML = "Hmm.. i dag ser det ut til at Strava sliter med å levere data. Kjipt!"
    });


}


/**
 * All things map
 */
function mapStuff() {

    const map = new mapboxgl.Map(mapOptions);
    const popup = new mapboxgl.Popup(popupOptions);

    fetch('./data/stirsdagCoordinates.json').then(function (response) {
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
        var el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = marker.icon;
        el.style.fontSize = "2.5rem";
        el.style.width = '3rem';
        el.style.height = '3rem';
        el.style.lineHeight = '1';

        el.addEventListener('click', function (e) {
            popup.setLngLat(marker.geometry.coordinates)
                .setHTML(marker.properties.description)
                .addTo(map);
        });

        // Adds marker to map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });
}



/**
 * Wait for document ready to fire dom dependent stuf
 */

window.addEventListener('load', function () {
    console.log('loaded');

    init();
    mapStuff();

});

