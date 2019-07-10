
/**
 * Forecast specifics
 */
let forecastData = { "data": {} };

//Lillomarka
let forecastUrl = 'https://www.yr.no/api/v0/locations/1-73569/forecast';


/**
 * Date specifics
 */
let date = new Date(),
    day = date.getDay();



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
    if (el) {
        el.style.backgroundImage = `url("/assets/media/pics/headerPics/${picNumber}.jpg")`;
    }
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

function isitStish(el){
    if(el){
        const isitAnswerEl = document.getElementById("isitAnswer"); 

        el.setAttribute("data-stirsdag", isStirsdag.toString());

        if (isStirsdag) {
            isitAnswerEl.innerHTML = answers.yes[randomInt(0, answers.yes.length)];
        } else {
            isitAnswerEl.innerHTML = `
                Nei, i dag er det dessverre bare vanlig ${moment().locale('nb').format('dddd')}. <br>
                Neste Stirsdag er tirsdag ${nextStirsdagDate}.`;
        }
    }
}

function header(el){    
    if(el){
        console.log('header loaded');

        const isitAnswerEl = document.getElementById("isitAnswer");
        //setBackground(el, randomInt(1, 13));
        el.setAttribute("data-stirsdag", isStirsdag.toString());

        
    }
}

function quotes(listEl){

    if(listEl){
        console.log('lol');
        
        const quoteItems = listEl.getElementsByTagName("li");
        
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
    }
}

function forecast(el){

    function weatherRow(item, goodIdea) {
        let goodIdeaEmoji = goodIdea ? '👍' : '👎';
    
        return `<tr>
                    <td>${item}</td>
                    <td>${goodIdeaEmoji}</td>
                </tr>`;
    }


    if(el){
        const degreesEl = document.getElementById("degrees");
        const gearTableBody = document.getElementById("gearTableBody");
        const weatherText = document.getElementById("weatherText");

        fetch(forecastUrl).then(function (response) {
            return response.json().then(function (data) {
                forecastData.data = data;
                el.dataset.forecastDataLoaded = true;

                let yrInterval = 4 * daysUntilStirsdag(day);
                let stirsdagWeather = forecastData.data.longIntervals[yrInterval];

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
                    <p>Basert på værmeldingen har vi også skreddersydd denne lekre tabellen til deg: </p>
                `;

                gearTableBody.innerHTML += weatherRow('Regntøy', willItRain, willItRain);
                gearTableBody.innerHTML += weatherRow('Splitshorts', true, true);
                gearTableBody.innerHTML += weatherRow('Terrengsko', true, true);
                gearTableBody.innerHTML += weatherRow('Hodelykt', false, false);
                gearTableBody.innerHTML += weatherRow('Solbriller', false, false);
                gearTableBody.innerHTML += weatherRow('Godt humør', true, true);
                gearTableBody.innerHTML += weatherRow('Enkeltmannspakke', true, true);

            });
        }).catch(error => {
            console.log(error);
            weatherText.innerHTML = `Noe gikk galt med lastingen av vær-data. <a href="tel:004792841558">Ring HK eller sjekk <a href="https://www.yr.no/nb/oversikt/dag/1-73744/Norge/Oslo/Oslo/Disen">Trollvann på YR.no</a>`;
            gearTable.innerHTML = "";
        });
    }
}

function init() {
    /**
    * DOM elements
    */     

    document.body.setAttribute("data-touch", isTouchDevice());

    //Header suff
    header(document.getElementById("header"));

    //Is it Stish?
    isitStish(document.getElementById("er-det-stirsdag"));

    //Quotes stuff
    quotes(document.getElementsByClassName("quote-list")[0]);
    
    //Forecast stuff
    forecast(document.getElementById("utstyr"));

    //Sidespor stuff
    sidespor(document.getElementById("sidespor"));

    //Map stuff
    map(document.getElementById("map"));

}

/**
 * Wait for document ready to fire dom dependent stuf
 */

window.addEventListener('load', function () {
    init();
});

