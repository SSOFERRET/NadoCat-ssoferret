import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/scss/components/layout/layout.scss";
import { authPaths, postPaths, boardsDetailRegex } from "./LayoutRouter";

const Layout: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  
  const shouldHideHeaderFooter = () => {
    const isAuthPath = authPaths.includes(pathname);
    const isPostFormPage = postPaths.some(path => pathname.includes(path));
    const isBoardsDetailPath = boardsDetailRegex.test(pathname);
  
    return isAuthPath || isPostFormPage || isBoardsDetailPath;
  };

  const hideHeaderFooter = shouldHideHeaderFooter();

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
