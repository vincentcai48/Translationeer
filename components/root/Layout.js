import Footer from "../Footer.js";
import Header from "../Header.js";

const Layout = ({ children }) => {
  return (
    <>
      <Header></Header>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
