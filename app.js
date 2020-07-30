const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.get('/recipes', (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log(`Serving RecipeDex on localhost:${port}`))