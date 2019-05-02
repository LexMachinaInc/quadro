// save environment variables in dotenv
require("dotenv").config();
// Import the express lirbary
const express = require("express");
// express session
const session = require("express-session");
// node core module, construct query string
const qs = require("querystring");
// generates a random string for the
const randomString = require("randomstring");

// Import the axios library, to make HTTP requests
const axios = require("axios");

// setting up port and redirect url from process.env
// makes it easier to deploy later
const port = process.env.PORT || 8080;
// This is the client ID, client secret and redirect URL obtained
// while registering the Oauth app with Github
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URL;
// To create a unique session object with an expiration
const sessionObj = {
  genid: function(req) {
    return randomString.generate()
  },
  secret: randomString.generate(),
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
};
// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express();

app.use(express.static("build"));

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionObj.cookie.secure = true; // serve secure cookies
}

// initializes session
app.use(session(sessionObj));

app.get("/login", (req, res) => {
  req.session.csrf_string = randomString.generate();
  req.session.query = req.query;
  // construct the GitHub URL you redirect your user to.
  // qs.stringify is a method that creates foo=bar&bar=baz
  // type of string for you.
  const githubAuthUrl = `https://github.com/login/oauth/authorize?${
    qs.stringify({
      client_id: clientID,
      redirect_uri: redirectURI,
      state: req.session.csrf_string,
      scope: "user repo"
    })}`;
  // redirect user with express
  res.redirect(githubAuthUrl);
});

app.get("/authenticated", (req, res) => {
  const token = req.session.access_token || null;
  res.json({ token })
});

app.get("/logout", (req, res) => {
  req.session.destroy(function() {
    res.json({ logout: "success" });
  })
});

app.get("/oauth/redirect", (req, res) => {
  const requestToken = req.query.code;
  const returnedState = req.query.state;

  // Checking that the state string we sent with Github authentication
  // is the same that we're getting back to prevent CSRF attacks
  if (req.session.csrf_string === returnedState) {

    const params = qs.stringify({
      client_id: clientID,
      client_secret: clientSecret,
      code: requestToken
    });

    axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?${params}`,
      // Setting content type header, so that we get the response in JSON
      headers: {
        accept: "application/json"
      }
    }).then((response) => {
      // Once we get the response, extract the access token from
      // the response body
      const accessToken = response.data.access_token;
      // Saving token to session
      req.session.access_token = accessToken;
      // Sending user back to home page, where App component
      // will mount again and check for authentication before
      // routing user to appropriate page
      res.redirect("/?redirecting");
    });
  } else {
    req.session.destroy(function() {
      res.redirect("/?authentication_failed");
    })
  }
});

// Start the server on port 8080
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
