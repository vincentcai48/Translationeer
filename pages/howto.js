import HowTo from "../components/documentation/Howto.js";
import React, { useContext } from "react";
import { LangContext } from "../services/context.js";

export default function HowToContainer() {
  useContext(LangContext).setTitle("Translationeer How To");
  return <HowTo />;
}
