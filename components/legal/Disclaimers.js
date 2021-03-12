import { useEffect, useState } from "react";
import { parser } from "../../services/react-custom-markdown/mdparser";
import disclaimers from "./markdownfiles/disclaimers.md";
import ReactHtmlParser from "react-html-parser";
import React from "react";

export default function PrivacyPolicy() {
  const [text, setText] = useState("");
  useEffect(async () => {
    var res = await fetch(disclaimers);
    res = await res.text();
    setText(parser(res));
  }, []);

  return (
    <div>
      <div className="legal-container">{ReactHtmlParser(text)}</div>
    </div>
  );
}
