const express = require('express');
const app = express();
const router = express.Router();
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient')
const middleware = require('../middleware/index');


// PASSING LOGGED IN USER DATA TO TEMPLATES/ROUTES
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


router.get('/', (req, res) => {
    Recipe.find({}, (err, retrievedRecipes) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render('index', {recipes: retrievedRecipes});
        }
    });
});

// NEW - RECIPE DESCRIPTION
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('recipes/new');
});

// CREATE - RECIPE DESCRIPTION
router.post('/', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.create(req.body.recipe);

        recipe.author.username = req.user.username;
        recipe.author.id = req.user._id;
        recipe.save();
        console.log("from create recipe: " + recipe);

        // req.flash('success', 'Great! Now go ahead and add the necessary ingredients and instructions');
        res.redirect(`/recipes/${recipe._id}/ingredients/new`);
        
    } catch (error) {
        req.flash('error', error.message);
    }  
});

// NEW - RECIPE INGREDIENTS
router.get('/:id/ingredients/new', async (req, res) => {
    try {
        const recipe = Recipe.findById(req.params.id);
        console.log("from ingredient form: " + recipe);
        res.render('ingredients/new', {recipe: recipe});
    } catch (error) {
        req.flash('error', error.message);
    }
});

// CREATE - RECIPE INGREDIENTS
router.post('/:id/ingredients', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const ingredientList = req.body.ingredients
        console.log(recipe);
        console.log(ingredientList);
        res.redirect('/recipes');
    } catch (error) {
        req.flash('error', error.message);
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
router.get('/:id/edit', middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.render('recipes/edit', {recipe: recipe});
        }
    });
});

// UPDATE
router.put('/:id', middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updateRecipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            req.flash('success', 'Recipe updated!');
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});

// DESTROY
router.delete('/:id', middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
        if (err) {
            console.log("ERROR!");
        } else {
            req.flash('success', 'Recipe removed!');
            res.redirect('/recipes');
        }
    });
});

module.exports = router;