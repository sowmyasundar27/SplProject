var userInfo = require('./../model/user');
var connectionInfo = require('./../model/connection');
var userProfile = require('./../model/userProfile');
var userConnection= require('./../model/userConnection');
var connectionDB = require('./connectionDB');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/connections', {useNewUrlParser: true, useUnifiedTopology: true} );
mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log("Connected to DB connections");
});

var userconnectionSchema = new mongoose.Schema({
  userID : { type: String, required:true},
  connectionID  : { type: String, required:true},
  rsvp : { type: String, required:true}
});

var userconnectionsmongo = mongoose.model('userconnections', userconnectionSchema);

// Hardcoded users
var connectionsofuser = [];

// wrapper for forEach in async functios
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const start = async () => {
  await asyncForEach(tempuscons, async (item) => {
    let conobj1 = await connectionDB.getConnectionsID(item.connectionID);
    userconobj1 = new userConnection.userConnection(conobj1, item.rsvp);
    if(!(connectionsofuser.includes(userconobj1))){
      connectionsofuser.push(userconobj1);
    }
  });
}

// get list of user connections
var getUserconlist = async function(tempuscons){
  connectionsofuser = [];
  await start();
  return connectionsofuser;
}

// get the user profile for given userID
var getUserProfile = async function(userID){
  let a = await userconnectionsmongo.find({userID: userID}, function(err, uscons){
         tempuscons = uscons;
         if(err){
           throw "no data present";
         }
       });
  let b = await getUserconlist(tempuscons);
 return b;
}

// addRSVP to userconnections DB
var addRSVP = async function(connectionID, userID, rsvp){
  const filter = {userID: userID, connectionID:connectionID};
  const update = {rsvp:rsvp};
  userconnectionsmongo.countDocuments(filter);
  let doc = await userconnectionsmongo.findOneAndUpdate(filter, update, {new:true, upsert:true});
}

// updateRSVP to an existing userConnection present in DB
var updateRSVP = async function(connectionID, userID, rsvp){
  const filter = {userID: userID, connectionID:connectionID};
  const update = {rsvp:rsvp};
  userconnectionsmongo.countDocuments(filter);
  let doc = await userconnectionsmongo.findOneAndUpdate(filter, update, {new:true, upsert:true});
}

// delete an existing RSVP present in userConnection DB
var deleteRSVP = async function(connectionID, userID, rsvp){
  let doc = await userconnectionsmongo.deleteOne({userID: userID, connectionID:connectionID
  }, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document

});
console.log(doc);
}

module.exports.getUserProfile= getUserProfile;
module.exports.addRSVP = addRSVP;
module.exports.updateRSVP = updateRSVP;
module.exports.deleteRSVP = deleteRSVP;
module.exports.getUserconlist = getUserconlist;
module.exports.userconnectionsmongo = userconnectionsmongo;
