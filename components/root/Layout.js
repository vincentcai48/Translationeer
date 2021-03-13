import { useContext } from "react";
import { LangContext } from "../../services/context.js";
import Footer from "../Footer.js";
import Header from "../Header.js";
import CustomHead from "./CustomHead.js";

const Layout = ({ children }) => {
  const context = useContext(LangContext);
  return (
    <>
      <CustomHead title={context.title} />
      <Header></Header>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
