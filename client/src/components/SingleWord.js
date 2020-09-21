import React from "react";
import { DefinitionContext } from "../services/context";

//PROPS: String word, Function setWord
class SingleWord extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <span
          className="singleWord"
          onClick={() => {
            console.log("Clicked");
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
