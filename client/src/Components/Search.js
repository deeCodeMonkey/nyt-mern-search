import React from 'react';


//queries NYT API for aticles. Display search results.
const Search = (props) => { 
        return (
            <div className="Search">       
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1> Search</h1>

                            <form>
                                <div className="form-group">
                                    <label>Topic or Keyword</label>
                                    <input name="keyword" onChange={props.onChange} type="text" className="form-control" id="keyword" placeholder="Keyword"/>
                                </div>
                                <div className="form-group">
                                    <label>Start Year</label>
                                    <input name="startYear" onChange={props.onChange} type="text" className="form-control" id="startYear" placeholder="Start year" />
                                </div>
                                <div className="form-group">
                                    <label>End Year</label>
                                    <input name="endYear" onChange={props.onChange} type="text" className="form-control" id="endYear" placeholder="End year" />
                                </div>
                                <button type="submit" className="btn btn-default" onClick={props.onSubmit}>Search</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        );
}

export default Search;
