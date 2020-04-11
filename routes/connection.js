 var express = require('express');
var router = express.Router();
var connectionDB = require('./../utils/connectionDB');
var connectionslist = connectionDB.getConnections();

// with parameter connection ID
router.get('/:conid', async function(req,res){
  let connection_categories = await connectionDB.getcategories();
  let item = await connectionDB.getConnectionsID(req.params.conid)
  if(item == -1){
    let connectionslist = await connectionDB.getConnections();
    if(req.session.theUser){
      res.render('connections', {'conlist': connectionslist, 'con_category': connection_categories, loggedin: true, user:req.session.theUser.userFirstName});
    }else{
      res.render('connections', {'conlist': connectionslist, 'con_category': connection_categories, loggedin: false});
    }


  }else{
    if(req.session.theUser){
        if(req.session.theUser.userID == item.userID){
          res.render('connection', {'data': item, loggedin: true, owner:true, user:req.session.theUser.userFirstName});
        }else{
          res.render('connection', {'data': item, loggedin: true, owner:false, user:req.session.theUser.userFirstName});
        }
      }else{
        res.render('connection', {'data': item, loggedin: false});
      }

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
