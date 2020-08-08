const express=require('express');
const app=express();
const authrouter=require('./routes/auth');
const profilerouter=require('./routes/profile')
const passportsetup=require('./config/passport')
const mongoose=require('mongoose');
const passport=require('passport')
const cookieSession=require('cookie-session');
const keys = require('./keys');
const flash=require('express-flash')
app.use(express.urlencoded({extended:true}))
const db=`mongodb+srv://Praveen:${keys.db.password}@test.ldcov.mongodb.net/${keys.db.name}?retryWrites=true&w=majority`
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log('Connected');
})
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:['prettysimpleLogin']
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','ejs');
app.use(express.static('public'))

app.use(authrouter);
app.use(profilerouter);
app.listen(3000)