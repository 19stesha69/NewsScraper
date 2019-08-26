// Require mongoose npm package
const mongoose = require("mongoose");

// create a schema using the mongoose schema function
const Schema = mongoose.Schema;

// Create a new schema called headLineSchema
var headlineSchema = new Schema ({
    headline: {
        type: String,
        required: true,
        /*unique requires the headline be unique so the same 
        article doesn't get scraped more than once*/
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;

