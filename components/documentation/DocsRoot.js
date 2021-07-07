import React, { useEffect, useState } from "react";
import reactparser from "html-react-parser";
import { parser } from "../../services/react-custom-markdown/mdparser";
import Link from "next/link";

/*
MARKDOWN FILES IMPORTED

File Naming convention: docs{number}

*/


export default function DocsRoot({paramURL}){
  //In order ("num" property  not actually used, just so you know what index it is")
  const docOptions = [
    { url: "/", name: "Overview", isPrimary: true, num: 0},
    { url: "/generalusage", name: "General Usage", isPrimary: false, num: 1 },
  ];

  const num  = 0;
  for(let i = 0;i<docOptions.length;i++){
    if(docOptions[url]==paramURL) num = i;
  }

  const thisDoc = require(`./markdownfiles/docs${num}.md`).default;
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
      if (num == i) {
        classList += " focused";
      }
      optionsArr.push(
        <li>
          <Link href={`/documentation${docOptions[i].url}`}>
          <a
            className={classList}
          >
            {docOptions[i].name}
            </a>
          </Link>
        </li>
      );
    }
    setOptions(optionsArr);
    setText(parser(thisDoc));
  }, []);

  return (
    <div>
      <div className="docs-header-container">
        <h1 className="docs-header">Translationeer Documentation</h1>
      </div>
      <div id="docs-container">
        <div className="docs-col1">
          <ul className="docs-options">
            {options}
          </ul>
        </div>
        <div className="docs-col2">
          <section id="docs-body">{reactparser(text)}</section>
        </div>
      </div>
    </div>
  );
};
