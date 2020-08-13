const express = require('express');
const app = express();
const route = express.Router({mergeParams: true});
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

// PASSING LOGGED IN USER DATA TO TEMPLATES/ROUTES
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// NEW ROUTE
route.get('/new', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('comments/new', {recipe: recipe});
    } catch (error) {
        console.log(error);
    }
});

// CREATE ROUTE
route.post('/', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const comment = await Comment.create(req.body.comment);

        comment.author.username = req.user.username;
        comment.author.id = req.user._id;
        comment.save();

        recipe.comments.push(comment);
        recipe.save();

        res.redirect(`/recipes/${req.params.id}`)

    } catch (error) {
        console.log(error);
    }
});

module.exports = route;