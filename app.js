/////////////////////////////////////////////////////////////////////////////
//                                  SETUP
/////////////////////////////////////////////////////////////////////////////

// SERVER/DB
const express                   = require('express');
const app                       = express();
const mongoose                  = require('mongoose');
const { response }              = require('express');
const methodOverride            = require('method-override');
// MODELS
const Recipe                    = require('./models/recipe');
const Comment                   = require('./models/comment');
const User                      = require('./models/user');
// AUTHENTICATION
const passport                  = require('passport');
const localStrategy             = require('passport-local');
const passportLocalMongoose     = require('passport-local-mongoose')
const expressSession            = require('express-session');
// MISC
const seedDB                    = require('./seeds');
const port                      = 3000;
// ROUTES
const recipesRoute              = require('./routes/recipes');
const commentsRoute             = require('./routes/comments');
const authRoutes                = require('./routes/authentication');

mongoose.connect('mongodb://localhost:27017/recipedex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message))

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

/////////////////////////////////////////////////////////////////////////////
//                           AUTHENTICATION CONFIG
/////////////////////////////////////////////////////////////////////////////

app.use(expressSession({
    secret: "Benny is the cutest and best dog in the entire universe",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// config for using 'authenticate()' as middleware
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(recipesRoute);
app.use(commentsRoute);
app.use(authRoutes);

// SEED DATABASE //
// seedDB(); 


app.listen(port, () => console.log(`Serving RecipeDex on localhost:${port}`))