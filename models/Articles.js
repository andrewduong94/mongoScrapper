const mongoose = require("mongoose");

// Save a ref to the schema constructor 
const Schema = mongoose.Schema;

//Creating Article schema object

const ArticlesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    //Associating article with note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }
});


const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;