var User = require('../app/models/user');
var Auth = require('./middlewares/authorization.js');
const config = require('./config')
const request = require("request")
const qs = require('querystring')
const queryString = require('query-string')


const TokenData = require('../app/models/token')

module.exports = function(app, passport){
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
		  res.render("home", { user : req.user}); 
		}else{
			res.render("home", { user : null});
		}
	});

	app.get("/login", function(req, res){ 
		res.render("login");
	});

	app.post("/login" 
		,passport.authenticate('local',{
			successRedirect : "/",
			failureRedirect : "/login",
		})
	);

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("profile");
			});
		});
	});

	app.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));
	app.get("/auth/facebook/callback", 
		passport.authenticate("facebook",{ failureRedirect: '/login'}),
		function(req,res){
			res.render("profile", {user : req.user});
		}
	);

	app.get('/auth/google',
	  passport.authenticate(
	  	'google',
			{

				scope:['profile','email']
			}
			),
			
	  );

	app.get('/link/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

	app.get("/profile", Auth.isAuthenticated , function(req, res){ 
		res.render("profile", { user : req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
	
	
	
app.get('/auth/twitter',handleTwitter)
app.get("/auth/twitter/callback",twitterCallbackHandler)

	
app.get('/auth/linkedin',handleLinkedin)
app.get("/link/linkedin/callback",linkedinCallbackHandler)

}




 function handleLinkedin(req,res,next){
	let {linkedin} = config.development;
	let oauth ={ 
		response_type: "code",
		client_id: linkedin.clientID, 
		redirect_uri: linkedin.callbackURL,
		state:"passlock"
	};
		const url = 'https://www.linkedin.com/oauth/v2/authorization';
		let params = qs.stringify(oauth)
		let auth_uri = url+ "?" +params;
		// return res.send(auth_uri)
	    request.get(auth_uri, async function(e,r,body){
				 
				res.redirect(auth_uri)
			/**
		 * store access token and access_token_secret
		 * 
		 * 
		 */
					
		// const req_data  = qs.parse(5body)



		// 	await TokenData.create({
		// 		access_token:req_data.oauth_token,
		// 		token_secret:req_data.oauth_token_secret
		// 	})
		// let query = qs.stringify({oauth_token: req_data.oauth_token})

		// 	const uri = 'https://api.twitter.com/oauth/authenticate' + '?' +query 
		// 	// // redirect the user to the authorize uri
		// 	return res.redirect(uri)
		})

}


async function linkedinCallbackHandler(){
	console.log("handled")
	const {linkedin} = config.development;
	const auth_data = req.query;
	
	
}
















async function twitterCallbackHandler (req,res){
	const {twitter} = config.development;
	const auth_data = req.query;
	const token_data = await TokenData.findOne({access_token:auth_data.oauth_token})

		const oauth =
		{ consumer_key: twitter.clientID
		, consumer_secret: twitter.clientSecret
		, token: auth_data.oauth_token
		, token_secret: token_data.token_secret
		, verifier: auth_data.oauth_verifier
		};

		const url = 'https://api.twitter.com/oauth/access_token';
		request.post({url:url, oauth:oauth}, function (e, r, body) {
			// 	// ready to make signed requests on behalf of the user
			let perm_data = queryString.parse(body);
			   
				let oauth = {
					consumer_key: twitter.clientID,
					 consumer_secret: twitter.clientSecret,
					 token: perm_data.oauth_token,
					 token_secret: perm_data.oauth_token_secret
					};
			let url = 'https://api.twitter.com/1.1/users/show.json';
			let qs = { 
				      screen_name: perm_data.screen_name, 
				      user_id: perm_data.user_id
					};
			request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, user) {
				console.log(user)
			})
		})
	}
	





async function handleTwitter(req,res){
	const {twitter} = config.development;
	// OAuth1.0 - 3-legged server side flow (Twitter example)
	// step 1

		const oauth ={ 
		callback: twitter.callbackURL,
		consumer_key: twitter.clientID, 
		consumer_secret: twitter.clientSecret};
    	const url = 'https://api.twitter.com/oauth/request_token';
	    request.post({url:url, oauth:oauth}, async function(e,r,body){
		/**
		 * store access token and access_token_secret
		 * 
		 * 
		 */
					
		const req_data  = qs.parse(body)
			await TokenData.create({
				access_token:req_data.oauth_token,
				token_secret:req_data.oauth_token_secret
			})
		let query = qs.stringify({oauth_token: req_data.oauth_token})

			const uri = 'https://api.twitter.com/oauth/authenticate' + '?' +query 
			// // redirect the user to the authorize uri
			return res.redirect(uri)
		})
			
		


}

