const express = require('express');
const app = express();
const route = express.Router();
const Recipe = require('../models/recipe');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// INDEX
route.get('/', (req, res) => {
    res.redirect('/recipes');
});

route.get('/recipes', (req, res) => {
    Recipe.find({}, (err, retrievedRecipes) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render('index', {recipes: retrievedRecipes});
        }
    });
});

// NEW
route.get('/recipes/new', isLoggedIn, (req, res) => {
    res.render('recipes/new');
});

// CREATE
route.post('/recipes', isLoggedIn, (req, res) => {
    Recipe.create(req.body.recipe, (err, newRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/recipes')
        }
    });
});

// SHOW
route.get('/recipes/:id', (req, res) => {
    Recipe.findById(req.params.id).populate('comments').exec((err, recipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/show', {recipe: recipe});
        }
    });
});

// EDIT
route.get('/recipes/:id/edit', isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.render('recipes/edit', {recipe: recipe});
        }
    });
});

// UPDATE
route.put('/recipes/:id', isLoggedIn, (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updateRecipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});

// DESTROY
route.delete('/recipes/:id', isLoggedIn, (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.redirect('/recipes');
        }
    });
});

module.exports = route;