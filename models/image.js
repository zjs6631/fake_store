const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    itemId: {type: Schema.Types.ObjectId, ref: 'Item'},
    fileName: {type: String},
});

module.exports = mongoose.model("Image", ImageSchema);
