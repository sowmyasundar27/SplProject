var express = require('express');
var router = express.Router();

router.get('/*', function(req,res){
  if(req.session.theUser){
  res.render('contact', {loggedin: true, user:req.session.theUser.userFirstName});
}else{
  res.render('contact', {loggedin: false});
}
});


module.exports = router;
