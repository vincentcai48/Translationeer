import Header from "../Header.js";

const Layout = ({ children }) => {
  return (
    <>
      <Header></Header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
