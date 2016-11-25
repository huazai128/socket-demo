var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:{type:String,required:true},
    name:String,
    avatarUrl:String,
    roomId:Schema.ObjectId,              //���û���صķ���ţ�������ѯ
    online:{type: Boolean,default:false}
});

exports = module.exports = mongoose.model("User",userSchema);