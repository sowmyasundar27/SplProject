var connection = function(id, name, topic, details, host, date, time, location, userid){
var connectionInfo = {connectionID:id,
  connectionName:name,
  connectionTopic:topic,
  connectionDetails:details,
  connectionHost:host,
connectionDate:date,
connectionTime:time,
connectionLocation:location,
userID:userid};
return connectionInfo;
};

module.exports.connection = connection;
