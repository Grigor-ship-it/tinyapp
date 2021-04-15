const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const {generateRandomString} = require('./index')
const cookieSession = require('cookie-session')
const {emailChecker} = require('./index')
const bcrypt = require('bcrypt');

//app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const authenticator = function(usersObj, userEmail, userPass) {
  for (let user in usersObj) {
   if (usersObj[user].email === userEmail) {
    if (bcrypt.compareSync(userPass, usersObj[user].password)) {
      return usersObj[user].id
    }  return "Password Error"
   }
} return "Email Error"
}    

const urlsUser = function(id) {
  let newVars = {}
 
    for (let url in urlDatabase) {
      //console.log(urlDatabase[url]['userID'], "test")
        if (urlDatabase[url]['userID'] === id) {
          newVars[url] = urlDatabase[url] 
         // newVars[user].longURL = database[user].Longurl
        }
      
    } 
    console.log(newVars)
    return newVars
    
  
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
  
  const userID = req.session.user_id
  if (!userID) {
    res.redirect("/login")
  } else { 
    const urlsOfUser = urlsUser(userID)
 
const templateVars = { urls: urlsOfUser, user: users[userID] }; 
  res.render("urls_index", templateVars); 
  }
});

app.get("/urls/new", (req, res) => {
  
  const userID = req.session.user_id
  
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
  if (!req.session.user_id) {
    res.redirect("/urls/")
  }
 
  let longurl = urlDatabase[req.params.shortURL].longURL
  //console.log("shortURL")
  const userID = req.session.user_id
  const templateVars = { shortURL: req.params.shortURL , longURL: longurl, user: users[userID] };
  //console.log(longurl.longURL)
  res.render("urls_show", templateVars);
  
});

app.post("/urls/:shortURL", (req ,res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].id) {
  const shortURL = req.params.shortURL 
 
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}/`)
  } else {
    res.redirect("/urls/")
  }
})



app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  //console.log(longURL)
  urlDatabase[shortURL]= { longURL: longURL, userID: req.session.user_id};
  
  res.redirect(`/urls/${shortURL}`);         
});



app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.session.user_id)
  console.log(urlDatabase[req.params.shortURL]['userID'])
  if (req.session.user_id === urlDatabase[req.params.shortURL]['userID']) {
  delete urlDatabase[req.params.shortURL]
  }
   res.redirect("/urls/")
});

app.post("/login", (req, res) => {
  
  if(authenticator(users, req.body.email, req.body.password) === "Email Error") {
    res.status(403).send("Error 403: Email not found")
  };
  if(authenticator(users, req.body.email, req.body.password) === "Password Error") {
    res.status(403).send("Error 403: Password does not match")
  };
  
    req.session.user_id = (authenticator(users, req.body.email, req.body.password))
  
  res.redirect("/urls/")
})

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  
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
  users[userID] = {id: userID, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)}
  req.session.user_id =  userID
  console.log(users, "Users")
  res.redirect("urls")
  
})
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  //console.log(longURL)
  //console.log(req.params.shortURL)
  res.redirect(longURL);
});