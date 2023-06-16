
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    Name: String,
    image: String,
    file: String,
    price: Number,
    quantity: Number,
    descrip: String,
    item_id: [{type: mongoose.Schema.Types.ObjectId}] 

});

module.exports =  mongoose.model('Items',itemSchema);

