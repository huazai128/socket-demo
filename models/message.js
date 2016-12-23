/**
 * 对话信息
 *
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
    content:{type:String,required:true},
    creator:{
        _id:ObjectId,
        email:{type:String,required:true},
        name:String,
        avatarUrl:String
    },
    roomId:ObjectId,
    createAt:{type:Date,default: Date.now}
});

exports = module.exports = mongoose.model("Message",messageSchema);