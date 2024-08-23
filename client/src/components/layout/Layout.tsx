import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/scss/components/layout/layout.scss";

const Layout: React.FC = () => {
  const location = useLocation();
  const noHeaderFooterPaths = ["/users/signup", "/users/login", "/chats/chat"];
  const isHeaderFooterHidden = noHeaderFooterPaths.includes(location.pathname);
  const isPostFormPage = location.pathname.includes("/write") || location.pathname.includes("/edit");
  const boardsDetailRegex = /\/boards\/(communities|events)\/\d+$/;
  const isBoardsDetailPath = boardsDetailRegex.test(location.pathname);

  const hideHeaderFooter = isHeaderFooterHidden || isPostFormPage || isBoardsDetailPath;

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
