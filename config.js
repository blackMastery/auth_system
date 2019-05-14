module.exports = {
	development: {
		db: 'mongodb://kev:datalock3@ds243491.mlab.com:43491/testauth',
		session: 'mongodb://kev:datalock3@ds243491.mlab.com:43491/testauth',

		app: {
			name: 'Passport Authentication'
		},
		facebook: {
			clientID: "530031340858006",
			clientSecret: "0765589e4ca5ecf054de31bf4c01f86cReset",
			callbackURL: "auth/facebook/callback"
		},

		google: {
			clientID: "1019543956334-kao0cumkh8471v8iap2ta5n14sonm4f9.apps.googleusercontent.com",
			clientSecret: "TeZFRCgCEW-JiDSTLLGQnquX",
			callbackURL: "http://localhost:3000/link/google/callback"
		},
		github: {
			clientID: "5deec621ec3ee6b525d3",
			clientSecret: "b18b670f950457a1c66d59931cdfe44291a25efe",
			callbackURL: "http://localhost:3000/auth/github/callback"
		},
		twitter: {
			clientID: "BSovUHf7IdljlNM2FxMWBcwC8",
			clientSecret: "xy2M4rS3e9AiYrD6WF42KRkfhn6xJc0SiCa6Bwo1qk2tghgtdw",
			callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
		},
		linkedin: {
			clientID: "77n3v7szs9b2vd",
			clientSecret: "WnaeZUNYHugVREI6",
			callbackURL: "http://127.0.0.1:3000/link/linkedin/callback"
		}
	},
  	production: {
    	db: process.env.MONGOLAB_URI,
		app: {
			name: 'Passport Authentication Tutorial'
		},
		facebook: {
			clientID: "",
			clientSecret: "",
			callbackURL: ""
		},
		google: {
			clientID: '',
			clientSecret: '',
			callbackURL: ''
		}
 	}
}
