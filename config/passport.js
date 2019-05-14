 

const LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose')
const FacebookStrategy = require('passport-facebook').Strategy
const  GoogleStrategy = require('passport-google-oauth20').Strategy;

const  User = mongoose.model('User');
  // , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy


module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({ _id: id }, function (err, user) {
			done(err, user);
		});
	});

  	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
    },
    function(email, password, done) {
    	User.isValidUserPassword(email, password, done);
    }));

	passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
    	profile.authOrigin = 'facebook';
    	User.findOrCreateOAuthUser(profile, function (err, user) {
	      return done(err, user);
	    });
    }));

	passport.use(new GoogleStrategy({
	    clientID: config.google.clientID,
	    clientSecret: config.google.clientSecret,
	    callbackURL: config.google.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
			console.log(accessToken);
	console.log(refreshToken);
	console.log(profile);

	// const [first,second ] = profile.photos;
	// console.log(first,second, profile.authOrigin)
	
	profile.authOrigin = 'google';
	User.findOrCreateOAuthUser(profile, function (err, user) {
						console.log(">>>>user", user)
						return done(null, user);
				});
	  }
	));
}
