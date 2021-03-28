import Comp from "../../components/documentation/DocsRoot";
import React, { useContext } from "react";
import { LangContext } from "../../services/context";

export default function Container() {
  useContext(LangContext).setTitle("Translationeer Documentation");
  return <Comp />;
}
