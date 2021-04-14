const generateRandomString = function() {
  let id = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let x = 0; x <= 6; x++) {
    id.push(characters.charAt(Math.floor(Math.random()*characters.length)))
  } return id.join("")
 } 

 /*const emailChecker = function(usersObj, userEmail) {
  for (let user in usersObj) {
    console.log(Object.keys(usersObj), "logging users")
     if (usersObj[user].email === userEmail) {
      return true
      } 
    
  } return false
 /* let keys = Object.keys(usersObj)
  for (let key of keys) {
    if (usersObj[key].email === userEmail) {
      return true
    } 
  } return false
}*/

 module.exports = generateRandomString

 
 const users = {  C49cqkD: { id: 'C49cqkD', email: 'gb795@hotmail.com', password: 'admin' },
 UXSSGkm: { id: 'UXSSGkm', email: 'gb795@hotmail.com', password: 'admin9' }}
 
 //console.log(emailChecker(users, "gb795@hotmail.com"), "TEST2")