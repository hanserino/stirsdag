const isit = function(today){

    //Stirsdag is Tuesday, aka 2nd day of the week
    let isStirsdag = today === 2 ? true : false;

    console.log(today, isStirsdag)

    return isStirsdag;
}

module.exports = isit