const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    item: String,
    quantity: Number,
    measuringUnit: String
});

module.exports = mongoose.model('Ingredient', ingredientSchema);