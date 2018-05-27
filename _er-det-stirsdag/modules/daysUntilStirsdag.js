const daysUntilStirsdag = function(today){
    if (today === 0) return 2;
    if (today === 1) return 1;
    if (today === 2) return 0;
    if (today === 3) return 6;
    if (today === 4) return 5;
    if (today === 5) return 4;
    if (today === 6) return 3;

    else {
        return 'empty';
    }
}

module.exports = daysUntilStirsdag
