'use strict';

/**
 * Module Dependencies
 */

var User          = require('../models/User');
var utils         = require('../config/utils');
var config        = require('../config/config');
var passport      = require('passport');
var passportConf  = require('../config/passport');

/**
 * Enhanced Security Controller
 */

module.exports.controller = function (app) {

  /**
   * GET /setup-otp (requires authentication)
   */

  app.get('/setup-otp', passportConf.isAuthenticated, function (req, res) {

    // Prevent someone from seeing your QR code if enhanced security is *already* enabled.
    // Otherwise they could make it display if they knew the URL and had access to your
    // machine while you were already logged in.
    if (req.user.enhancedSecurity.enabled) {
      req.flash('info', { msg: 'You already enabled enhanced security.' });
      return res.redirect('back');
    }

    var key;
    if (typeof req.user.enhancedSecurity.token === 'undefined') {
      // Generate a new key
      key = utils.randomKey(10);
    } else {
      // use existing key
      key = req.user.enhancedSecurity.token;
    }

    var encodedKey = utils.encode(key);

    // Generate QR code
    // Reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat
    var otpUrl = 'otpauth://totp/' + config.name + ':%20' + req.user.email + '?issuer=' + config.name + '&secret=' + encodedKey + '&period=30';
    var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);

    // Save the key for the user
    User.findById(req.user.id, function (err, user) {
      if (err) {
        req.flash('error', { msg: err.message });
        return (err);
      }

      user.enhancedSecurity.token = key;
      user.enhancedSecurity.period = 30;
      user.activity.last_updated = Date.now();

      user.save(function (err) {
        if (err) {
          req.flash('error', { msg: err.message });
          return (err);
        }
      });

    });

    // Render setup page
    res.render('account/setup-otp', {
      user: req.user,
      url: '/administration', // to set navbar active state
      key: encodedKey,
      qrImage: qrImage
    });

  });

/**
   * GET /verify-otp-first (requires authentication)
   *
   *   Ensure that OTP works for user
   *   BEFORE we turn on enhanced security!
   */

  app.get('/verify-otp-first', passportConf.isAuthenticated, function (req, res) {
    res.render('account/verify-otp-first', {
      url: '/administration', // to set navbar active state
      user: req.user
    });
  });

  /**
   * POST /verify-otp-first (requires authentication)
   *
   *   If the code is verified then turn on enhanced security
   */

  app.post('/verify-otp-first', passportConf.isAuthenticated, function (req, res, next) {
    passport.authenticate('totp', function (err, user, info) {
      if (err) {
        req.flash('errors', { msg: err.message });
        return res.redirect('back');
      } else {
        // Log user in
        req.logIn(user, function(err) {
          if (err) {
            req.flash('errors', { msg: 'That code did not work.' });
            return res.redirect('back');
          } else {

            // Finalize enabling enhanced security
            User.findById(req.user.id, function (err, user) {
              if (err) {
                req.flash('error', { msg: err.message });
                return (err);
              }

              user.enhancedSecurity.enabled = true;
              user.activity.last_updated = Date.now();

              user.save(function (err) {
                if (err) {
                  req.flash('error', { msg: err.message });
                  return (err);
                }
              });

            });

            // Save the fact that we have authenticated via two factor
            req.session.passport.secondFactor = 'totp';

            // Complete enhanced security setup
            res.redirect('/complete-otp');
          }
        });
      }
    })(req, res, next);
  });

  /**
   * GET /complete-otp (requires authentication)
   *
   *   Complete OTP setup with the user
   */

  app.get('/complete-otp', passportConf.isAuthenticated, function (req, res) {
    res.render('account/complete-otp', {
      url: '/administration', // to set navbar active state
      user: req.user
    });
  });

  /**
   * GET /verify-otp
   */

  app.get('/verify-otp', function (req, res) {
    res.render('account/verify-otp', {
      url: '/administration', // to set navbar active state
      user: req.user
    });
  });

  /**
   * POST /verify-otp
   *
   *   Verify OTP Password
   */

  app.post('/verify-otp', function (req, res, next) {
    passport.authenticate('totp', function (err, user, info) {
      if (err) {
        req.flash('errors', { msg: err.message });
        return res.redirect('back');
      } else {
        // Log user in
        req.logIn(user, function(err) {
          if (err) {
            req.flash('errors', { msg: 'That code did not work.' });
            return res.redirect('back');
          } else {
            // Save the fact that we have authenticated via two factor
            req.session.passport.secondFactor = 'totp';
            // Send user on their merry way
            if (req.session.attemptedURL) {
              var redirectURL = req.session.attemptedURL;
              delete req.session.attemptedURL;
              res.redirect(redirectURL);
            } else {
              res.redirect('/');
            }
          }
        });
      }
    })(req, res, next);
  });

  /**
   * POST /account/disable-otp (requires authentication)
   *   Turns *off* two factor enhanced security
   */

  app.get('/account/disable-otp', passportConf.isAuthenticated, function (req, res) {

    // Delete the key for the user
    User.findById(req.user.id, function (err, user) {
      if (err) {
        req.flash('error', { msg: err.message });
        return (err);
      }

      user.enhancedSecurity = null;
      user.activity.last_updated = Date.now();

      user.save(function (err) {
        if (err) {
          req.flash('error', { msg: err.message });
          return (err);
        }
      });
    });

    // Then redirect back to account
    res.redirect('/account');
  });

};
