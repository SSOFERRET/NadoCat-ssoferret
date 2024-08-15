import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import "../../styles/css/components/layout/layout.css";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
