var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');


var connectionDB = require('./../utils/connectionDB');
var connectionslist = connectionDB.getConnections();

router.get('/*', async function(req,res,next){
  if(req.query.action){
    if(req.query.action == "edit"){
      if(req.query.connectionID){
          let item = await connectionDB.getConnectionsID(req.query.connectionID);
          req.session.connectioneditid = req.query.connectionID;
          res.render('newConnection', {'data':"" ,loggedin: true, toedit:true, connectiondata:item, user:req.session.theUser.userFirstName});
      }
    }
  }else{
    next();
  }
});


router.get('/*', function(req,res){
  if(req.session.theUser){
    res.render('newConnection', {data:"", loggedin:true, toedit:false, user:req.session.theUser.userFirstName});
  }else{
    res.render('login', {data:"Login to add new event", loggedin:false});
  }

});



// On post request from newConnection page
// validations for the post request
router.post('/*', [check('name').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 50}).withMessage(' can only be maximum of 50 characters')
.trim(),
check('topic').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 50}).withMessage(' can only be maximum of 50 characters').trim(),
check('description').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 100}).withMessage(' can only be maximum of 100 characters').trim(),
check('datetime').not().isEmpty().withMessage(' can not be empty').trim(),
check('location').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim()], async function(req,res){

  const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return res.render('newConnection', {data:errors.array()[0].param.toUpperCase() + errors.array()[0].msg , loggedin:true, toedit:false, user:req.session.theUser.userFirstName});
   }

  var newcon = -1;
  var date = req.body.datetime
  newcon = connectionDB.addConnection(req.body.name, req.body.topic,
    req.body.description, req.session.theUser.userFirstName + " " +  req.session.theUser.userLastName, date.split("T")[0], date.split("T")[1], req.body.location, req.session.theUser.userID);
  if(newcon!=-1){
    res.render('connection', {data: newcon, loggedin:true, owner:true, user:req.session.theUser.userFirstName});
  }else{
    res.render('/newConnection', {data: "Connection not added", loggedin:true, toedit:false, user:req.session.theUser.userFirstName});
  }

});


module.exports = router;
