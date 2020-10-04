import React from "react";
import { validate } from "../services/validate";
import ReactHtmlParser from "react-html-parser";
import Loading from "./Loading";

//PROPS: String word, Object() api (with a name, url, and cssSelector)
class InnerDefinition extends React.Component {
  constructor(props) {
    super();
    this.state = {
      finalDefinition: null,
    };
  }

  componentDidMount() {
    console.log("Mounting");
    this.fetchDefinition();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.word !== prevProps.word ||
      this.props.api !== prevProps.api
    ) {
      this.setState({ finalDefinition: null });
      this.fetchDefinition();
    }
  }

  fetchDefinition = async () => {
    var word = validate.replaceChars(this.props.word);
    const url = this.props.api.url.replace("{{keyword}}", word);
    const a = await fetch(url);
    const b = await a.text();
    console.log("Final Definition" + b);
    this.setState({ finalDefinition: b });
  };

  render() {
    console.log("WORD: " + this.props.word);
    var link = this.props.api.link
      ? this.props.api.link.replace("{{keyword}}", this.props.word)
      : false;
    return (
      <div className={"definition " + this.props.api.cssSelector}>
        <h4 className="api-name">{this.props.api.name}</h4>
        {this.state.finalDefinition ? (
          <div className="definition-body">
            {ReactHtmlParser(this.state.finalDefinition)}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

export default InnerDefinition;
