const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");

// assigning PORT to the host's designated port OR 3000
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Express Router
const router = express.Router();

/*To serve static files such as images, CSS files, 
and JavaScript files, use the express.static built-in 
middleware function in Express.*/
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Every request will go through the router middleware
app.use(router);

// If deployed, use the deployed database OR use local mongoHead database
const db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

// Connect mongoose to the database
mongoose.connect(db, {useNewUrlParser: true});
// mongoose.connect(db, function(error) {
//     // Log any errors connecting with mongoose
//     if(error) {
//         console.log(error);
//     }
//     // Or log a success message
//     else {
//         console.log("mongoose connection is successful");
//     }
// });

// Listen on the port
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});





// const mongoose = require("mongoose");

// // Scraping tools
// const axios = require("axios");
// const cheerio = require("cheerio");





