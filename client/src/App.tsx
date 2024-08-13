import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyPage from "./pages/MyPage";
import { StreetCats } from "./pages/streetCat/StreetCat";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Layout from "./components/layout/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/users/my"
          element={
            <Layout>
              <MyPage />
            </Layout>
          }
        />
        <Route
          path="/boards/street-cats"
          element={
            <Layout>
              <StreetCats />
            </Layout>
          }
        />
        <Route
          path="/users/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/users/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
