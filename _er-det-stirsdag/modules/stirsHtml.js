const stirsHtml = function(isStirsdag, weekday, nextStirsdagDate){
    let html = "";

    if (isStirsdag) {
      html `AAAAAAYEEEEEAH!`;
    } else {
        html = `
            Nei, i dag er det dessverre bare vanlig ${weekday}. <br />
            Neste Stirsdag er ${nextStirsdagDate}.
            <a href="https://www.facebook.com/events/308897826279982/">Meld deg på her</a> eller bare møt opp på Disen trikkestopp kl 18:00.`;
    }
    return html;
}

module.exports = stirsHtml
