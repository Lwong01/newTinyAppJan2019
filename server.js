var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set("view engine", "ejs")


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Generating random string for the url
function generateRandomString() {
  var ranString = " ";
  var orderString = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'";

  for (var x = 0; x < 7; x++) {
    ranString += orderString.charAt(Math.floor(Math.random() * orderString.length));
  };
  return ranString;
};

//shows the url to the urls_index //
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies.username});
});

app.post("/urls", (req, res) => {
  console.log('dsfsdfsfsfsfsdf')
  let longU = req.body.longURL;
  let shortU = generateRandomString();
  urlDatabase[shortU] = longU;
  res.redirect(`urls/${shortU}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});
// delete the url //
app.post("/urls/:id/delete", (req, res) => {
  let shorturl = req.params.id;
  delete urlDatabase[shorturl];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  //console.log('hoorah');
  let shorturl = req.params.id;
  //console.log('short',shorturl);
  urlDatabase[shorturl] = req.body.longURL;
  res.redirect("/urls/");
})

app.post("/login", (req, res) => {
  console.log(req.body);
  res.cookie("username", req.body.username);
  res.redirect("/urls/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls/");
});

app.listen(PORT, () => {
  console.log(`new server app is listening on port ${PORT}!`);
});


