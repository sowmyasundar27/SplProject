var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

'use strict';
var crypto = require('crypto');

var userDB = require('./../utils/userDB');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

// Based on https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('salt' + salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
    return passwordData;
}

router.get('/*', function(req,res){
  res.render('signup', {data:"", loggedin:false});
});

// Validations for POST request
router.post('/*', [check('userfirstname').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('userlastname').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('username').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('userpassword').not().isEmpty().withMessage(' can not be empty')
.isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('useremail').isLength({max: 30}).withMessage(' can only be maximum of 30 characters').trim(),
check('useraddress1').isLength({max: 30}).withMessage(' can only be maximum of 30 characters').trim(),
check('useraddress2').isLength({max: 30}).withMessage(' can only be maximum of 30 characters').trim(),
check('usercity').isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('userstate').isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('userzip').isNumeric().withMessage(' can only be only numbers')
.isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim(),
check('usercountry').isLength({max: 20}).withMessage(' can only be maximum of 20 characters').trim()
], async function(req,res){

  const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.render('signup', {data:errors.array()[0].param.toUpperCase() + errors.array()[0].msg , loggedin:false});
   }
   var passwordData = saltHashPassword(req.body.userpassword);
   //save the hashed password for user creation

  var newuser = -1;
  newuser = userDB.addUser(req.body.userfirstname, req.body.userlastname,
    req.body.username, passwordData.passwordHash, req.body.useremail, req.body.useraddress1, req.body.useraddress2, req.body.usercity, req.body.userstate, req.body.userzip, req.body.userCountry, passwordData.salt);
  if(newuser!=-1){
    res.render('login', {data: "User created Succesfully. Login once using the created user", loggedin:false});
  }else{
    res.render('signup', {data: "User not added", loggedin:false});
  }

});


module.exports = router;
