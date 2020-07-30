/////////////////////////////////////////////////////////////////////////////
//                                  SETUP
/////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

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

/////////////////////////////////////////////////////////////////////////////
//                          MONGOOSE MODEL CONFIG
/////////////////////////////////////////////////////////////////////////////

// RECIPE SCHEMA
const recipeScema = new mongoose.Schema({
    author: String,
    recipeName: String,
    body: String,
    imageURL: String,
    created: {type: Date, default: Date.now}
});

// MODEL
const Recipe = mongoose.model("Recipe", recipeScema);

/////////////////////////////////////////////////////////////////////////////
//                                  ROUTES
/////////////////////////////////////////////////////////////////////////////

// INDEX
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.get('/recipes', (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log(`Serving RecipeDex on localhost:${port}`))