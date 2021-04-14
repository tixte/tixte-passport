/* Import Dependencies */
const OAuth2Strategy = require("passport-oauth2");
const util = require("util");

/* Define Additional Configuration */
const config = {
    endpoints: {
        authorizationURL: "https://tixte.com/oauth/authorize",
        tokenURL: "https://api.tixte.com/v1/oauth/token?passport=true",
        profileURL: "https://api.tixte.com/v1/users/@me"
    }
};

/**
 @typedef {Object} StrategyOptions
 @property {string} clientID
 @property {string} clientSecret
 @property {string} callbackURL
 @property {Array} scope
 @property {string} [scopeSeparator=" "]
**/

function Strategy(options, verify) {
   options = options || {};
   options.authorizationURL = config.endpoints.authorizationURL;
   options.tokenURL = config.endpoints.tokenURL;
   options.scopeSeparator = options.scopeSeparator || " ";
   options.customHeaders = options.customHeaders || {};

   if (!options.customHeaders["User-Agent"]) {
    options.customHeaders["User-Agent"] = options.userAgent || "tixte-passport";
   }

   OAuth2Strategy.call(this, options, verify);
   this.name = "tixte";
   this._userProfileURL = options.userProfileURL || config.endpoints.profileURL;
   this._oauth2.useAuthorizationHeaderforGET(true);
}

/* Inherit Util */
util.inherits(Strategy, OAuth2Strategy);

/**
 @param {string} accessToken
 @param {function} done
 @access protected
**/

Strategy.prototype.userProfile = function(accessToken, done) {
   let self = this;
   this._oauth2.get(config.endpoints.profileURL, accessToken, function(err, body, res) {
       if (err) {
           return done(new OAuth2Strategy.InternalOAuthError("Failed to fetch user profile", err));
       }

       try {
           let data = JSON.parse(body).data;
           data.provider = "tixte";
           data.accessToken = accessToken;
           return done(null, data);
       }
       catch (e) {
           return done(new Error("Failed to parse user profile response"));
       }

   });
};

/* Export Strategy */
module.exports = Strategy;