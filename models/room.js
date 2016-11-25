var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roomSchema = new Schema({
    name:String,
    createAt:{type:Date,default: Date.now}
});

exports = module.exports = mongoose.model("Room",roomSchema);