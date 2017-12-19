const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require("axios");
const cheerio = require("cheerio");

const Article = require('./models/Article');

const PORT = parseInt(process.env.PORT, 10) || 8080;

const app = express();

mongoose.Promise = Promise;

app.use(bodyParser.json());

// Express only serves static assets in production
//routes for React
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.get('/', (req, res) => res.send('Hello Server!!!!'));



// Route for scraping the website
//Must be a POST route in order to pass a body
app.post("/scrape", function (req, res) {

    //Search criteria
    let keyword = req.body.keyword.toLowerCase();
    let yearStart = req.body.yearStart;
    let yearEnd = req.body.yearEnd;

    // First, we grab the body of the html with request
    axios.get("https://www.nytimes.com/")
        .then((response) => {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            const list = [];

            $("article.theme-summary").each(function (i, element) {

                if (list.length > 5) {
                    return;
                }
                // Save an empty result object
                let result = {};

                let aTag = $(element).children('h2').children('a');

                // Add the text and href of every link, and save them as properties of the result object
                result.title = aTag
                    .text();
                result.url = aTag
                    .attr("href");
                result.date = moment($(element).children('p')
                    .children("time.timestamp")
                    .attr("datetime"));

                //console.log(result);
                if (result.title
                    && result.url
                    && result.date
                    && (!keyword || result.title.toLowerCase().includes(keyword))
                    && (!yearStart || result.date.year() >= yearStart)
                    && (!yearEnd || result.date.year() <= yearEnd)
                ) {
                    list.push(result);
                }
            });
            res.send(list);
        })
        .catch((error) => {
            console.log(error);
        });

});


//save article
app.post('/saved', (req, res) => {
    let saveArticle = new Article();
    saveArticle.title = req.body.title;
    saveArticle.url = req.body.url;
    saveArticle.date = req.body.date;
    saveArticle.save()
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err.message ? err.message : 'ERRORED! Did not save in Mongo!');
        });
});


//query all saved articles
app.get('/saved', (req, res) => {
    Article.find({})
        .then((docs) => {
            res.json(docs);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err.message ? err.message : 'ERRORED! Did not delete from Mongo!');
        });

});


//delete saved article
app.delete('/saved/:id', (req, res) => {
    let id = req.params.id;
    Article.findOneAndRemove({ '_id': id })
        .then((doc) => {
            res.send('removed ' + JSON.stringify(doc, null, 2));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err.message ? err.message : 'ERRORED! Did not delete from Mongo!');
        });

});




//Heroku db connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect('mongodb://localhost/nytreact');
}


app.listen(PORT, () => console.log('Example app listening on port ' + PORT));




