const router=require('express').Router();
const passport=require('passport');
const model=require('../models/model')
const bcyrpt=require('bcrypt');
router.get('/google',passport.authenticate('google',{
    scope:['email','profile']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.redirect('/profile');
})

router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');  
})

router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));

router.get('/facebook/callback',passport.authenticate('facebook'),(req,res)=>{
  res.redirect('/profile');
})

router.get('/',checknotauthenticate,(req,res)=>{
  res.render('home',{success:req.flash('success')})
});

router.post('/submit',
passport.authenticate('local', { successRedirect: '/welcome',
                                 failureRedirect: '/',
                                 failureFlash: true })
);
router.get('/register',checknotauthenticate,(req,res)=>{
  res.render('register',{messages:req.flash('info')});
})
router.post('/register',(req,res)=>{
  model.find({email:req.body.email}).then(output=>{
    console.log(output)
    if(output.length>0)
    {
      req.flash('info','User with email id exists');
      res.redirect('/register')
    }
    else
    {
      bcyrpt.hash(req.body.passwrd,10).then((hash)=>{
        new model({
          name:req.body.uname,
          email:req.body.email,
          password:hash
        }).save().then(result=>{
          console.log(result);
          req.flash('success','Registered Successfully Login to Portal')
          res.redirect('/')
        });
      })
     
    }
  })
  
})
router.get('/welcome',checkauthenticate,(req,res)=>{
  //console.log(req.user);
  res.render('welcome',{details:req.user.name});
})

function checkauthenticate(req,res,next)
{
  if(req.isAuthenticated())
  {
      next();
  }
  else{
    res.redirect('/');
  }
}
function checknotauthenticate(req,res,next)
{
  if(req.isAuthenticated())
  {
      res.redirect('/welcome')
  }
  else{
    next();
  }
}

module.exports=router;