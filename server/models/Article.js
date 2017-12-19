const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    }
});

let Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;