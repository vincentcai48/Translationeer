import { useContext } from "react";
import PContext from "../../services/context";
import Footer from "../Footer";
import Header from "../Header";
import CustomHead from "./CustomHead";

const Layout = ({ children }) => {
  const { title } = useContext(PContext);
  return (
    <>
      <CustomHead title={title} />
      <Header></Header>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
