const isit = function(daysUntil, today){

    //Stirsdag is Tuesday, aka 2nd day of the week
    let isStirsdag = today === 2 ? true : false;

    return isStirsdag;
}

module.exports = isit