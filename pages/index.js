import { useContext } from "react";
import { LangContext } from "../services/context.js";
import Home from "./../components/Home.js";

export default function Index() {
  useContext(LangContext).setTitle("Translationeer");
  return <Home />;
}
