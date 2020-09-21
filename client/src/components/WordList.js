import React from "react";
import SingleWord from "./SingleWord";

//PROPS: Function setWord, String query
class WordList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      query: props.query,
      allWords: [],
    };
  }

  componentDidMount() {
    console.log(this.state.query);
    this.setState({
      allWords: this.state.query.split(" ").map((e) => {
        return <SingleWord word={e} setWord={this.props.setWord} />;
      }),
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.query != prevProps.query) {
      console.log("prev: ", prevProps.query);
      console.log("Changing", this.props.query);
      this.setState({
        allWords: this.props.query.split(" ").map((e) => {
          return <SingleWord word={e} setWord={this.props.setWord} />;
        }),
      });
    }
  }

  render() {
    return <div id="alltext-container">{this.state.allWords}</div>;
  }
}

export default WordList;
