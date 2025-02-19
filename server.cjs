const express  = require('express');
const mongodb  = require('mongodb');
const logger   = require('morgan');
const session  = require('express-session');
const cors     = require('cors');
const dotenv   = require('dotenv').config();


const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_HOST,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  EXPRESS_SESSION_SECRET
} = process.env;



const app = express();
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;



app.use(logger('dev'));
app.use(session({
  secret: EXPRESS_SESSION_SECRET,
  cookie: { 
    maxAge: 3600,
    sameSite: true,
  },
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


// MongoDB
let DBCollection = null;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new mongodb.MongoClient(uri);

async function connectToDB() {
  await client.connect(uri);
  client.db("admin")
    .command({ ping: 1 })
    .then(
      console.log("Database connection successful! Pinged the admin.")
    );

  const db = client.db("A4-Ternt");
  DBCollection = db.collection("Users");
}
connectToDB();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function(id, done) {
  const cursor = await DBCollection.find({ username: id }).toArray();
  done(null, cursor[0]);
});



// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/github/"
  },
  async function(accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      
      const query = { 
        username: profile.username,
        provider: profile.provider
      }
      const cursor = await DBCollection.find(query).toArray();     
      const userProfile = cursor[0];

      // Check if the profile exists 
      if ( userProfile ) {
        console.log(userProfile);
        const userData = {
          username: userProfile.username,
          photo: userProfile.photo,
          provider: userProfile.provider,
          cards: []
        };
        return done( null, userData );
      } else {
        console.log(profile);

        // Create a new profile is not in database
        const userData = {
          username: profile.username,
          photo: profile.photos[0].value,
          provider: profile.provider,
          cards: []
        };

        await DBCollection.insertOne(userData, 
          function(err, res) {
            if (err) throw err;
            console.log("New git user created");
          });

        return done( null, userData );
      }    
    });
  }
));




app.use(express.static('dist'));
app.use(cors());

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/login/oauth/authorize',  
  passport.authenticate('github', { scope: ['read:user']}) 
);


// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/github/', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/api/authed', 
  ensureAuthenticated,
  function(req, res) {
    if (!req._passport.session || !req.session.user) {
      res.status(200).send(JSON.stringify(req.user));
    }
});


app.post('/api/save-card', 
  ensureAuthenticated,
  function(req, res) {
    if (!req._passport.session || !req.session.user) {
      console.log(req.session.user);
      const body = JSON.parse(req.body);
      res.status(200).send("Card saved");
    }
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login/oauth/authorize');
}


const port = 3000, url = 'localhost';
app.listen(port, url, () => {
  console.log(`Server is listening on ${url}:${port}`);
})
