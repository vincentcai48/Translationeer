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
    var url = "https://us-central1-translationeer.cloudfunctions.net/app";
    url += this.props.api.url.replace("{{keyword}}", word);
    try {
      const a = await fetch(url);

      const b = await a.text();

      this.setState({ finalDefinition: b });
    } catch (e) {
      this.setState({ finalDefinition: "Error" });
    }
  };

  render() {
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
