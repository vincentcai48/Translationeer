import React from "react";
import { LangContext } from "../../services/context";

//PROPS: Array[Map()] translations, the body of a document, Number currentSection
class RightStudio extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  //These make sure that the width of the element is correct.
  componentDidMount() {
    document.getElementById("right-studio").style.width = this.context.isMobile
      ? "100%"
      : 100 - this.context.textEnd + "%";
  }
  componentDidUpdate() {
    document.getElementById("right-studio").style.width = this.context.isMobile
      ? "100%"
      : 100 - this.context.textEnd + "%";
  }

  renderSections = () => {
    var num = 0;
    var arr = [];
    if (!this.props.translations) return;
    this.props.translations.forEach((e) => {
      arr.push(
        <span className="section-translation">
          <span className="section-number"> {num + 1} </span>
          {e.translation}
        </span>
      );
      num++;
    });
    return arr;
  };

  render() {
    return (
      <div
        id="right-studio"
        style={{ opacity: this.props.currentSection > -1 ? 0.3 : 1 }}
      >
        {this.renderSections()}
      </div>
    );
  }
}
RightStudio.contextType = LangContext;

export default RightStudio;
