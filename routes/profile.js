const { route } = require('./auth');

const router=require('express').Router();

const authcheck=(req,res,next)=>{
    if(!req.user)
    {
        res.redirect('/');
    }
    else
        next();
}

router.get('/profile',authcheck,(req,res)=>{
    res.send('<a href="/logout">Logout</a>');
})


module.exports=router;