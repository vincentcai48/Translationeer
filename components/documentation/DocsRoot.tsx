import React, { useContext, useState } from "react";
import ReactMarkdown from 'react-markdown'
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
  const {setTitle,isMobile} = useContext(PContext);
  const [showMenu,setShowMenu] = useState<boolean>(false);

  //In order ("num" property  not actually used, just so you know what index it is")
  const docOptions: DocOption[] = [
    { url: "/", name: "Overview", isPrimary: true, num: 0 },
    { url: "/generalusage", name: "General Usage", isPrimary: false, num: 1 },
    { url: "/howto", name: "How To Guide", isPrimary: false, num: 2 },
  ];

  let n = 0;
  for (let i = 0; i < docOptions.length; i++) {
    if (docOptions[i].url == paramURL) n = i;
  }
  const num = n;
  setTitle(
    `${docOptions[num].name} - Translationeer Documentation`
  );
  let text = ""
  try{
    text = require(`./markdownfiles/docs${num}.md`).default;
  }catch(e){
    text = "### Error!"
  }
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
        {isMobile&&<button className="tb docs-menu-button" onClick={()=>setShowMenu(!showMenu)}>Menu</button>}
        <h1 className="docs-header">Translationeer Documentation</h1>
      </div>
      <div id="docs-container">
        {(!isMobile||showMenu)&&<div className="docs-col1">
          {isMobile&&<div className="row menu-header"><h6>Menu</h6>
            <span className="tb" onClick={()=>setShowMenu(false)}>Close</span>
          </div>}
          <ul className="docs-options">{optionsArr}</ul>
        </div>}
        <div className="docs-col2">
          <section id="docs-body"><ReactMarkdown>{text}</ReactMarkdown></section>
        </div>
      </div>
    </div>
  );
}
