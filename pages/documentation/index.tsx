import DocsRoot from "../../components/documentation/DocsRoot";
import React, { useContext } from "react";
import PContext from "../../services/context";

export default function Container() {
  return <DocsRoot paramURL={"/"} />;
}
