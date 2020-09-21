import React from "react";
import Studio from "../Studio";
import { LangContext } from "../../services/context";

//PROPS: Object() document, the current document, Function() breakOffFunction.
class StudioHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      breakOffText: "",
      breakOffIndex: -1,
      sectionTexts: [],
    };
  }

  changeTextEnd = (e) => {
    const sliderValue = Number(e.target.value);
    this.context.textEnd = Number(e.target.value);
    if (
      document.getElementById("left-studio") &&
      sliderValue < window.innerWidth * 0.7 &&
      sliderValue > window.innerWidth * 0.3
    ) {
      document.getElementById("left-studio").style.width =
        this.context.textEnd + "px";
    }
  };

  //Returns the INDEX of the section it is in, NOT a boolean
  breakOffIndex = (text) => {
    var index = -1;
    var num = 0;
    this.setState({ breakOffText: text });
    this.state.sectionTexts.forEach((e) => {
      if (e.includes(text)) {
        index = num;
      }
      num++;
    });
    return index;
  };

  componentDidMount() {
    document.querySelector(
      "#slidecontainer #textEnd-slider"
    ).value = this.context.textEnd;

    var arr = [];
    console.log("PASSED IN DOC", this.props.document);
    this.props.document.body.forEach((e) => arr.push(e.text));
    this.setState({ sectionTexts: arr });

    window.onmouseup = () => {
      console.log("Selection: ", window.getSelection().toString());

      //IMPORTANT: replace all types of line breaks (including carriage) with nothing and all non breaking space &nbsp; with a whitespace. &nbsp; is NOT the same as a whitespace

      var selectedText = window
        .getSelection()
        .toString()
        .replaceAll(/(\r\n|\n|\r)/gm, "")
        .replaceAll(/[\s\u00A0]/gm, " ");
      console.log(selectedText ? "true" : "false");
      if (this.state.breakOffText !== selectedText) {
        if (!selectedText) {
          console.log(selectedText);
          this.setState({
            breakOffText: "",
            breakOffIndex: -1,
          });
          console.log(this.state.breakOffIndex);
        } else {
          this.setState({
            breakOffText: selectedText,
            breakOffIndex: this.breakOffIndex(selectedText),
          });
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    console.log(this.state.sectionTexts);
    //using length to measure whether it changed is not ideal, come back here.
    if (prevProps.document.body.length != this.state.sectionTexts.length) {
      this.setState({
        sectionTexts: this.props.document.body.map((d) => d.text),
      });
    }
  }

  breakOff = () => {
    console.log(this.state.breakOffIndex);
    console.log(this.state.breakOffText);
    this.props.breakOffFunction(
      this.state.breakOffText,
      this.state.breakOffIndex
    );
    // this.props.breakOffFunction(
    //   this.state.breakOffText,
    //   this.state.breakOffIndex
    // );
  };

  render() {
    return (
      <div id="studioHeader-container">
        <button type="button" onClick={this.props.backToDocsFunction}>
          {"<<<"}Back to Documents
        </button>
        <div id="slidecontainer">
          <input
            type="range"
            min={0}
            max={window.innerWidth}
            className="slider"
            id="textEnd-slider"
            onChange={this.changeTextEnd}
          />
        </div>

        <div>
          {this.state.breakOffIndex > -1 && (
            <div id="preview-breakoff">
              {this.state.breakOffText.length > 100
                ? this.state.breakOffText.substr(0, 100) + "..."
                : this.state.breakOffText}
            </div>
          )}
          {this.state.breakOffIndex > -1 ? (
            <button type="button" onClick={this.breakOff}>
              Break Off Text
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
StudioHeader.contextType = LangContext;

export default StudioHeader;
