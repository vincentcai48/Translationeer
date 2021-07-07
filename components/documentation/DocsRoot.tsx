import React, { useContext } from "react";
import reactparser from "html-react-parser";
import { parser } from "../../services/react-custom-markdown/mdparser";
import Link from "next/link";
import PContext from "../../services/context";

/*
MARKDOWN FILES IMPORTED

File Naming convention: docs{number}

*/

interface DocOption {
  url: string;
  name: string;
  isPrimary: boolean;
  num: number;
}

export default function DocsRoot({ paramURL }) {
  //In order ("num" property  not actually used, just so you know what index it is")
  const docOptions: DocOption[] = [
    { url: "/", name: "Overview", isPrimary: true, num: 0 },
    { url: "/generalusage", name: "General Usage", isPrimary: false, num: 1 },
  ];

  let n = 0;
  for (let i = 0; i < docOptions.length; i++) {
    if (docOptions[i].url == paramURL) n = i;
  }
  const num = n;
  useContext(PContext).setTitle(
    `${docOptions[num].name} - Translationeer Documentation`
  );
  const thisDoc = require(`./markdownfiles/docs${num}.md`).default;
  const text = parser(thisDoc);
  //Set button options
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
          <a className={classList}>{docOptions[i].name}</a>
        </Link>
      </li>
    );
  }

  return (
    <div>
      <div className="docs-header-container">
        <h1 className="docs-header">Translationeer Documentation</h1>
      </div>
      <div id="docs-container">
        <div className="docs-col1">
          <ul className="docs-options">{optionsArr}</ul>
        </div>
        <div className="docs-col2">
          <section id="docs-body">{reactparser(text)}</section>
        </div>
      </div>
    </div>
  );
}
