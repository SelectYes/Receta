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

        res.redirect(`/recipes/${recipe._id}/ingredients/new`);
        
    } catch (error) {
        req.flash('error', error.message);
    }  
});

// NEW - RECIPE INGREDIENTS
router.get('/:id/ingredients/new', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('ingredients/new', {recipe: recipe});
    } catch (error) {
        req.flash('error', error.message);
    }
});

// CREATE - RECIPE INGREDIENTS
router.post('/:id/ingredients', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const ingredientArr = req.body.ingredients;

        ingredientArr.forEach(element => {
            recipe.ingredientList.push(element);
            
        });

        recipe.save();

        res.redirect(`/recipes/${recipe._id}/instructions/new`);
    } catch (error) {
        req.flash('error', error.message);
    }
});

// NEW - RECIPE INSTRUCTIONS
router.get('/:id/instructions/new', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('instructions/new', {recipe: recipe});
    } catch (error) {
        req.flash('error', error.message);
    }

});

// CREATE - RECIPE INSTRUCTIONS
router.post('/:id/instructions', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const instructions = req.body.instructions;

        recipe.instructions = instructions;
        recipe.save();

        res.redirect('/recipes');
    } catch (error) {
        req.flash('error', error.message);
    }
})

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

// EDIT - RECIPE DESCRIPTION
router.get('/:id/edit', middleware.checkRecipeOwnership, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('recipes/edit', {recipe: recipe});
    } catch (error) {
        req.flash('error', error.message);
    }
});

// UPDATE - RECIPE DESCRIPTION
router.put('/:id', middleware.checkRecipeOwnership, async (req, res) => {
    try {
        await Recipe.findByIdAndUpdate(req.params.id, req.body.recipe);
        // req.flash('success', 'Recipe updated!');

        // const recipe = await Recipe.findById(req.params.id);
        // res.render('ingredients/edit', {recipe: recipe});
        res.redirect(`/recipes/${req.params.id}/edit-ingredients`);
    } catch (error) {
        req.flash('error', error.message);
    }
});

// EDIT - RECIPE INGREDIENTS
router.get('/:id/edit-ingredients', middleware.checkRecipeOwnership, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('ingredients/edit', {recipe: recipe});
    } catch (error) {
        req.flash('error', error.message);
    }
});

// UPDATE - RECIPE INGREDIENTS
router.put('/:id/update-ingredients', middleware.checkRecipeOwnership, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const ingredientArr = req.body.ingredients;
        recipe.ingredientList = [];

        ingredientArr.forEach(element => {
            recipe.ingredientList.push(element);
            
        });

        recipe.save();
        // Recipe.findByIdAndUpdate(req.params.id, req.body.ingredients);
        res.redirect(`/recipes/${req.params.id}/edit-instructions`);
    } catch (error) {
        req.flash('error', error.message);
    }
});

// EDIT - RECIPE INSTRUCTIONS
router.get('/:id/edit-instructions', middleware.checkRecipeOwnership, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('instructions/edit', {recipe: recipe});
    } catch (error) {
        req.flash('error', error.message);
    }
});

// UPDATE - RECIPE INSTRUCTIONS
router.put('/:id/update-instructions', middleware.checkRecipeOwnership, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const instructions = req.body.instructions;

        recipe.instructions = instructions;
        recipe.save();

        
        req.flash('success', 'Recipe updated!');
        res.redirect(`/recipes/${req.params.id}`);
    } catch (error) {
        req.flash('error', error.message);
    }
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