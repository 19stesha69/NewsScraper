const express = require("express");

// assigning PORT to the host's designated port OR 3000
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Express Router
const router = express.Router();

/*To serve static files such as images, CSS files, 
and JavaScript files, use the express.static built-in 
middleware function in Express.*/
app.use(express.static(_dirname + "/public"));

// Every request will go through the router middleware
app.use(router);

// Listen on the port
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});





const mongoose = require("mongoose");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require alll of the database models
const db = require("./models");



