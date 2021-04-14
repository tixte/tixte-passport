# tixte-passport

[Passport](http://passportjs.org/) strategy for authenticating with [Tixte](https://tixte.com?ref=psprt)
using OAuth v2.

This module allows you to integrate Tixte oauth into your Passport, Node.js code.
Getting started is super simple, and you can get up and running in under 5 minutes.

## Installation

```bash
npm install tixte-passport
```

## Usage

#### Requirements

To use this module, you must have a Tixte developer application, which can be created on the dashboard.

#### Configure Strategy

The Tixte authentication strategy authenticates users through their Tixte account and OAuth 2.0 tokens.
The client ID and secret obtained when creating an application are supplied as options when creating the strategy. 
The strategy also requires a `verify` callback, which receives the access token and optional refresh token, 
as well as `profile` which contains the authenticated user's Tixte profile. 
The `verify` callback must call `cb` providing a user to complete authentication.

```js
const TixteStrategy = require("tixte-passport").Strategy;
 
passport.use(new TixteStrategy({
    clientID: "<client id>",
    clientSecret: "<client secret>",
    callbackURL: "<callback url>",
    scope: ["identity", "email"] //specify whatever scopes you need
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ tixteUID: profile.id }, function(err, user) {
        return cb(err, user);
}));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'tixte'` strategy to
authenticate requests.

For example, you could implement it with [Express](http://expressjs.com/) as such:

```js
app.get("/login", passport.authenticate("tixte"));

app.get("/callback", passport.authenticate("tixte", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/"); //redirect on successful authentication
  });
```