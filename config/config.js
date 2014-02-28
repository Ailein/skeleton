'use strict';

/**
 * Why like this?
 *
 *  - all environmental vars documented in one place
 *  - If I use "." notation it's easy to cut/paste into code
 *  - Unlike JSON, js allows comments (what is this setting for?)
 */


/**
 * Configuration File
 */

var config            = {};

config.port           = process.env.PORT || 3000;
config.ga             = 'UA-44765020-2';

/**
 * Logging Configuration
 */

config.logging        = false;
config.logfilename    = process.env.LOGFILE ||'skeleton.log';

/**
 * Database Configuration
 */

config.mongodb        = {};
config.mongodb.url    = process.env.MONGODB_URL || 'localhost';

/**
 * Session Configuration
 */

var hour              = 3600000;
var day               = (hour * 24);
var week              = (day * 7);

config.session        = {};
config.session.secret = process.env.SESSION_SECRET || 'nLz8gSz7DHv3fDU3LIp60G';
config.session.maxAge = process.env.SESSION_MAX_AGE || week;

/**
 * Throttle Login Attempts
 */

config.loginAttempts              = {};
config.loginAttempts.forIp        = 50;
config.loginAttempts.forUser      = 5;
config.loginAttempts.expires      = '20m';

/**
 * Mailing Configuration
 */

// Who are we sending email as?
config.smtp                       = {};
config.smtp.name                  = process.env.SMTP_FROM_NAME || 'Skeleton';
config.smtp.address               = process.env.SMTP_FROM_ADDRESS || 'skeleton@skeleton.com';

// How are we sending it?
config.gmail                      = {};
config.gmail.user                 = process.env.SMTP_USERNAME || 'you@gmail.com';
config.gmail.password             = process.env.SMTP_PASSWORD || 'appspecificpassword';

/**
 * API Keys
 */

// New York Times
config.nyt                        = {};
config.nyt.key                    = process.env.NYT_KEY || '';

// Last FM
config.lastfm                     = {};
config.lastfm.api_key             = process.env.LASTFM_KEY || '';
config.lastfm.secret              = process.env.LASTFM_SECRET || '';

// Steam
config.steam                      = {};
config.steam.id                   = process.env.STEAM_ID || '';
config.steam.key                  = process.env.STEAM_KEY || '';

// Twilio
config.twilio                     = {};
config.twilio.sid                 = process.env.TWILIO_SID || '';
config.twilio.token               = process.env.TWILIO_TOKEN || '';
config.twilio.phone               = process.env.TWILIO_PHONE || '';

// Tumblr
config.tumblr                     = {};
config.tumblr.key                 = process.env.TUMBLR_KEY || '';
config.tumblr.secret              = process.env.TUMBLR_SECRET || '';
config.tumblr.callbackURL         = process.env.TUMBLR_URL || '/auth/tumblr/callback';

// Foursquare
config.foursquare                 = {};
config.foursquare.clientId        = process.env.FOURSQUARE_KEY || '';
config.foursquare.clientSecret    = process.env.FOURSQUARE_SECRET || '';
config.foursquare.redirectUrl     = process.env.FOURSQUARE_URL || 'http://localhost:3000/auth/foursquare/callback';

// Paypal
config.paypal                     = {};
config.paypal.host                = process.env.PAYPAL_HOST || 'api.sandbox.paypal.com';
config.paypal.client_id           = process.env.PAYPAL_KEY || '';
config.paypal.client_secret       = process.env.PAYPAL_SECRET || '';
config.paypal.returnUrl           = process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/api/paypal/success';
config.paypal.cancelUrl           = process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/api/paypal/cancel';

/**
 * Authorization Configuration
 */

config.localAuth = true;

// Facebook
config.facebookAuth = true;
config.facebook                   = {};
config.facebook.clientID          = process.env.FACEBOOK_KEY || '';
config.facebook.clientSecret      = process.env.FACEBOOK_SECRET || '';

// Github
config.githubAuth = true;
config.github                     = {};
config.github.clientID            = process.env.GITHUB_KEY || '';
config.github.clientSecret        = process.env.GITHUB_SECRET || '';

// Twitter
config.twitterAuth = true;
config.twitter                    = {};
config.twitter.consumerKey        = process.env.TWITTER_KEY || '';
config.twitter.consumerSecret     = process.env.TWITTER_SECRET || '';

// Google
config.googleAuth = true;
config.google                     = {};
config.google.clientID            = process.env.GOOGLE_KEY || '';
config.google.clientSecret        = process.env.GOOGLE_SECRET || '';

module.exports = config;
