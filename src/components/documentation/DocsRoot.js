import React, { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { parser } from "../../services/react-custom-markdown/mdparser";
import Docs1 from "./markdownfiles/docs.md";

const DocsRoot = () => {
  const [page, setPage] = useState(0);
  const [text, setText] = useState("");
  useEffect(() => {
    fetch(Docs1)
      .then((res) => res.text())
      .then((text) => {
        console.log(text);
        text = parser(text);
        setText(text);
      });
  }, []);

  return (
    <div>
      <div className="docs-header-container">
        <h1 className="docs-header">Translationeer Documentation</h1>
      </div>
      <div id="docs-container">
        <div className="docs-col1"></div>
        <div className="docs-col2">
          <section id="docs-body">{ReactHtmlParser(text)}</section>
        </div>
      </div>
    </div>
  );
};

export default DocsRoot;
