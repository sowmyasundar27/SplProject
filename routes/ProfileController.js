var express = require('express');
var router = express.Router();
var connectionDB = require('./../utils/connectionDB');
var UserDB = require('./../utils/userDB');
var UserProfile = require('./../model/UserProfile');
var userConnectionInfo = require('./../model/userConnection');
var userConnectionDB = require('./../utils/UserConnectionDB');
const { check, validationResult } = require('express-validator');

router.get('/*', async function(req,res){
  // Completely Based on Pseudocode from Part 3 - Create Routes for Business Logic (Controller)
  if(req.session.theUser){
    if(UserDB.isUserValid(req.session.theUser)){
      if(req.query.action){
        if(req.query.action == "updateRSVP" || req.query.action == "delete" || req.query.action == "save"){
          if(req.query.viewConnections){
            if(req.query.connectionID){
              if(req.query.viewConnections.includes(req.query.connectionID)){
                  if(req.query.action == "save"){
                    // Save a connection with rsvp value  - creating a new userConnection object and adding to session
                    if(req.query.rsvp && (req.query.rsvp == "yes" || req.query.rsvp == "no" || req.query.rsvp == "maybe")){
                      var connection_exits = false;
                      req.session.theUserConnections.forEach(function (item, index) {
                        if(item.usersConnection.connectionID == req.query.connectionID){
                             item.userConnectionrsvp = req.query.rsvp;
                             connection_exits = true;
                            }
                      });
                       if(!connection_exits){
                         userConnectionInfo1 = userConnectionInfo.userConnection(await connectionDB.getConnectionsID(req.query.connectionID), req.query.rsvp);
                         req.session.theUserConnections.push(userConnectionInfo1);
                         userConnectionDB.addRSVP(req.query.connectionID, req.session.theUser.userID, req.query.rsvp);
                       }else{
                         await userConnectionDB.updateRSVP(req.query.connectionID, req.session.theUser.userID, req.query.rsvp);
                       }
                    }else{
                      await userConnectionDB.updateRSVP(req.query.connectionID, req.session.theUser.userID, req.query.rsvp);
                      // If this parameter exists and its value does not match
                      //either "yes", "no", or "maybe" (this indicates something is wrong)
                    }
                    req.session.userProfile.Connectionsofuser = req.session.theUserConnections;
                    res.render('savedConnections', {'data': req.session.theUserConnections, 'user':req.session.theUser.userFirstName});
                  }
                  if(req.query.action == "updateRSVP"){
                    // To update a connection which is already in profile view
                    var connection_exits = false;
                    var item1;
                    async function asyncForEach(array, callback) {
                      for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                      }
                    }
                    const start = async () => {
                      await asyncForEach(req.session.theUserConnections, async (item) => {
                        if(item.usersConnection.connectionID == req.query.connectionID){
                             item1 = await connectionDB.getConnectionsID(req.query.connectionID);
                             connection_exits = true;
                            }

                      });
                      if(req.session.theUser.userID == item1.userID){
                        res.render('connection', {'data': item1, loggedin:true, owner:true, user:req.session.theUser.userFirstName});
                      }else{
                        res.render('connection', {'data': item1, loggedin:true, owner:false, user:req.session.theUser.userFirstName});
                      }

                    }

                    start();
                  }

                  if(req.query.action == "delete"){
                    // To delete a connection which is already in profile view
                    await userConnectionDB.deleteRSVP(req.query.connectionID, req.session.theUser.userID, req.query.rsvp);

                    req.session.theUserConnections.forEach(function (item, index) {
                      if(item.usersConnection.connectionID == req.query.connectionID){
                           req.session.theUserConnections.splice(index, 1);
                           req.session.userProfile.Connectionsofuser = req.session.theUserConnections;
                          }
                    });

                    res.render('savedConnections', {'data': req.session.theUserConnections, 'user':req.session.theUser.userFirstName});
                  }
              }
            }
          }
        }
        if(req.query.action == "signout"){
          // On signout - clear the session and route to index page
          req.session.theUser = null;
          req.session.theUserConnections = [];
          req.session.userProfile = null;
          res.render('index', {loggedin:false});

        }
      }else{
        let userconlist = await userConnectionDB.getUserProfile(req.session.theUser.userID);
        req.session.theUserConnections = userconlist;
        res.render('savedConnections', {'data': req.session.theUserConnections, 'user':req.session.theUser.userFirstName});
      }
    }
  }else{
    res.render('login', {data:"Login first", loggedin:false});
  }
});

router.post('/*', [check('username')
  .not().isEmpty().withMessage(' can not be empty')
  .isAlphanumeric().withMessage(' should contain only numbers and letters')
  .isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
  check('password')
    .not().isEmpty().withMessage(' can not be empty')
    .isAlphanumeric().withMessage(' should contain only numbers and letters')
    .isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim()
    ], async function(req,res){
      const errors = validationResult(req);
         if (!errors.isEmpty()) {
         return res.render('login', {data:errors.array()[0].param.toUpperCase() + errors.array()[0].msg , loggedin:false});
         }
  // No User logged in currently - create a new user and add to session
  // No User logged in currently - login the user and add to session
  // This login part is Completely based on Pseudocode from Milestone-5
  if(req.body.username){
    if(req.body.password){
      if(await UserDB.isUserLoginValid(req.body.username, req.body.password)){
          let newuser = await UserDB.getUserfromUsername(req.body.username);
          req.session.theUser = newuser;
          let userconlist = await userConnectionDB.getUserProfile(newuser.userID);
          req.session.theUserConnections = userconlist;
          var userprofile = new UserProfile.UserProfile(newuser.userID, userconlist);
          req.session.userProfile = userprofile;
          res.render('savedConnections', {'data': req.session.theUserConnections, 'user':req.session.theUser.userFirstName});
      }else{
        res.render('login', {data:"Incorrect Username/Password", loggedin:false});
      }
    }else{
      res.render('login', {data:"Login first", loggedin:false});
    }
  }else{
    res.render('login', {data:"Login first", loggedin:false});
  }
});

module.exports = router;
