import React from "react";
import { LangContext } from "../../services/context";

//PROPS: Array[Map()] translations, the body of a document, Number currentSection, String docColor
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
      var splitByLinebreak = e.translation.split(this.context.linebreakCode);
      var arr2 = [];
      splitByLinebreak.forEach((p) => {
        arr2.push(<span>{p}</span>);
        arr2.push(<br></br>);
      });
      arr2.pop();
      arr.push(
        <span className="section-translation">
          <span className="section-number"> {num + 1} </span>
          {arr2}
        </span>
      );
      num++;
    });
    return arr;
  };

  closeTranslationMobile = () => {
    document.getElementById("right-studio").style.display = "none";
  };

  render() {
    return (
      <div
        id="right-studio"
        style={{
          opacity:
            this.props.currentSection > -1 && !this.context.isMobile ? 0.3 : 1,
        }}
      >
        {this.context.isMobile && (
          <button className="x-out-ft" onClick={this.closeTranslationMobile}>
            <i class="fas fa-times"></i>
          </button>
        )}
        {this.renderSections()}
      </div>
    );
  }
}
RightStudio.contextType = LangContext;

export default RightStudio;
