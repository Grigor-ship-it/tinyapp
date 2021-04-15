const generateRandomString = function() {
  let id = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let x = 0; x <= 6; x++) {
    id.push(characters.charAt(Math.floor(Math.random()*characters.length)))
  } return id.join("")
 } 

 const emailChecker = function(usersObj, userEmail) {
  for (let user in usersObj) {
    console.log(Object.keys(usersObj), "logging users")
     if (usersObj[user].email === userEmail) {
      return true
      } 
    
  } return false
}

const authenticator = function(usersObj, userEmail, userPass) {
  for (let user in usersObj) {
    console.log(Object.keys(usersObj), "logging users")
     if (usersObj[user].email !== userEmail) {
      return "Error 403: Email can not be found"
      } 
     if (usersObj[user].password !== userPass && usersObj[user].email === userEmail) {
       return "Error 403: Password does not match"
     }
    if (usersObj[user].password === userPass && usersObj[user].email === userEmail) {
   //res.cookie('user_id', usersObj[user].id)
   return 'looks good'
    }
} return "no operation"
}

 module.exports = { generateRandomString, emailChecker }

 
 const users = {  C49cqkD: { id: 'C49cqkD', email: 'gb795@hotmail.com', password: 'admin' },
 UXSSGkm: { id: 'UXSSGkm', email: 'gb795@hotmail.com', password: 'admin9' }}
 
 //console.log(authenticator(users, "gb795@hotmail.com", "admin"))