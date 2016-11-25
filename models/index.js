var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost/socket3");

exports.User = require("./user");
exports.Message = require("./message");
exports.Room = require("./room");