// Require mongoose npm package
const mongoose = require("mongoose");

// create a schema using the mongoose schema function
const Schema = mongoose.Schema;

// Create a new schema called headLineSchema
var articleSchema = new Schema ({
    category: {
        type: String,
        required: true,
        /*unique requires the headline be unique so the same 
        article doesn't get scraped more than once*/
        unique: true
    },
    fullTitle: {
        type: String,
        required: true
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;

