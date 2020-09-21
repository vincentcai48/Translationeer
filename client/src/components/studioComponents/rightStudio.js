import React from "react";

//PROPS: Array[Map()] translations, the body of a document, Number currentSection
class RightStudio extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  renderSections = () => {
    var num = 0;
    var arr = [];
    this.props.translations.forEach((e) => {
      arr.push(
        <span className="section-translation">
          <span> ({num + 1}) </span>
          {e.translation}
        </span>
      );
      num++;
    });
    return arr;
  };

  render() {
    return <div id="right-studio">{this.renderSections()}</div>;
  }
}

export default RightStudio;
