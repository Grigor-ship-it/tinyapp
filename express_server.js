const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const generateRandomString = require('./index')
const cookieParser = require("cookie-parser");

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const username = req.cookies.name
  
const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies.name
  
  const templateVars = { urls: urlDatabase, username: username }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies.name
  const templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL], username: username };
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