var express = require('express');
var router = express.Router();


router.get('/*', function(req,res){
  if(req.session.theUser){
    res.render('index', {loggedin: true, user:req.session.theUser.userFirstName});
  }else{
    res.render('index', {loggedin: false});
  }
});


module.exports = router;
