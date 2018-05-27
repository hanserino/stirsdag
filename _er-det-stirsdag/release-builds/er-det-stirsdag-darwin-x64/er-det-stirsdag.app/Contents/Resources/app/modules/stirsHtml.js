const stirsHtml = function(isStirsdag, day, nextStirsdagDate){
    let html = "";

    if (isStirsdag) {
      html `YEEES!`;
    } else {
        html = `
            Nei, i dag er det dessverre bare vanlig ${day}. <br>
            Neste Stirsdag er tirsdag ${nextStirsdagDate}.
            <a href="https://www.facebook.com/events/308897826279982/">Meld deg på her</a> eller bare møt opp.`;
    }
    return html;
}

module.exports = stirsHtml
