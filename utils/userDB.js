var userInfo = require('./../model/user');
var mongoose = require('mongoose');

// Hardcoded users
var users = [];

'use strict';
var crypto = require('crypto');

mongoose.connect('mongodb://127.0.0.1:27017/connections', {useNewUrlParser: true, useUnifiedTopology: true} );
mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log("Connected to DB connections");
});

var userSchema = new mongoose.Schema({
  userID : { type: String, required:true},
  userFirstName  : { type: String, required:true},
  userLastName : { type: String, required:true},
  userName : { type: String, required:true},
  userPassword : { type: String, required:true},
  userEmail: { type: String, required:false},
  userAddress1 : { type: String, required:false},
  userAddress2 : { type: String, required:false},
  userCity : { type: String, required:false},
  userState : { type: String, required:false},
  userZip : { type: String, required:false},
  userCountry : { type: String, required:false},
  userSalt : {type:String, required:true}
});

var usersmongo = mongoose.model('users', userSchema);

// sha12 hasing algorithm based on https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

// Get all users from DB
var getAllUsers = async function(){
  var temp_user_list = [];
  await usersmongo.find({}, function(err, users1){
          users1.forEach(function(item, index){
            if(!(temp_user_list.includes(item))){
              temp_user_list.push(item);
            }
          });
         if(err){
           throw "no data present";
         }
       });;
       users = [];
       temp_user_list.forEach(function (item, index) {
             userInfo1 = userInfo.user(item.userID, item.userFirstName, item.userLastName, item.userName, item.userPassword, item.userEmail, item.userAddress1, item.userAddress2, item.userCity, item.userState, item.userZip, item.userCountry);
             users.push(userInfo1);
       });
  return users;
}

// Check if a given user is valid
var isUserValid = async function(user){
  users = await getAllUsers();
  var l=false;
  users.forEach(function (item, index) {
  if(item.userID == user.userID){
          l = true;
      }
  });

}


// Check if a given user login is valid
var isUserLoginValid = async function(username, password){
  var l = false;
  await usersmongo.find({userName: username}, function(err, item1){
         item = item1[0];
         // the user entered password is hashed with salt for the username to validate
         var passwordcheck = sha512(password, item.userSalt);
         if(item.userPassword == passwordcheck.passwordHash){
           l = true
         }
         if(err){
           throw "no data present";
         }
       });;
   return l;
}

// get User object of the given userID
var getUser = async function(id){
  var userinfo1;
  await usersmongo.find({userID: id}, function(err, item){
         userinfo1 = userInfo.user(item.userID, item.userFirstName, item.userLastName, item.userName, item.userPassword, item.userEmail, item.userAddress1, item.userAddress2, item.userCity, item.userState, item.userZip, item.userCountry);
         if(err){
           throw "no data present";
         }
       });;
   return userinfo1;
}

// Add a new User, this function is called on POST request from SignUp page
var addUser = async function(userfirstName, userlastName, username, userpassword, useremail, useraddress1, useraddress2, usercity, userstate, userzip, usercountry, salt){
    let users = await getAllUsers();
    var lastid = users[users.length-1].userID;
    myArray = lastid.split(/([0-9]+)/).filter(Boolean);
    // To generate next id
    var id = myArray[0] + (parseInt(myArray[1],10)+1);
    var usernew1 = new usersmongo({userID:id, userFirstName: userfirstName, userLastName: userlastName, userName: username, userPassword:userpassword, userEmail: useremail, userAddress1:useraddress1, userAddress2:useraddress2, userCity:usercity, userState:userstate, userZip:userzip, userCountry:usercountry, userSalt:salt});

    // save model to database
    usernew1.save(function (err, usernew) {
      if (err) return -1;
      console.log(usernew.userName + " saved to users collection.");
    });
    userinfo1 = userInfo.user(id, userfirstName, userlastName, username, userpassword, useremail, useraddress1, useraddress2, usercity, userstate, userzip, usercountry, salt);
    users.push(userinfo1);
    return userinfo1;
}

var getRandromUserForLogin = async function(){
  let items = await getAllUsers();
  var item = items[Math.floor(Math.random()*items.length)];
  return item
}

// Get UserObject from the username
var getUserfromUsername = async function(username){
  var userinfo1;
  await usersmongo.find({userName: username}, function(err, item1){
        var item = item1[0];
         userinfo1 = userInfo.user(item.userID, item.userFirstName, item.userLastName, item.userName, item.userPassword, item.userEmail, item.userAddress1, item.userAddress2, item.userCity, item.userState, item.userZip, item.userCountry);
         if(err){
           throw "no data present";
         }
       });;
   return userinfo1;
}

module.exports.getUsers = getAllUsers;
module.exports.addUser = addUser;
module.exports.getRandromUserForLogin = getRandromUserForLogin;
module.exports.isUserValid = isUserValid;
module.exports.isUserLoginValid = isUserLoginValid;
module.exports.getUserfromUsername = getUserfromUsername;
