import Dashboard from "../../components/Dashboard";
import React, { useContext } from "react";
import { LangContext } from "../../services/context";

export default function DashboardContainer() {
  useContext(LangContext).setTitle("Translationeer Dashboard");
  return <Dashboard />;
}
