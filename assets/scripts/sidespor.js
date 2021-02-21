
/**
 * Strava specifics
 */
let stravaData = {
    "sidespor": {
        "facts": ""
    }
};

const strava = {
    "base_url" : "https://www.strava.com/api/v3", 
    "access_token": "91943ecfe9823c7ea97933805b9c731fd899bd9e",
    "segments": {
        "sidespor": "19952893"
    },
}

const stravaSegmentUrl = function(segmentId, query){
    let queryString = "";

    if(segmentId && query){ 
        console.log('segment id and query');
        queryString = `${strava.base_url}/segments/${segmentId}/${query}?access_token=${strava.access_token}`;
    } else {
        console.log('only segment');
        queryString = `${strava.base_url}/segments/${segmentId}?access_token=${strava.access_token}`;
    }
    
    console.log(queryString)
    return queryString;
}

function sidespor(el){
    if(el){
        const leaderTextEl = document.getElementById("sidespor__leader-text");
        const podiumEl = document.getElementById("sidespor__podium-list");
        const funFactsEl = document.getElementById('sidespor__fun-facts-text');

        fetch(stravaSegmentUrl(strava.segments.sidespor, 'leaderboard'), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json().then(function (data) {
                console.log(data);

                stravaData.sidespor = data;
                el.dataset.stravaDataLoaded = true;
            
                for (let i = 0; i < 10; ++i) {
                    const entry = stravaData.sidespor.entries[i];

                    console.log(entry);
                    
                    entry.time_spent_formatted = moment.utc(entry.moving_time*1000).format('mm:ss');
                    entry.date_formatted = moment(entry.start_date_local).locale('nb').subtract(2, 'hour').calendar();

                    let podiumIcon = "";
                    let legendText = `<em>${entry.athlete_name}</em> - (${entry.time_spent_formatted})`;
    
                    if(i === 0){
                        leaderTextEl.innerHTML = `<p>Foreløpig <abbr title="Fastest Known Time">FKT</abbr> ble satt av <em>${entry.athlete_name}</em> ${entry.date_formatted} og lyder på imponerende <em>${entry.time_spent_formatted}</em>. Omg for en legende!!!</p>`;
                        podiumIcon = `🥇`;
                    }
                    if(i === 1){
                        podiumIcon = `🥈`;
                    }
                    if(i === 2){
                        podiumIcon = `🥉`;
                    }
    
                    podiumEl.innerHTML += `<li>${legendText} ${podiumIcon}</li>`;
                    
                }
    
            });
        }).catch(error => {
            console.log(error);
            el.innerHTML = "Hmm.. i dag ser det ut til at Strava sliter med å levere data. Kjipt!"
        });

        fetch(stravaSegmentUrl(strava.segments.sidespor), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            
            return response.json().then(function (data) {
                
                stravaData.sidespor.facts = data;

                console.log('data: ', data);
    
                const {
                    athlete_count, 
                    average_grade, 
                    distance
                } = stravaData.sidespor.facts;

                
                if(funFactsEl){
                    funFactsEl.innerHTML = `
                        <h3>Hei! Det er jeg som er Bjørnar. Visste du at.. </h3>
                        <ul>
                            <li><em>${athlete_count}</em> løpere har forsøkt seg på segmentet mitt?</li>
                            <li>Det har en gjennomsnittlig helning på <em>${average_grade}%</em>?</li>
                            <li>Segmentet er <em>${distance}m langt?</em> </li>
                        </ul>
                        
                        <p>Lykke til!</p>
                    `;
                }
            });
        }).catch(error => {
            console.log(error);
        });
      
    }
}