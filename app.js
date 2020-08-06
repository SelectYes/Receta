/////////////////////////////////////////////////////////////////////////////
//                                  SETUP
/////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const { response } = require('express');
const methodOverride = require('method-override');
const Recipe = require('./models/recipe');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/recipedex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message))

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

/////////////////////////////////////////////////////////////////////////////
//                             RECIPE ROUTES
/////////////////////////////////////////////////////////////////////////////

// Recipe.create({
//     author: "Claire",
//     recipeName: "Tuna Pesto Pasta",
//     body: "A delicious tuna pasta salad. Perfect for a light lunch and guaranteed to impress your boyfriend.",
//     imageURL: "https://www.chatelaine.com/wp-content/uploads/2012/01/Pesto-penne-with-tuna-0-l.jpg",
// });

// seedDB();

// INDEX
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.get('/recipes', (req, res) => {
    Recipe.find({}, (err, retrievedRecipes) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render('index', {recipes: retrievedRecipes});
        }
    });
});

// NEW
app.get('/recipes/new', (req, res) => {
    res.render('recipes/new');
});

// CREATE
app.post('/recipes', (req, res) => {
    Recipe.create(req.body.recipe, (err, newRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/recipes')
        }
    });
});

// SHOW
app.get('/recipes/:id', (req, res) => {
    Recipe.findById(req.params.id).populate('comments').exec((err, recipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/show', {recipe: recipe});
        }
    });
});

// EDIT
app.get('/recipes/:id/edit', (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.render('recipes/edit', {recipe: recipe});
        }
    });
});

// UPDATE
app.put('/recipes/:id', (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updateRecipe) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});

// DESTROY
app.delete('/recipes/:id', (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.redirect('/recipes');
        }
    });
});


/////////////////////////////////////////////////////////////////////////////
//                             COMMENT ROUTES
/////////////////////////////////////////////////////////////////////////////

// NEW ROUTE
app.get('/recipes/:id/comments/new', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('comments/new', {recipe: recipe});
    } catch (error) {
        console.log(error);
    }
});

// CREATE ROUTE
app.post('/recipes/:id/comments', async (req, res) => {
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

app.listen(port, () => console.log(`Serving RecipeDex on localhost:${port}`))