import React from "react";
import { LangContext } from "../../services/context";
import Definition from "../Definition";
import DocContainer from "../DocContainer";
import WordList from "../WordList";

//PROPS: Array[Object()] queryArray. This is the body of a document. Function promptEdit(), opens editor on the right side.
class LeftStudio extends React.Component {
  constructor(props) {
    super();
    this.state = {
      currentWord: null,
      sections: [],
      arrayOfSections: [],
    };
  }

  promptEditProxy = (e) => {
    this.props.promptEdit(Number(e.target.name));
  };

  componentDidMount() {
    document.getElementById("left-studio").style.width = this.context.textEnd;
    this.renderSections();
    this.setState({ arrayOfSections: [...this.props.queryArray] });
  }
  componentWillUpdate(prevProps) {
    console.log(prevProps.queryArray);
    console.log(this.state.arrayOfSections);
    if (prevProps.queryArray !== this.state.arrayOfSections) {
      this.setState({ arrayOfSections: prevProps.queryArray });
      this.renderSections();
      console.log("WORKING!!!");
    }
  }

  componentDidUpdate() {
    document.getElementById("left-studio").style.width = this.context.textEnd;
  }

  setWord = (word) => {
    this.setState({ currentWord: word });
  };

  crossOut = () => {
    this.setState({ currentWord: null });
  };

  renderSections = () => {
    var arr = [];
    for (var i = 0; i < this.props.queryArray.length; i++) {
      var num = i;
      arr.push(
        <div className="single-section-wordList">
          <hr></hr>
          <button type="button" onClick={this.promptEditProxy} name={num}>
            Translate{">>>"}
          </button>
          <WordList
            query={this.props.queryArray[i].text}
            setWord={this.setWord}
          />
        </div>
      );
    }
    console.log(arr);
    // this.setState({ sections: arr });
    return arr;
  };

  render() {
    const arr = this.renderSections();
    return (
      <div id="left-studio" style={{ width: this.context.textEnd }}>
        <div id="docContainer">
          {arr}
          {this.state.currentWord && (
            <Definition
              crossOut={this.crossOut}
              word={this.state.currentWord}
              apis={this.context.apis}
            />
          )}
        </div>
      </div>
    );
  }
}
LeftStudio.contextType = LangContext;

export default LeftStudio;
