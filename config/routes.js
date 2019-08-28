
// Bring in the scrape funtion from scripts directory
const scrape = require("../scripts/scrape");

// Bring articles and notes from the container
const articlesController = require("../controllers/articles");
const notesController = require("../controllers/notes");

module.exports = function(router) {
    // This route renders the homepage
    router.get("/", function(req, res) {
        res.render("home");
    });
    // This router renders the saved handlebars page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
}