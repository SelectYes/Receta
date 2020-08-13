const express = require('express');
const app = express();
const route = express.Router();
const passport = require('passport');
const User = require('../models/user');

// SIGN UP ROUTES

route.get('/register', (req, res) => {
    res.render('register');
});

route.post('/register', async (req, res) => {
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

route.get('/login', (req, res) => {
    res.render('login');
});

route.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/recipes',
        failureRedirect: '/login'
    }), (req, res) => {
});

// SIGN OUT ROUTE

route.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/recipes');   
});

module.exports = route;