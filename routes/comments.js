const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

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
const checkCommentOwnership = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const comment = await Comment.findById(req.params.comment_id);
            if (comment.author.id.equals(req.user._id)) {
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

// NEW ROUTE
router.get('/new', isLoggedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('comments/new', {recipe: recipe});
    } catch (error) {
        console.log(error);
    }
});

// CREATE ROUTE
router.post('/', isLoggedIn, async (req, res) => {
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

// EDIT ROUTE
router.get('/:comment_id/edit', checkCommentOwnership, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comment_id);
        const recipe = await Recipe.findById(req.params.id);
    
        res.render('comments/edit', {comment: comment, recipe: recipe});
        
    } catch (error) {
        console.log(error);
    }
});

// UPDATE ROUTE
router.put('/:comment_id', checkCommentOwnership, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect(`/recipes/${req.params.id}`);
        
    } catch (error) {
        console.log(error);
    }
});

// DESTROY ROUTE
router.delete('/:comment_id', checkCommentOwnership, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.comment_id);
        res.redirect(`/recipes/${req.params.id}`);
        
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;