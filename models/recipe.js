const mongoose = require('mongoose');
// const comment = require('./comment');

// RECIPE SCHEMA
const recipeSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    recipeName: String,
    description: String,
    imageURL: String,
    created: {type: Date, default: Date.now},
    servings: Number,
    prepTime: Number,
    ingredientList: [],
    instructions: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// MODEL-EXPORT
module.exports = mongoose.model('Recipe', recipeSchema);