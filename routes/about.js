var express = require('express');
var router = express.Router();

router.get('/*', function(req,res){
  if(req.session.theUser){
    res.render('about', {loggedin: true, user:req.session.theUser.userFirstName});
  }else{
    res.render('about', {loggedin: false});
  }

});


module.exports = router;
