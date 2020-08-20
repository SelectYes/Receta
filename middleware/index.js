const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

const middlewareObj = {};

// MIDDLEWARE CHEKCKING IF USER IS LOGGED IN
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to do that.');
    res.redirect('/login');
};

//MIDDLEWARE CHECKING IF USER IS AUTHORIZED FOR ACTION
middlewareObj.checkRecipeOwnership = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const recipe = await Recipe.findById(req.params.id);
            if (recipe.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'You are not permitted to do that.');
                res.redirect("back");
            }
        } else {
            req.flash('error', 'You must be logged in to do that.');
            res.redirect("back");
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const comment = await Comment.findById(req.params.comment_id);
            if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'You are not permitted to do that.');
                res.redirect("back");
            }
        } else {
            req.flash('error', 'You must be logged in to do that.');
            res.redirect("back");
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};

module.exports = middlewareObj;