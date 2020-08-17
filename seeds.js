const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const Comment = require('./models/comment');
const User = require('./models/user');

//     author: "Claire",
//     recipeName: "Tuna Pesto Pasta",
//     body: "A delicious tuna pasta salad. Perfect for a light lunch and guaranteed to impress your boyfriend.",
//     imageURL: "https://www.chatelaine.com/wp-content/uploads/2012/01/Pesto-penne-with-tuna-0-l.jpg",

const seeds = [
    {
        author: "Bart",
        recipeName: "Cheese Burger",
        description: "Juicy homemade beef burger patties with delicious secret BBQ sauce.",
        imageURL: "https://images.pexels.com/photos/750075/pexels-photo-750075.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        // created: {type: Date, default: Date.now},
        servings: 2,
        prepTime: 45,
        // ingredients: String,
        // instructions: String,
        // comments: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'comment'
        //     }
        // ]
    },
    {
        author: "Lisa",
        recipeName: "Fruit Salad",
        description: "Refreshing fruit salad, perfect for hot summer days around the pool with the people you love",
        imageURL: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        // created: {type: Date, default: Date.now},
        servings: 6,
        prepTime: 40,
        // ingredients: String,
        // instructions: String,
        // comments: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'comment'
        //     }
        // ]
    }
];

const genericComment = {
    text: 'Oh my word! This is the best meal I have ever had!!!!',
    author: "Bob"
};

const seedDB = async () => {
    try{
        await Recipe.deleteMany({}, () => console.log('RECIPES DELETED'))
        await Comment.deleteMany({}, () => console.log('COMMENTS DELETED'))
        await User.deleteMany({}, () => console.log('USERS DELETED'))
        
        // seeds.forEach(async seed => {
        //     const recipe = await Recipe.create(seed);
        //     const comment = await Comment.create(genericComment);
    
        //     recipe.comments.push(comment);
        //     recipe.save();
        // });


    } catch(error){
        console.log('ERROR CAUGHT');
    }
    
}

module.exports = seedDB;