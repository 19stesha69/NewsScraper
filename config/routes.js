
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
    /* This router runs the fetch function and returns articles if there are new ones, or a message
        telling the user to try again tomorrow if there are none. */
    router.get("/api/fetch", function(req, res) {
        articlesController.fetch(function(err, docs){
            if (!docs || docs.insertedCount === 0){
                res.json({
                    message: "No new articles today! Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    // THis router takes in what the user requested and...
    router.get("/api/articles", function(req, res){
        var query = {};
        // returns the saved articles or...
        if (req.query.saved) {
            query = req.query;
        }
        // it returns everything
        articlesController.get(query, function(data){
            res.json(data);
        });
    });
    // This route deletes a specific article
    router.delete("/api/articles/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        articlesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    // This route updates the headlines
    router.patch("/api/articles", function(req, res){
        articlesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    // This route gets the notes for a particular article and displays it
    router.get("/api/notes/:category_id?", function(req, res){
        var query = {};
        if (req.params.category_id) {
            query._id = req.params.category_id;
        }
        notesController.get(query, function(err, data){
            res.json(data);
        });
    });
    // This route deletes the notes
    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    // This route posts new notes to articles
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });
}