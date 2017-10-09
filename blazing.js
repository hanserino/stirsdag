window.addEventListener('load', function() {
    let headerEl = document.getElementById("header");        
    let isitAnswerEl = document.getElementById("isitAnswer");

    let degreesEl = document.getElementById("degrees");
    let gearTableBody = document.getElementById("gearTableBody");
    let weatherText = document.getElementById("weatherText");

    let forecast = {
        "data": {}
    };

    let forecastUrl = 'https://www.yr.no/api/v0/locations/1-73569/forecast';

    let date = new Date(),
        day = date.getDay();

    let isStirsdag = day === 2 ? true : false;

    let daysUntilStirsdag = function(today){            
        if(today === 0) return 2;
        if(today === 1) return 1;
        if(today === 2) return 0;
        if(today === 3) return 5;
        if(today === 4) return 4;
        if(today === 5) return 3;
        if(today === 6) return 2;

        else{
            return empty;
        }
    }

    console.log('daysUntilStirsdag: ' , daysUntilStirsdag(day));

    let nextStirsdagDate = moment().locale('nb').day(2).format('Do MMMM');

    function randomInt(min, max) { 
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const answers = {
        yes: [
            "Jaaa!!! Vi ses på <a href='https://goo.gl/maps/cuhG4nfLZtM2'>Disen Trikkestopp</a> kl 17:50!",
            "Fuck yeah! Vi ses på <a href='https://goo.gl/maps/cuhG4nfLZtM2'>Disen Trikkestopp</a> kl 17:50!"
        ],
        no: [
            "Nope. Ta deg en bolle.",
            "Nei. Men ta deg en tur i skauen åkke som da, for faen.",
            "Nei. Kanskje i dag er dagen hvor du skal teste ut HK's famøse <a target='_blank' href='https://medium.com/skyblazers/oppskrift-ultraboller-8eb07c8421ff'>Ultrabolle-oppskrift</a>? 🍪"
        ]
    }

    function setBackground(number){
        headerEl.style.backgroundImage = `url("media/headerPics/${number}.jpg")`;
    }

    function weatherRow(item, goodIdea){
        let goodIdeaEmoji = goodIdea ? '👍' : '👎';

        return `<tr>
                    <td>${item}</td>
                    <td>${goodIdeaEmoji}</td>
                </tr>`;
    }

    setBackground(randomInt(1,14));
    headerEl.setAttribute("data-stirsdag", isStirsdag.toString());

    if (isStirsdag) {
        isitAnswerEl.innerHTML = answers.yes[randomInt(0,answers.yes.length)];
    }else{
        isitAnswerEl.innerHTML = `
            Nei, i dag er det bare vanlig ${moment().locale('nb').format('dddd')}. <br>
            Neste Stirsdag er tirsdag ${nextStirsdagDate}.
            <a href="https://www.facebook.com/pg/skyblazersrunning/events/">Meld deg på her</a>.`;
    }


    fetch(forecastUrl).then(function (response) {
        return response.json().then(function (data) {

            forecast.data = data;
            
            let yrInterval = 4*daysUntilStirsdag(day);
            let stirsdagWeather = forecast.data.longIntervals[yrInterval];
            
            let tempText = "",
                feelsLikeText = "",
                precipText = "";

            if(stirsdagWeather.temperature.value != undefined){
                tempText = `Det ser ut til å bli <em>${stirsdagWeather.temperature.value}&deg;<abbr title="Celcius">C</abbr></em> på stien.<br />`;
            }

            if(stirsdagWeather.feelsLike.value != undefined){
                feelsLikeText = `Vær obs på at pga. kombinasjonen av vind og luftfuktighet kommer det til å føles som ca. <em>${stirsdagWeather.feelsLike.value}&deg;<abbr title="Celcius">C</abbr></em>, så ikke la deg lure!<br />`;
            }

            if(stirsdagWeather.precipitation.value != undefined){
                if(stirsdagWeather.precipitation.value > 5){
                    precipText = `Med en nedbørsmengde på ca. <em>${stirsdagWeather.precipitation.value}<abbr title="milimeter">mm</abbr></em> kan dette bli en meget interessant Stirsdag. Kle deg etter forholdene. `;
                }
                else {
                    precipText = `Det blir ingen/lite nedbør, så det blir en <em>relativt tørr Stirsdag</em>.`;
                }
                
            }

            //console.log(stirsdagWeather, daysUntilStirsdag(day), stirsdagWeather.feelsLike.value);

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
            <p>Basert på værmeldingen har også generert denne smukke tabellen til deg: </p>
            `;
            
            gearTableBody.innerHTML += weatherRow('Regntøy', willItRain, willItRain);
            gearTableBody.innerHTML += weatherRow('Splitshorts', !willItBeCold, !willItBeCold);
            gearTableBody.innerHTML += weatherRow('Tights', willItBeCold, willItBeCold);
            gearTableBody.innerHTML += weatherRow('Terrengsko', true, true);
            gearTableBody.innerHTML += weatherRow('Hodelykt', true, true);
            gearTableBody.innerHTML += weatherRow('Piggsko', willitBeSuperCold, willitBeSuperCold);
            gearTableBody.innerHTML += weatherRow('Solbriller', false, false);
            gearTableBody.innerHTML += weatherRow('Godt humør', true, true);

        });
    }).catch(error => {
        console.log(error);
        weatherText.innerHTML = `Noe gikk galt. <a href="tel:004792841558">Ring HK`;
        gearTable.innerHTML = "";
    });

});

