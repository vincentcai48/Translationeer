import Account from "../../components/Account";
import React, { useContext } from "react";
import { LangContext } from "../../services/context";

export default function Container() {
  useContext(LangContext).setTitle("Translationeer Account");
  return <Account />;
}
