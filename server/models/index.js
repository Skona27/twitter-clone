// require mongoose
const mongoose = require("mongoose");

// set debug mode
// we can see actual mongo queries
mongoose.set("debug", true);

// use promises 
mongoose.Promise = Promise;

// connect to DB
mongoose.connect("mongodb://localhost/warbler", {
    keepAlive: true
});

module.exports.User = require("./user");
module.exports.Message = require("./message");