const generateRandomString = function() {
  let id = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let x = 0; x <= 6; x++) {
    id.push(characters.charAt(Math.floor(Math.random()*characters.length)))
  } return id.join("")
 } 

 module.exports = generateRandomString;