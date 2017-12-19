import React, { Component } from 'react';
import axios from 'axios';

import Results from '../Results';
import Saved from '../Saved';
import Search from '../Search';
import './Main.css';

class Main extends Component {

    state = {
        articles: [],
        savedArticles: [],
        keyword: '',
        startYear: '',
        endYear: ''
    }

    //load saved articles after mounting 
    componentDidMount() {
        this.loadSavedArticles();
    }


    loadSavedArticles = () => {
        axios.get('/saved')
            .then((response) => {
                this.setState({ savedArticles: response.data });
            })
            .catch((error) => {
                console.log(error);
            });
    };


    //Search
    handleSearchSubmit = (event) => {
        event.preventDefault();

        var body = {
            keyword: this.state.keyword,
            yearStart: this.state.startYear,
            yearEnd: this.state.endYear
        };

        axios.post('/scrape', body)
            .then((response) => {
                this.setState({
                    articles: response.data
                    
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleInputChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    };

    saveArticleOnClick = (title, date, url) => {
        let body = {
            title,
            date,
            url
        };

        axios.post('/saved', body)
            .then((response) => {
                console.log(response.data);

                this.setState({
                    articles: this.state.articles.filter(item => item.title !== title)
                });

                this.loadSavedArticles();

            })
            .catch((error) => {
                console.log(error);
            });
    };

    removeArticleOnClick = (id) => {
        axios.delete('/saved/' + id)
            .then((response) => {
                console.log('Deleted', response.data);
                this.loadSavedArticles();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        return (
            <div className="Main">
                <div className="well">
                    <div class="jumbotron">
                        <h1 class="text-center"><strong><i class="fa fa-newspaper-o"></i> New York Times Search</strong></h1>
                    </div>

                    < Search onSubmit={this.handleSearchSubmit} onChange={this.handleInputChange} />
                    <hr />

                    <div className="Results well">
                        <h3>Results</h3>
                    </div>
                    {this.state.articles.map((article) => {
                        return (
                            <Results key={article.title} {...article} saveArticle={this.saveArticleOnClick} />
                        );
                    })}

                    <hr />

                    <div className="Saved well">
                        <h3>Saved Articles</h3>
                    </div>
                    {this.state.savedArticles.map((article) => {
                        return (
                            <Saved key={article._id} {...article} removeArticle={this.removeArticleOnClick} />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Main;
