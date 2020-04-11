var connectionInfo = require('./../model/connection');
var userConnectionDB = require('./UserConnectionDB');
var mongoose = require('mongoose');

var connection_categories = [];
var connections = [];

mongoose.connect('mongodb://127.0.0.1:27017/connections', {useNewUrlParser: true, useUnifiedTopology: true} );
mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log("Connected to DB connections");
});


var connectionSchema = new mongoose.Schema({
  connectionID : { type: String, required:true},
  connectionName  : { type: String, required:true},
  connectionTopic : { type: String, required:true},
  connectionDetails: { type: String, required:false},
  connectionHost : { type: String, required:true},
  connectionDate : { type: String, required:false},
  connectionTime : { type: String, required:false},
  connectionLocation : { type: String, required:false},
  userID : { type: String, required:true}
});

var connectionsmongo = mongoose.model('connections', connectionSchema);

// get all unique categories of the connections present
var getcategories = async function(){
  connection_categories = [];
  var lilist = [];
  await connectionsmongo.find({ }, 'connectionTopic', function (err, categories) {
  if (err) return handleError(err);
    lilist = categories;
});
lilist.forEach(function(item,index){
  if(!(connection_categories.includes(item.connectionTopic))){
    connection_categories.push(item.connectionTopic);
  }
});
 return connection_categories;
}

// get all connection objects list
var getConnections = async function(){
  var temp_con_list = [];
  var con_id_list = [];
  await connectionsmongo.find({}, function(err, cons){
          cons.forEach(function(item, index){
            if(!(con_id_list.includes(item.connectionID))){
                temp_con_list.push(item);
                con_id_list.push(item.connectionID);
            }
           });
         if(err){
           throw "no data present";
         }
       });;
       connections = [];
       temp_con_list.forEach(function (item, index) {
             connectionInfo1 = connectionInfo.connection(item.connectionID, item.connectionName, item.connectionTopic, item.connectionDetails, item.connectionHost, item.connectionDate, item.connectionTime, item.connectionLocation, item.userID);
             connections.push(connectionInfo1);
       });
  return connections;
}


// get connection object of particular ID
var getConnectionsID = async function(id){
  var coninfo1 = -1;
  await connectionsmongo.find({connectionID: id}, function(err, item1){
         item = item1[0];
         if(item == undefined){
           return coninfo1;
         }else{
           coninfo1 = connectionInfo.connection(item.connectionID, item.connectionName, item.connectionTopic, item.connectionDetails, item.connectionHost, item.connectionDate, item.connectionTime, item.connectionLocation, item.userID);
         }

         if(err){
           throw "no data present";
         }
       });;
   return coninfo1;
}


// check if the requested connection is valid
var isConnectionvalid = function(connection){
  connections.forEach(function (item, index) {
  if(item.connectionID == connection.connectionID){
          return true;
      }
  });
  return false;
}

// Add connection - with generating new ID
var addConnection = function(name, topic, details, host, date, time, location, userid){
    var lastid = connections[connections.length-1].connectionID;
    myArray = lastid.split(/([0-9]+)/).filter(Boolean);
    // To generate next id
    var id = myArray[0] + (parseInt(myArray[1],10)+1);
    var connew1 = new connectionsmongo({connectionID: id, connectionName: name, connectionTopic: topic, connectionDetails:details, connectionHost: host, connectionDate:date, connectionTime:time, connectionLocation:location, userID:userid});

    // save model to database
    connew1.save(function (err, connew) {
      if (err) return -1;
      console.log(connew.connectionID + " saved to connections collection.");
    });
    temp = connectionInfo.connection(id, name, topic, details, host, date, time, location, userid);
    connections.push(temp);
    return temp;
}

// Edit an exisiting connection
var editConnection = async function(conid, name, topic, details, host, date, time, location, userid){
    const filter = {connectionID: conid};
    const update = {connectionName: name, connectionTopic: topic, connectionDetails:details, connectionHost: host, connectionDate:date, connectionTime:time, connectionLocation:location, userID:userid};
    connectionsmongo.countDocuments(filter);
    let doc = await connectionsmongo.findOneAndUpdate(filter, update, {new:true, upsert:true});
    temp = connectionInfo.connection(conid, name, topic, details, host, date, time, location, userid);
    connections.push(temp);
    return temp;
}

// Delete an exisiting connection
var deleteConnection = async function(conid){
  let doc = await connectionsmongo.deleteOne({connectionID:conid}, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
});
 let doc1 = await userConnectionDB.userconnectionsmongo.deleteMany({connectionID:conid}, function(err){
   if (err) return handleError(err);
 });

console.log(doc);
}

module.exports.getConnections = getConnections;
module.exports.getConnectionsID = getConnectionsID;
module.exports.addConnection = addConnection;
module.exports.editConnection = editConnection;
module.exports.isConnectionvalid = isConnectionvalid;
module.exports.deleteConnection = deleteConnection;
module.exports.getcategories = getcategories;
