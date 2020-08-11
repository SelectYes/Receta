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

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


/////////////////////////////////////////////////////////////////////////////
//                             RECIPE ROUTES
/////////////////////////////////////////////////////////////////////////////

// Recipe.create({
//     author: "Claire",
//     recipeName: "Tuna Pesto Pasta",
//     body: "A delicious tuna pasta salad. Perfect for a light lunch and guaranteed to impress your boyfriend.",
//     imageURL: "https://www.chatelaine.com/wp-content/uploads/2012/01/Pesto-penne-with-tuna-0-l.jpg",
// });

// seedDB();

// INDEX
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.get('/recipes', (req, res) => {
    Recipe.find({}, (err, retrievedRecipes) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render('index', {recipes: retrievedRecipes});
        }
    });
});

// NEW
app.get('/recipes/new', isLoggedIn, (req, res) => {
    res.render('recipes/new');
});

// CREATE
app.post('/recipes', isLoggedIn, (req, res) => {
    Recipe.create(req.body.recipe, (err, newRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/recipes')
        }
    });
});

// SHOW
app.get('/recipes/:id', (req, res) => {
    Recipe.findById(req.params.id).populate('comments').exec((err, recipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/show', {recipe: recipe});
        }
    });
});

// EDIT
app.get('/recipes/:id/edit', (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.render('recipes/edit', {recipe: recipe});
        }
    });
});

// UPDATE
app.put('/recipes/:id', (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updateRecipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});

// DESTROY
app.delete('/recipes/:id', (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.redirect('/recipes');
        }
    });
});


/////////////////////////////////////////////////////////////////////////////
//                             COMMENT ROUTES
/////////////////////////////////////////////////////////////////////////////

// NEW ROUTE
app.get('/recipes/:id/comments/new', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('comments/new', {recipe: recipe});
    } catch (error) {
        console.log(error);
    }
});

// CREATE ROUTE
app.post('/recipes/:id/comments', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const comment = await Comment.create(req.body.comment);

        recipe.comments.push(comment);
        recipe.save();

        res.redirect(`/recipes/${req.params.id}`)

    } catch (error) {
        console.log(error);
    }
});

/////////////////////////////////////////////////////////////////////////////
//                             AUTH ROUTES
/////////////////////////////////////////////////////////////////////////////

// SIGN UP ROUTES

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = new User({ username: req.body.username });
        const password = req.body.password;
    
        await User.register(newUser, password)

        passport.authenticate('local')(req, res, () => {
            res.redirect('/recipes');
        });

    } catch (error) {
        console.log(error);
        res.redirect('/register');
    }
});

// SIGN-IN ROUTES

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/recipes',
        failureRedirect: '/login'
    }), (req, res) => {
});

// SIGN OUT ROUTE

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/recipes');   
});

app.listen(port, () => console.log(`Serving RecipeDex on localhost:${port}`))