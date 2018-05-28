const dayBender = function(number){
    let dayName;

    if (number === 0) {
        dayName = "";
    }
    if (number === 1) {
        dayName = "dag";
    }
    else{
        dayName = "dager"
    }

    return dayName;
   
}

module.exports = dayBender
