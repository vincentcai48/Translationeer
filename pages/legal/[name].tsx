import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import React from "react";
import { useRouter } from "next/router";

export default function Legal() {
  const {query:{name}} = useRouter();
  var text = "";
    try{
      console.log(name);
      var mdfile = require(`../../components/legal/markdownfiles/${name}.md`);
      text = (mdfile.default);
    }catch(e){
      text = "";
      console.error(e);
    }

  return (
    <div>
      <div className="legal-container"><ReactMarkdown>{text}</ReactMarkdown></div>
    </div>
  );
}
