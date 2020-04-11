var user = function(id, firstname, lastname, username, password, email, address1, address2, city, state, zip, country, salt){
var userInfo = {userID:id,
  userFirstName:firstname,
  userLastName:lastname,
  userName:username,
  userPassword:password,
  userEmail:email,
  userAddress1:address1,
  userAddress2:address2,
  userCity:city,
  userState:state,
  userZip:zip,
  userCountry:country,
  userSalt:salt
};
return userInfo;
};

module.exports.user = user;
