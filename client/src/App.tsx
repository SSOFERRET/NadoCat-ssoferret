import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
// import MyPage from "./pages/MyPage";
import StreetCats from "./pages/streetCat/StreetCat";
import {My} from "./pages/user/My";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Layout from "./components/layout/Layout";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/community/CommunityDetail";
import StreetCatWrite from "./pages/streetCat/StreetCatWrite";
import StreetCatDetail from "./pages/streetCat/StreetCatDetail";
import Event from "./pages/event/Event";
import EventDetail from "./pages/event/EventDetail";
import ImageUploadTest from "./components/imageUploadTest";
import Home from "./pages/Home/Home";
import CommunityPostEdit from "./pages/community/CommunityPostEdit";
import ErrorPage from "./pages/error/ErrorPage";
import CommunityPostWrite from "./pages/community/CommunityPostWrite";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "users",
        children: [
         // { path: "my", element: <MyPage /> },
          { path: "my", element: <My /> },
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
      {
        path: "boards",
        children: [
          {
            path: "street-cats",
            children: [
              { path: "", element: <StreetCats /> },
              { path: ":id", element: <StreetCatDetail /> },
              { path: "write", element: <StreetCatWrite /> },
            ],
          },
          {
            path: "communities",
            children: [
              { path: "", element: <Community /> },
              { path: ":id", element: <CommunityDetail /> },
              { path: "edit/:id", element: <CommunityPostEdit /> },
              { path: "write", element: <CommunityPostWrite /> },
            ],
          },
          {
            path: "events",
            children: [
              { path: "", element: <Event /> },
              { path: ":id", element: <EventDetail /> },
            ],
          },
        ],
      },
      {
        path: "imageUploadTest",
        children: [{ path: "", element: <ImageUploadTest /> }],
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
