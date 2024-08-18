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
  const noHeaderFooter = ["/users/signup", "/users/login"];
  const hideHeaderFooter = noHeaderFooter.includes(location.pathname);

  return (
    <>
    {!hideHeaderFooter && <Header />}   
      <main className={hideHeaderFooter? "no-headerfooter" : ""}>{children}</main>
    {!hideHeaderFooter && <Footer />}   
    </>
  );
};

export default Layout;
