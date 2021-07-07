import React, { useEffect, useState } from "react";
import reactparser from "html-react-parser";
import { parser } from "../../services/react-custom-markdown/mdparser";

/*
MARKDOWN FILES IMPORTED

File Naming convention: docs{number}
import variable naming convention: Docs# 

s*/


export default function DocsRoot({num}){
  //All Docs options, IN ORDER (starting from 0)
  var Docs0, Docs1;
  Docs0 = require("./markdownfiles/(0)Overview.md").default;
  Docs1 = require("./markdownfiles/(1)General Usage.md").default;
  const docOptions = [
    { name: "Overview", isPrimary: true, text: Docs0 },
    { name: "General Usage", isPrimary: false, text: Docs1 },
  ];

  const [page, setPage] = useState(0);
  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  //when switch the page, do two things: 1, get the content of the markdown file to display; 2: reset the button options to highlight the current one
  useEffect(() => {
    setIsLoading(true);

    //reset button options
    var optionsArr = [];
    for (var i = 0; i < docOptions.length; i++) {
      var classList = docOptions[i].isPrimary
        ? "docs-option-primary"
        : "docs-option-secondary";
      if (page == i) {
        classList += " focused";
      }
      console.log(classList);
      optionsArr.push(
        <li>
          <button
            className={classList}
            onClick={(e) => {
              console.log(e.target.name);
              setPage(e.target.name);
            }}
            name={i}
          >
            {docOptions[i].name}
          </button>
        </li>
      );
    }
    setOptions(optionsArr);

    setText(parser(docOptions[page].text));

    //get markdown file;
    // fetch(docOptions[page].file)
    //   .then((res) => res.text())
    //   .then((text) => console.log(text));
    // // .then((text) => {
    // //   console.log(text);
    // //   text = parser(text);
    // //   setText(text);
    // //   setIsLoading(false);
    // // });
  }, [page]);

  return (
    <div>
      <div className="docs-header-container">
        <h1 className="docs-header">Translationeer Documentation</h1>
      </div>
      <div id="docs-container">
        <div className="docs-col1">
          <ul className="docs-options">
            {options}
            {/* <li>
              <button className="docs-option-primary" name={0}>
                Overview
              </button>
            </li>
            <li>
              <button className="docs-option-secondary">General Usage</button>
            </li> */}
          </ul>
        </div>
        <div className="docs-col2">
          <section id="docs-body">{reactparser(text)}</section>
        </div>
      </div>
    </div>
  );
};
