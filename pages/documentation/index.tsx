import Comp from "../../components/documentation/DocsRoot";
import React, { useContext } from "react";
import PContext from "../../services/context";

export default function Container() {
  useContext(PContext).setTitle("Translationeer Documentation");
  return <Comp />;
}
