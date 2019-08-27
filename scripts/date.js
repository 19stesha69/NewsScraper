const makeDate = function() {
    // Date() is a built-in JavaScript method
    var d = new Date();
    var formattedDate = "";

    formattedDate += (d.getMonth() + 1) + "_";

    formattedDate += d.getDate() + "_";

    formattedDate += d.getFullYear();

    return formattedDate;   
};

module.exports = makeDate;