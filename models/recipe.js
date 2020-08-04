const mongoose = require('mongoose');
// const comment = require('./comment');

// RECIPE SCHEMA
const recipeScema = new mongoose.Schema({
    author: String,
    recipeName: String,
    description: String,
    imageURL: String,
    created: {type: Date, default: Date.now},
    servings: Number,
    prepTime: Number,
    ingredients: String,
    instructions: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// MODEL-EXPORT
module.exports = mongoose.model('Recipe', recipeScema);