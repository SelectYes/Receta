const express = require('express');
const app = express();
const route = express.Router();
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// NEW ROUTE
route.get('/recipes/:id/comments/new', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('comments/new', {recipe: recipe});
    } catch (error) {
        console.log(error);
    }
});

// CREATE ROUTE
route.post('/recipes/:id/comments', isLoggedIn, async (req, res) => {
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

module.exports = route;