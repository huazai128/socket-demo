var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:{type:String,required:true},
    name:String,
    avatarUrl:String,
    roomId:Schema.ObjectId,              //和用户相关的房间号；关联查询
    online:{type: Boolean,default:false}
});

exports = module.exports = mongoose.model("User",userSchema);