var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['123'],
}));

app.set("view engine", "ejs")


var urlDatabase = {
  "b2xVn2": {
    longurl: "http://www.lighthouselabs.ca",
    userID: "Leon"
  },

  "9sm5xK": {
    longurl: "http://www.google.com",
    userID: "Tiffany"
  },

};

// let urlDatabaseTemp = {
//   "2x":{
//     shortURL: "2x",
//     longURL: "http://www.microsoft.com",
//     userID: "123x"
//   }
// }

let users = {
  "Leon": {
    id: "Leon",
    email: "leon@123.com",
    password: bcrypt.hashSync("Leon123", 10)
  },
  "Tiffany": {
    id: "Tiffany",
    email: "tiffany@123.com",
    password: bcrypt.hashSync("Tiffany123", 10)
  }
};

//Generating random string for the url
function generateRandomString() {
  var ranString = "";
  var orderString = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'";

  for (var x = 0; x < 7; x++) {
    ranString += orderString.charAt(Math.floor(Math.random() * orderString.length));
  };
  return ranString;
};

//check if the email is taken //
function emailTaken(email) {
  for (var userID in users) {
    if (users[userID].email === email) {
      return true;
    }
  }
  return false;
};

//Function to check which email and password is correct
function confirmEmailPassword(email, password) {
  for (var user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return users[user];
    }
  }
  return false;
};

// URLS for SPECIFIC USER
function urlsForUser(id){
  let dataObject = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      let temp = {
        shortURL: url,
        longURL: urlDatabase[url].longurl
      }
      dataObject[url] = temp;
    }
  }
  return dataObject;
}

// Login page //
app.get("/login", (req, res) => {
  res.render("login");
});

// Login section //
app.post("/login", (req, res) => {
  let username = req.body.email;
  let userPassword = req.body.password;
  const user = confirmEmailPassword(username, userPassword)
  console.log(user);
  if (username === "" || userPassword === "") {
    res.status(400);
    res.send("Please enter your username and password! Don't BE A JERK")

  } else if (user) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(400);
  }
});

// Logout //
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls/");
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

// Registration section //
app.get("/register", (req, res) => {
  res.render("registration");
});

app.post("/register", (req, res) => {

  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Please provide an email and password to login")


  } else if (emailTaken(req.body.email) === true) {
    res.send("Pick another email");

  } else {
    let id = generateRandomString();
    users[id] = {
      "id": id,
      "email": req.body.email,
      "password": bcrypt.hashSync(req.body.password, 10),

    }
    // console.log(req.body.email, req.body.password);
    req.session.user_id = id;
    res.redirect("urls");
  };

});

//shows the url to the urls_index //
app.get("/urls", (req, res) => {
  let user_id = req.session.user_id;
  console.log("This is the user ID", user_id);
  let urlsUser = urlsForUser(user_id);
  console.log("this is the object", urlsUser);

  let templateVars = {
    urls: urlsUser,
    user_id: user_id,
    user: users[user_id]
  };
    res.render("urls_index", templateVars);

});

// Creating short url //
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longurl: longURL,
    userID: req.session.user_id
  }
  console.log("THIS IS THE URL DATABASE", urlDatabase);
  res.redirect('/urls/');
});

// New url generater //
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  console.log(user_id);
  if(user_id){
    let templateVars = {
      urls: urlDatabase,
      userID: user_id,
      user: users[user_id]
    };
    console.log("This is the templateVar:", templateVars);
    res.render("urls_new", templateVars);

  }else{
    res.redirect("/login");
  }
});



// REDIRECT THE SHORT URL TO LONG //
app.get("/u/:shortURL", (req, res) => {
  let shorturl = req.params.shortURL;
  let longURL = (urlDatabase[shorturl] || { longurl: '/notfound' }).longurl;
  if (shorturl) {
    res.redirect(longURL);
  } else {
    res.status("404").send('Not found');
  }
});

// View Short URL //
app.get("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longurl,
    user_id: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_show", templateVars);
  }
});

// Update Short Url //
app.post("/urls/:id", (req, res) => {
  let shorturl = req.params.id;
  urlDatabase[shorturl].longurl = req.body.longURL;
  res.redirect("/urls/");
})

// delete the url //
app.post("/urls/:id/delete", (req, res) => {
  let shorturl = req.params.id;
  delete urlDatabase[shorturl];
  res.redirect("/urls");
});


// Listen Port //
app.listen(PORT, () => {
  console.log(`new server app is listening on port ${PORT}!`);
});


