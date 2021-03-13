import { useEffect, useState } from "react";
import { parser } from "../../services/react-custom-markdown/mdparser";
import ReactHtmlParser from "react-html-parser";
import React from "react";

export default function PrivacyPolicy() {
  const [text, setText] = useState("");
  useEffect(() => {
    var mdfile = require("./markdownfiles/termsandconditions.md");
    setText(parser(mdfile.default));
    return () => {};
  }, []);

  return (
    <div>
      <div className="legal-container">{ReactHtmlParser(text)}</div>
    </div>
  );
}
