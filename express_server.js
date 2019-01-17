
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

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



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log('dsfsdfsfsfsfsdf')
  let longU = req.body.longURL;
  let shortU = generateRandomString();
  urlDatabase[shortU] = longU;
  res.redirect(`urls/${shortU}`);
});

//shows the url to the urls_index //
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//display ID and long urls//
//the shortURL req.params is from express, .id is basically the express is going to know there is something on the url that comes after the /urls/___. the :id is .id in the shortURL.
// for example /urls/9sm5xK, the :id from the url is 9sm5xK, which is the shortURL. The longURL is basically asking the object urlDatabase to look for the key "9sm5xk" and print out the value.
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

// delete the url //
app.post("/urls/:id/delete", (req, res) => {
  let shorturl = req.params.id;
  delete urlDatabase[shorturl];
  res.redirect("/urls");
});


app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  res.redirect(longURL);
});



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls/:id"), (req, res) => {
  // let shorturl = req.params.id;
  // console.log('short',shorturl);
  // urlDatabase[shorturl] = req.body.longURL;
  // res.redirect("/urls/");
}

app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});




//put urls into the urlDatabase //
//templateVars has an object. You pass it into render through express. The first parameter is the ejs file name. In the hello_world.ejs, you have a key of an object from templateVars.

// app.get("/urls", (req, res) => {
//   let templateVars = { greeting: 'Hello World!' };
//   res.render("hello_world", templateVars);
// });