const bcrypt = require('bcrypt');

// Was not able to remove .join and let id be emptry string, caused errors.
const generateRandomString = function() {
  let id = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let x = 0; x <= 6; x++) {
    id.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  } return id.join("");
};

//Email checker function returns true or false if email was valid when compared in database.
const emailChecker = function(usersObj, userEmail) {
  for (let user in usersObj) {
    console.log(Object.keys(usersObj), "logging users");
    if (usersObj[user].email === userEmail) {
      return true;
    }
    
  } return false;
};

//Authenticator function which verifies user information and compares with database to allow login.
const authenticator = function(usersObj, userEmail, userPass) {
  for (let user in usersObj) {
    if (usersObj[user].email === userEmail) {
      if (bcrypt.compareSync(userPass, usersObj[user].password)) {
        return usersObj[user].id;
      }  return "Password Error";
    }
  } return "Email Error";
};

//Function which filters out all other user submitted URLS except for specific users.
const urlsUser = function(id, usersObj) {
  let newVars = {};
 
  for (let url in usersObj) {
    
    if (usersObj[url]['userID'] === id) {
      newVars[url] = usersObj[url];
      
    }
      
  }
  console.log(newVars);
  return newVars;
};


module.exports = { generateRandomString, emailChecker, urlsUser, authenticator };

 
 