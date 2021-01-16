import React from "react";
import WordList from "./WordList";
import { DefinitionContext } from "../services/context";
import Definition from "./Definition";
import DocContainer from "./DocContainer";

//PROPS: String query, set to null if you want to look up here.
class QuickSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      query: "",
      wordList: null,
      isSubmitted: false,
    };
  }

  componentDidMount() {
    console.log(this.props.query);
    if (this.props.query) {
      this.setState({ query: this.props.query });
      this.submit();
    }
  }

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  submit = () => {
    this.setState({ isSubmitted: true });
  };

  renderList = (e) => {
    // console.log("Hello World");
    // console.log("Query: " + this.state.query);
    // const reference = <WordList query={this.state.query} />;
    // this.setState((prevState) => {
    //   return { wordList: prevState.wordList ? null : reference };
    // });
  };

  render() {
    if (this.state.wordList == null) {
      this.setState({ wordList: <WordList query={this.state.query} /> });
    }
    return (
      <div id="quickSearch-container">
        <button onClick={() => this.props.unSearch()} id="search-again-button">
          <span>{"<<<"} </span>Search Again
        </button>
        <div id="quickSearch-title">
          <h3>Translationeer QuickSearch</h3>
          <p>
            A Quick Way to Get Started Translating. For full translation
            capability, use the Translationeer Studio
          </p>
        </div>
        {!this.state.isSubmitted && (
          <form>
            <input
              rows="5"
              style={{ width: "200px", height: "100px" }}
              type="text"
              id="qs-input"
              onChange={this.changeState}
              name="query"
            ></input>
            <button type="button" id="qs-submit" onClick={this.submit}>
              Quick Translate
            </button>
          </form>
        )}
        {this.state.isSubmitted && <DocContainer query={this.state.query} />}
      </div>
    );
  }
}

export default QuickSearch;
