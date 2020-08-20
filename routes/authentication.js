const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// PASSING LOGGED IN USER DATA TO TEMPLATES/ROUTES
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// SIGN UP ROUTES

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/recipes',
        failureRedirect: '/login'
    }), (req, res) => {
});

// SIGN OUT ROUTE

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logout successful!')
    res.redirect('/recipes');   
});

module.exports = router;