import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/scss/components/layout/layout.scss";
import { authPaths, postPaths, boardsDetailRegex, chatPaths } from "./LayoutRouter";
import HomeCat from "../common/HomeCat";
import AlertMeesageContainer from "../common/alertMessage/AlertMeesageContainer";

const Layout: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  const shouldHideHeaderFooter = () => {
    const isAuthPath = authPaths.includes(pathname);
    const isPostFormPage = postPaths.some((path) => pathname.includes(path));
    const isBoardsDetailPath = boardsDetailRegex.test(pathname);
    const isChatPaths = chatPaths.includes(pathname);

    return isAuthPath || isPostFormPage || isBoardsDetailPath || isChatPaths;
  };

  const hideHeaderFooter = shouldHideHeaderFooter();

  return (
    <div className="main-layout">
      <HomeCat />
      <section className="main-container">
        {!hideHeaderFooter && <Header />}
        <main className={hideHeaderFooter ? "no-headerfooter" : ""}>
          <Outlet />
        </main>
        {!hideHeaderFooter && <Footer />}
        <AlertMeesageContainer />
      </section>
    </div>
  );
};

export default Layout;
