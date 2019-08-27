// Controller for the notes
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    /* This get function will find all of the notes associated 
    with the articles (by the categoryId in question) */   
    get: function(data, cb) {
        Note.find({
            _categoryId: data._id
        }, cb);
    },
    // Save function is taking in data from the user and the callback function
    save: function(data, cb) {
        /* create an object called newNote that has the article's id, 
        date, and any note text added by the user */
        var newNote = {
            _categoryId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };

        // A note is created
        Note.create(newNote, function(err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                // If no error, a document is created and return the new note to the callback function.
                console.log(doc);
                cb(doc);
            }
        });
    },
    // Delete function removes the note associate with the article.
    delete: function(data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};