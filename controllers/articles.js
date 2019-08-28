// Require scrape and makeDate scripts
const scrape = require("../scripts/scrape");
const makeDate = require("../scripts/date");

// Require Articles mongoose models
const Articles = require("../models/Articles");

// This modules.exports contains all of the functionallity related to the Articles
module.exports = {
    // fetch scrapes the website to collect articles and deposits them in the mongo database
    fetch: function(cb) {
        scrape(function(data) {
            var articles = data;
            for (var i=0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }

            Articles.collection.insertMany(articles, {ordered:false}, function(err, docs){
                cb(err, docs);
            });
        });
    },
    // delete property removes articles
    delete: function(query, cb) {
        Articles.remove(query, cb); 
    },
    /* Get property allows for the articles to be sorted 
    most recent to least recent then pass docs to callback function */
    get: function(query, cb) {
        Articles.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    // Updates any new articles with the relevant id
    update: function(query, cb) {
        Articles.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }
}
