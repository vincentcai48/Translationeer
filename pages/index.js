import { useContext } from "react";
import { LangContext } from "../services/context.js";
import Home from "./../components/Home.js";

export default function Index() {
  const context = useContext(LangContext);
  if(context.setTitle) context.setTitle("Translationeer");
  return <Home />;
}
