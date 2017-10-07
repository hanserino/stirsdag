window.addEventListener('load', function() {
    let headerEl = document.getElementById("header");        
    let isitAnswerEl = document.getElementById("isitAnswer");

    let degreesEl = document.getElementById("degrees");
    let gearTableBody = document.getElementById("gearTableBody");
    let gearTextEl = document.getElementById("gearText");

    let forecast = {
        "data": {}
    };

    let forecastUrl = 'https://www.yr.no/api/v0/locations/1-73569/forecast';

    let date = new Date(),
        day = date.getDay();

    let isStirsdag = day === 2 ? true : false;

    let daysUntilStirsdag = 7-day+2;
    let nextStirsdagDate = moment().locale('nb').day(9).format('Do MMMM');

    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const answers = {
        yes: [
            "Ja for faen! Vi ses på <a href='https://goo.gl/maps/cuhG4nfLZtM2'>Disen Trikkestopp</a> kl 17:50!",
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
            Nei, i dag er det bare vanlig ${moment().locale('nb').format('dddd')} 🤣. <br>
            Neste Stirsdag er tirsdag ${nextStirsdagDate}.
            <a href="https://www.facebook.com/pg/skyblazersrunning/events/">Meld deg på her</a>.`;
    }


    fetch(forecastUrl).then(function (response) {
        return response.json().then(function (data) {
            forecast.data = data;
            
            //Todo: get the yrInterval to hit midday inteval
            let yrInterval = 4*daysUntilStirsdag;
            let stirsdagWeather = forecast.data.longIntervals[yrInterval];

            //console.log(stirsdagWeather);

            let willItRain = stirsdagWeather.precipitation > 0 ? true : false;
            let willItBeCold = stirsdagWeather.feelsLike.value < 5 ? true : false;
            let willitBeSuperCold = stirsdagWeather.temperature.value < -1 ? true : false;
            
            weatherText.innerHTML = 
            `
            <p>Prognosen for Lillomarka ${nextStirsdagDate} er som følger: </p>
            <p>
            Det blir <em>${stirsdagWeather.temperature.value}&deg;C</em>, men pga vind og luftfuktighet kommer det til å føles som ca <em>${stirsdagWeather.feelsLike.value}&deg;C</em>.<br />
            Med <em>${stirsdagWeather.precipitation.value}mm nedbør</em> ser det ut til å bli en Blazing Stirsdag!
            </p>
            
            <p>Basert på YR-data har vi generert denne tabellen til deg: </p>
            `;
            
            gearTableBody.innerHTML += weatherRow('Regntøy', willItRain, willItRain);
            gearTableBody.innerHTML += weatherRow('Splitshorts', !willItBeCold, !willItBeCold);
            gearTableBody.innerHTML += weatherRow('Base layer / tights', willItBeCold, willItBeCold);
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

