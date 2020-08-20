const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');
const middleware = require('../middleware/index');

// PASSING LOGGED IN USER DATA TO TEMPLATES/ROUTES
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('comments/new', {recipe: recipe});
    } catch (error) {
        console.log(error);
    }
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const comment = await Comment.create(req.body.comment);

        comment.author.username = req.user.username;
        comment.author.id = req.user._id;
        comment.save();

        recipe.comments.push(comment);
        recipe.save();

        req.flash('success', 'New comment added.');
        res.redirect(`/recipes/${req.params.id}`)

    } catch (error) {
        req.flash('error', error.message);
    }
});

// EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comment_id);
        const recipe = await Recipe.findById(req.params.id);
    
        res.render('comments/edit', {comment: comment, recipe: recipe});
        
    } catch (error) {
        req.flash('error', error.message);
    }
});

// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        req.flash('success', 'Comment successfully updated.');
        res.redirect(`/recipes/${req.params.id}`);
        
    } catch (error) {
        req.flash('error', error.message);
    }
});

// DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.comment_id);
        req.flash('success', 'Comment successfully removed.');
        res.redirect(`/recipes/${req.params.id}`);
        
    } catch (error) {
        req.flash('error', error.message);
    }
});

module.exports = router;