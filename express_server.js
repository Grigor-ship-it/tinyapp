const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const generateRandomString = require('./index')
const cookieParser = require("cookie-parser");
//const emailChecker = require('./index')

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const emailChecker = function(usersObj, userEmail) {
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
  } return false*/
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
//console.log(emailChecker(users, "gb795@hotmail.com"), "TEST")
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id
 // console.log(req.cookies)
const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies.user_id
  
  const templateVars = { urls: urlDatabase, user: users[userID] }
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null}
  res.render("urls_register", templateVars);
    
})

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies.user_id
  const templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL], user: users[userID] };
  res.render("urls_show", templateVars);
  
});

app.post("/urls/:shortURL", (req ,res) => {
  
  const shortURL = req.params.shortURL 
  
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}/`)
})



app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  
  urlDatabase[shortURL] = longURL;
 
  res.redirect(`/urls/${shortURL}`);         
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  
  delete urlDatabase[req.params.shortURL]
   
   res.redirect("/urls/")
});

app.post("/urls/:shortURL/edit", (req, res) => {
  
  const shortURL = req.params.shortURL 
 
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}/`)
});

app.post("/login", (req, res) => {
  
  res.cookie('name', req.body.username)
  res.redirect("/urls/")
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("urls")
})

app.post("/register", (req, res) => {
  console.log(req.body.email, "Emails")
  if (!req.body.email || !req.body.password){
    return res.send("Error 400 Bad Request")
  } console.log(emailChecker(users, req.body.email), "Register Test")
  if (emailChecker(users, req.body.email)=== true) {
    return res.send("Error 400, Email is already in use")
  }
  const userID = generateRandomString();
  users[userID] = {id: userID, email: req.body.email, password: req.body.password}
  res.cookie('user_id', userID)
  console.log(users, "Users")
  res.redirect("urls")
  
})
