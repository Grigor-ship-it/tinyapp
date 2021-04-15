const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const {generateRandomString} = require('./index')
const cookieParser = require("cookie-parser");
const {emailChecker} = require('./index')

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const authenticator = function(usersObj, userEmail, userPass) {
  for (let user in usersObj) {
   if (usersObj[user].email === userEmail) {
    if (usersObj[user].password === userPass) {
      return usersObj[user].id
    }  return "Password Error"
   }
} return "Email Error"
}    
     

const urlDatabase = {
  //"b2xVn2": "http://www.lighthouselabs.ca",
  //"9sm5xK": "http://www.google.com"
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

  if (userID) {
  res.render("urls_new", templateVars);
  } else res.redirect("/urls")
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null}
  res.render("urls_register", templateVars);
    
})

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null}
  res.render("urls_login", templateVars);
    
})

app.get("/urls/:shortURL", (req, res) => {
  
  let longurl = urlDatabase[req.params.shortURL].longURL
  console.log("shortURL")
  const userID = req.cookies.user_id
  const templateVars = { shortURL: req.params.shortURL , longURL: longurl, user: users[userID] };
  //console.log(longurl.longURL)
  res.render("urls_show", templateVars);
  
});

app.post("/urls/:shortURL", (req ,res) => {
  
  const shortURL = req.params.shortURL 
 
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.cookies.user_id};
  res.redirect(`/urls/${shortURL}/`)
  
})



app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  console.log(longURL)
  urlDatabase[shortURL]= { longURL: longURL, userID: req.cookies.user_id};
  
  res.redirect(`/urls/${shortURL}`);         
});



app.post("/urls/:shortURL/delete", (req, res) => {
  
  delete urlDatabase[req.params.shortURL]
   
   res.redirect("/urls/")
});

app.post("/login", (req, res) => {
  
  if(authenticator(users, req.body.email, req.body.password) === "Email Error") {
    res.send("Error 403: Email not found")
  };
  if(authenticator(users, req.body.email, req.body.password) === "Password Error") {
    res.send("Error 403: Password does not match")
  };
  
    res.cookie('user_id', (authenticator(users, req.body.email, req.body.password)))
  
  res.redirect("/urls/")
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("urls")
})

app.post("/register", (req, res) => {
  //console.log(req.body.email, "Emails")
  if (!req.body.email || !req.body.password){
    return res.send("Error 400 Bad Request")
  } //console.log(emailChecker(users, req.body.email), "Register Test")
  if (emailChecker(users, req.body.email)=== true) {
    return res.send("Error 400, Email is already in use")
  }
  const userID = generateRandomString();
  users[userID] = {id: userID, email: req.body.email, password: req.body.password}
  res.cookie('user_id', userID)
  console.log(users, "Users")
  res.redirect("urls")
  
})
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  console.log(longURL)
  console.log(req.params.shortURL)
  res.redirect(longURL);
});