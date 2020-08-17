const express = require('express');
const app = express();
const router = express.Router();
const Recipe = require('../models/recipe');


// PASSING LOGGED IN USER DATA TO TEMPLATES/ROUTES
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// MIDDLEWARE CHEKCKING IF USER IS LOGGED IN
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

//MIDDLEWARE CHECKING IF USER IS AUTHORIZED FOR ACTION
const checkRecipeOwnership = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const recipe = await Recipe.findById(req.params.id);
            if (recipe.author.id.equals(req.user._id)) {
                next();
            } else {
                console.log('You are not permitted to do that.');
                res.redirect("back");
            }
        } else {
            console.log('You must be logged in to do that.');
            res.redirect("back");
        }
    } catch (error) {
        console.log(error);
        res.redirect('back');
    }
}

router.get('/', (req, res) => {
    Recipe.find({}, (err, retrievedRecipes) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render('index', {recipes: retrievedRecipes});
        }
    });
});

// NEW
router.get('/new', isLoggedIn, (req, res) => {
    res.render('recipes/new');
});

// CREATE
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.create(req.body.recipe);

        recipe.author.username = req.user.username;
        recipe.author.id = req.user._id;
        recipe.save();

        res.redirect('/recipes')
        
    } catch (error) {
        console.log(error);
        console.log('COULD NOT CREATE NEW RECIPE!');
    }  
});

// SHOW
router.get('/:id', (req, res) => {
    Recipe.findById(req.params.id).populate('comments').exec((err, recipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/show', {recipe: recipe});
        }
    });
});

// EDIT
router.get('/:id/edit', checkRecipeOwnership, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.render('recipes/edit', {recipe: recipe});
        }
    });
});

// UPDATE
router.put('/:id', checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updateRecipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});

// DESTROY
router.delete('/:id', checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.redirect('/recipes');
        }
    });
});

module.exports = router;