import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import MyPage from "./pages/MyPage";
import StreetCats from "./pages/streetCat/StreetCat";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Layout from "./components/layout/Layout";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/community/CommunityDetail";
import StreetCatWrite from "./pages/streetCat/StreetCatWrite";
import StreetCatDetail from "./pages/streetCat/StreetCatDetail";
import Event from "./pages/event/Event";
import EventDetail from "./pages/event/EventDetail";
import Home from "./pages/Home/Home";
import CommunityPostEdit from "./pages/community/CommunityPostEdit";

const routeList = [
  { path: "/", element: <Home /> },
  {
    path: "/users/my",
    element: <MyPage />,
  },
  {
    path: "/boards/street-cats",
    element: <StreetCats />,
  },
  {
    path: "/boards/street-cats/:id",
    element: <StreetCatDetail />,
  },
  {
    path: "/boards/street-cats/write",
    element: <StreetCatWrite />,
  },
  {
    path: "/users/login",
    element: <Login />,
  },
  {
    path: "/users/signup",
    element: <Signup />,
  },
  {
    path: "/boards/communities",
    element: <Community />,
  },
  {
    path: "/boards/communities/:id",
    element: <CommunityDetail />,
  },
  {
    path: "/boards/communities/edit/:id",
    element: <CommunityPostEdit />,
  },
  {
    path: "/boards/events",
    element: <Event />,
  },
  {
    path: "/boards/events/:id",
    element: <EventDetail />,
  },
];

const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: <Layout>{item.element}</Layout>,
    };
  })
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
