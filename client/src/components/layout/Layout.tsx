import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { useLocation } from "react-router-dom";
import "../../styles/css/components/layout/layout.css";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const location = useLocation();
  const noHeaderFooter = ["/signup", "/login"];
  const hideHeaderFooter = noHeaderFooter.includes(location.pathname);

  return (
    <>
    {!hideHeaderFooter && <Header />}   
      <main>{children}</main>
    {!hideHeaderFooter && <Footer />}   
    </>
  );
};

export default Layout;
