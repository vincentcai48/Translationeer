import DocsRoot from "../../components/documentation/DocsRoot";
import React, { useContext } from "react";
import PContext from "../../services/context";
import { useRouter } from "next/router";

export default function Container() {
  const { query } = useRouter();
  const { name } = query;
  return <DocsRoot paramURL={`/${name}`} />;
}
