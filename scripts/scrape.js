// scrape script

// Require axios and cheerio in order to make scrapes possible
const axios = require("axios");
const cheerio = require("cheerio");

const scrape = function (cb) {
    // Grab body of the html with axios
    axios.get("https://www.rollingstone.com/").then(function(response) {
        // Load that html into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        var articles = [];

        $(".c-card--excerpt").each(function(i, element){

            var cat = $(this).children("c-card__featured-tag").text().trim();
            var title = $(this).children("t-copy").text().trim();

            if(cat && title){
                var categoryNeat = cat.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var titleNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    category: categoryNeat,
                    fullTitle: titleNeat
                };
                
                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;