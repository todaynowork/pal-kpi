var passport = require('passport');
var ldapStrategy = require('passport-ldapauth');
var fs = require('fs');
var path = require('path');

var bpCert = fs.readFileSync(path.resolve(__dirname, 'ssl/bluepagescertchain.pem'));

passport.use(new ldapStrategy({
    server: {
        url: 'ldaps://bluepages.ibm.com:636',
        searchBase: 'ou=bluepages,o=ibm.com',
        searchFilter: '(mail={{username}})',
        tlsOptions: {
            cert: bpCert
        }
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.ensureAuthenticated = function (req, res, next) {
	  if (req.isAuthenticated()) { return next(); }

	  // If the user is not authenticated, then we will start the authentication
	  // process.  Before we do, let's store this originally requested URL in the
	  // session so we know where to return the user later.

	  req.session.redirectUrl = req.originalUrl;

	  // Resume normal authentication...

	  console.log('User is not authenticated.');
	  req.flash("warn", "You must be logged-in to do that.");
	  res.redirect('/login');
}

module.exports = passport;