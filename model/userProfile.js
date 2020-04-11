var userConnectionInfo = require('./userConnection');

class UserProfile {
  constructor(userid, userConnections) {
    this.userid = userid;
    this.Connectionsofuser = userConnections ;
  }

  Connectionpresent(Connection, rsvp){
    this.Connectionsofuser.forEach(function (item, index) {
    if(item.usersConnection.connectionID == Connection.connectionID && item.userConnectionrsvp == rsvp){
         return true;
        }
    });
    return false
  }
  updateConnection(Connection, rsvp){
    this.Connectionsofuser.forEach(function (item, index) {
    if(item.usersConnection.connectionID == Connection.connectionID){
         item.userConnectionrsvp = rsvp;
        }
    });
  }

  emptyProfile(){
    //this.userid = null;
    this.Connectionsofuser = [];
  }

  addConnection(Connection, rsvp) {
    if (getConnections == []){
      userconnectionInfotemp = userConnectionInfo.userConnection(Connection, rsvp);
      this.Connectionsofuser.push(userconnectionInfotemp)
    }else{
      if(this.Connectionpresent(Connection, rsvp)){
        updateConnection(Connection, rsvp);
      }else{
        userconnectionInfotemp = userConnectionInfo.userConnection(Connection, rsvp);
        this.Connectionsofuser.push(userconnectionInfotemp)
      }
    }
  }

  getConnection(){
    return this.Connectionsofuser
  }

  removeConnection(Connection) {
      this.Connectionsofuser.forEach(function (item, index) {
      if(item.usersConnection.connectionID == Connection.connectionID){
           delete this.Connectionsofuser[index];
          }
      });

    }

}


module.exports.UserProfile = UserProfile;
