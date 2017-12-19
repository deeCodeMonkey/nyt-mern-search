import React from 'react';

const Results = (props) => {

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h4>{props.title}</h4>
                    <p className="url-text">{props.url}</p>
                    <p className="date-text">{props.date}</p>
                    <button
                        type="submit"
                        className="btn btn-default"
                        onClick={() => props.saveArticle(props.title, props.date, props.url)}
                    >Save</button>
                </div>
            </div>
        </div>
    );
}

export default Results;
