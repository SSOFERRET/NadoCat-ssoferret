import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/css/components/layout/layout.css";

const Layout: React.FC = () => {
  const location = useLocation();
  const noHeaderFooter = ["/users/signup", "/users/login"];
  const hideHeaderFooter = noHeaderFooter.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className={hideHeaderFooter ? "no-headerfooter" : ""}>
        <Outlet />
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
