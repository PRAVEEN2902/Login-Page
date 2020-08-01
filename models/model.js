const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const val=new Schema({
    name:String,
    socialid:String
})
var user=mongoose.model('user',val);
module.exports=user;