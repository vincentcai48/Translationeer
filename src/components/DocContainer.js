import React from "react";
import Definition from "./Definition";
import WordList from "./WordList";
import { LangContext } from "../services/context";

//PROPS: String query, the search query.
class DocContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      currentWord: null,
    };
  }

  setWord = (word) => {
    console.log("SetWord()");
    this.setState({ currentWord: word });
  };

  //   changeLanguage = (e) => {
  //     this.context.updateLanguage(e.target.value);
  //   };

  crossOut = () => {
    this.setState({ currentWord: null });
  };

  render() {
    console.log(this.state.currentWord);
    // if(this.state.currentWord == null){
    //     this.setState({currentWord: })
    // }
    return (
      <div id="docContainer">
        <div>
          <WordList query={this.props.query} setWord={this.setWord} />
        </div>
        {this.state.currentWord && (
          <Definition
            word={this.state.currentWord}
            crossOut={this.crossOut}
            apis={this.context.apis}
          />
        )}
      </div>
    );
  }
}

DocContainer.contextType = LangContext;

export default DocContainer;
