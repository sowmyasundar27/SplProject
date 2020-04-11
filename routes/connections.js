var express = require('express');
var router = express.Router();
var connectionDB = require('./../utils/connectionDB');
var connectionslist = connectionDB.getConnections();

router.get('/*', async function(req,res,next){
  if(req.query.action){
    if(req.query.action == "delete"){
      if(req.query.connectionID){
          await connectionDB.deleteConnection(req.query.connectionID);
          let connection_categories = await connectionDB.getcategories();
          let connectionslist = await connectionDB.getConnections();
          res.render('connections', {'conlist': connectionslist, 'con_category': connection_categories, loggedin: true, user:req.session.theUser.userFirstName});
      }
    }
  }else{
    next();
  }
});

router.get('/*', async function(req,res){
  let connection_categories = await connectionDB.getcategories();
  let connectionslist = await connectionDB.getConnections();
  if(req.session.theUser){
  res.render('connections', {'conlist': connectionslist, 'con_category': connection_categories, loggedin: true, user:req.session.theUser.userFirstName});
}else{
  res.render('connections', {'conlist': connectionslist, 'con_category': connection_categories, loggedin: false});
}
});


module.exports = router;
