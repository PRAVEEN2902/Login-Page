const passport=require('passport');
const keys = require('../keys');
const GoogleStrategy=require('passport-google-oauth20');
const model=require('../models/model')
const LocalStrategy=require('passport-local').Strategy;
const FacebookStrategy=require('passport-facebook')
const bcrypt=require('bcrypt')
passport.serializeUser((user,done)=>
{
    done(null,user.id);
})
passport.deserializeUser((id,done)=>
{
    model.findById(id).then((user)=>{
        done(null,user);
    })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwrd'
  },
  function(username, password, done) {
    //console.log(username);
    model.find({email:username}).then(record=>{
        if(record.length==0)
        {
            done(null,false,{message:'Invalid Email.If you are a new user kindly Register'});
        }
        else
        {
            bcrypt.compare(password,record[0].password).then(result=>{
                if(result==true)
                    done(null,record[0])
                else
                    done(null,false,{message:'Password Incorrect'});
            })
           
            
        }
    })
  }
));









passport.use(new FacebookStrategy({
    clientID: keys.facebook.FACEBOOK_APP_ID,
    clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/facebook/callback",
    profileFields:['email','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    model.findOne({socialid:profile.id}).then((current)=>{
        if(current)
        {
            console.log('User exists');
            done(null,current);
        }
        else{
            new model({
                name:profile.displayName,
                socialid:profile.id
            }).save().then((result)=>{
                console.log('Saved Sucessfully'+result);
                done(null,result);
            })
        
        }
    })
  }
));









passport.use(new GoogleStrategy({
    callbackURL:'/google/redirect',
    clientID:keys.google.clientId,
    clientSecret:keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{
    console.log(profile)
    model.findOne({socialid:profile.id}).then((current)=>{
        if(current)
        {
            console.log('User exists');
            done(null,current);
        }
        else{
            new model({
                name:profile.displayName,
                socialid:profile.id
            }).save().then((result)=>{
                console.log('Saved Sucessfully'+result);
                done(null,result);
            })
        
        }
    })
   
}))