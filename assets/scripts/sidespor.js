
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
    "access_token": "87e7699a89e86a06aea14f2c66b6b86a2b9e7473",
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
        const funFactsEl = document.getElementById('sidespor__fun-facts-text');
        const xomEl = document.getElementById("sidespor__xoms");

        fetch(stravaSegmentUrl(strava.segments.sidespor), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            
            return response.json().then(function (data) {
                el.dataset.stravaDataLoaded = true;

                stravaData.sidespor.facts = data;

                console.log('sidespor-data: ', data);
    
                const {
                    athlete_count, 
                    average_grade, 
                    distance,
                    xoms
                } = stravaData.sidespor.facts;

   

                if(funFactsEl){
                    funFactsEl.innerHTML = `
                        <h3>Hei! Det er jeg som er Bjørnar. Visste du at.. </h3>
                        <ul>
                            <li>Løyperekorden er på utrolige <em>${xoms.kom}</em> sekunder!?</li>
                            <li>Segmentet er blitt løpt <em>${athlete_count}</em> ganger?</li>
                            <li>Det har en gjennomsnittlig helning på <em>${average_grade}%</em>?</li>
                            <li>Segmentet er <em>${distance}m langt?</em></li>
                            <li>Sidesporet er såpass kjent at det er blitt anerkjent av <a href="https://www.gaiagps.com/hike/trail/norway/oslo/maridalen-landskapsvernomr%C3%A5de/bj%C3%B8rnars-flyvende-sidespor/">Gaia GPS?</a></li>
                        </ul>

                        <p>Klikk deg inn på <a href="https://www.strava.com/segments/19952893">leaderboardet på Strava</a> for flere fun facts.</p>
                        
                        <p>Lykke til!</p>
                    `;
                }


            });
        }).catch(error => {
            console.log(error);
        });
      
    }
}