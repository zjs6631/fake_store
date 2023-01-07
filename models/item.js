const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: [{ type: Schema.Types.ObjectId, ref: 'Category'}],
    price: {type: Number, required: true},
    number_in_stock: {type: Number, required: true},
});

//Virtual to represent item's URL
ItemSchema.virtual("url").get(function(){
    return `/catalog/item/${this._id}`
});

//exporting module
module.exports = mongoose.model("Item", ItemSchema);