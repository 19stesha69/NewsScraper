// Require mongoose npm package
const mongoose = require("mongoose");

// create a schema using the mongoose schema function
const Schema = mongoose.Schema;

// Create a new schema called noteSchema
var noteSchema = new Schema ({
    _categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    date: String,
    noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;