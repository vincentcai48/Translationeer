import React from "react";
import QuickSearch from "./QuickSearch";
import jumbotronImage from "../booksjumbotron2.PNG";

class Home extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isSearched: false,
      query: "",
    };
  }

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  submit = () => {
    this.setState({ isSearched: true });
  };

  unSearch = () => {
    this.setState({ isSearched: false });
  };

  render() {
    console.log("HOME");
    return this.state.isSearched ? (
      <QuickSearch
        query={this.state.query || "No Text Supplied"}
        unSearch={this.unSearch}
      />
    ) : (
      <div>
        <div id="jumbotron">
          <img src={jumbotronImage}></img>
          <div id="jumbotron-text">
            <h2>A Better Way to Translate</h2>
            <p>
              Translationeer is the premier online tool for translation, with
              its resources designed for making translations easy.
            </p>
            <div id="jumbotron-quickSearch">
              <input
                type="text"
                onChange={this.changeState}
                name="query"
              ></input>
              <button type="button" onClick={this.submit}>
                Translate<span>{""}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
