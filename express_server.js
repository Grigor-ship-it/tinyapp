const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const {generateRandomString} = require('./index');
const {authenticator} = require('./index');
const {urlsUser} = require('./index');
const cookieSession = require('cookie-session');
const {emailChecker} = require('./index');
const bcrypt = require('bcrypt');


app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Our current empty database
const urlDatabase = {};
  
//Our Users database, including placeholder users
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
};

//Our root get route displays only Hello!
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Our server is listenning!
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Json version of our url database.
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Our main urls page which requires a log in to access or else redirected to login/register page.
//It also calls on our urlsUser function to only display the users own URLs
app.get("/urls", (req, res) => {
  
  const userID = req.session.user_id;
  if (!userID) {
    res.redirect("/login");
  } else {
    const urlsOfUser = urlsUser(userID, urlDatabase);
 
    const templateVars = { urls: urlsOfUser, user: users[userID] };
    res.render("urls_index", templateVars);
  }
});

//Our page to submit new URLs to be shortened.
//Requires log in to access or else redirected to login/register page.
app.get("/urls/new", (req, res) => {
  
  const userID = req.session.user_id;
  
  const templateVars = { urls: urlDatabase, user: users[userID] };

  if (userID) {
    res.render("urls_new", templateVars);
  } else res.redirect("/urls");
});

//Our new user Register page. Sets user to null to be able to register accounts.
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null};
  res.render("urls_register", templateVars);
    
});

//Our login page which again sets user to null for login purposes.
app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null};
  res.render("urls_login", templateVars);
    
});

//Requires a userID set by the cookie session to access page or else redirected to login page.
app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/urls/");
  }
 
  let longurl = urlDatabase[req.params.shortURL].longURL;
  
  const userID = req.session.user_id;
  const templateVars = { shortURL: req.params.shortURL , longURL: longurl, user: users[userID] };
  
  res.render("urls_show", templateVars);
  
});

//If userID cookie matches the ID of our user database, it will allow for posting/updating URLs
//or else will be redirected
app.post("/urls/:shortURL", (req ,res) => {
  
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    const shortURL = req.params.shortURL;
    
    urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id};
    res.redirect(`/urls/${shortURL}/`);
  } else {
    res.redirect("/urls/");
  }
});


//Our main post path to create new URLs for our database. not accessible without a login
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id};
  
  res.redirect(`/urls/${shortURL}`);
});


//Our delete feature which requires a log in and also only master user can delete own URLs
app.post("/urls/:shortURL/delete", (req, res) => {
  
  
  if (req.session.user_id === urlDatabase[req.params.shortURL]['userID']) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls/");
});

//Our log in page and its logic for determining authentication.
//If authenticated our function assigns the cookie to our userID
app.post("/login", (req, res) => {
  
  if (authenticator(users, req.body.email, req.body.password) === "Email Error") {
    res.status(403).send("Error 403: Email not found");
  }
  if (authenticator(users, req.body.email, req.body.password) === "Password Error") {
    res.status(403).send("Error 403: Password does not match");
  }
  
  req.session.user_id = (authenticator(users, req.body.email, req.body.password));
  
  res.redirect("/urls/");
});

//Our logout feature which erases saved cookie
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  
  res.redirect("urls");
});

//Our registration page which returns given error when specific parameters arent met.
//Email check will verify if email already exists or not in order to create a new user.
app.post("/register", (req, res) => {
  
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error 400 Bad Request");
  }
  if (emailChecker(users, req.body.email) === true) {
    return res.status(400).send("Error 400, Email is already in use");
  }
  const userID = generateRandomString();
  users[userID] = {id: userID, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
  req.session.user_id =  userID;
  
  res.redirect("urls");
  
});

//Our edit page route. Requires a login
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  
  res.redirect(longURL);
});