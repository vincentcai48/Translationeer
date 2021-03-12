import React from "react";
import { DefinitionContext } from "../services/context";

//PROPS: String word, Function setWord
class SingleWord extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.word != this.props.word) {
      // console.log(prevProps.word,this.props.word)
    }
  }

  render() {
    return (
      <div>
        <span
          className="singleWord"
          onClick={() => {
            this.props.setWord(this.props.word);
          }}
        >
          {this.props.word}
          <span className="space-placement" style={{ width: "12px" }}>
            &nbsp;
          </span>
        </span>
      </div>
    );
  }
}

//<span className="space-placement">&nbsp;</span>

export default SingleWord;
