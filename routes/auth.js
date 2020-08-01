const router=require('express').Router();
const passport=require('passport');

router.get('/google',passport.authenticate('google',{
    scope:['email']
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



module.exports=router;