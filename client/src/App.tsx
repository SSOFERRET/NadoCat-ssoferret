import { BrowserRouter,Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import MyPage from "./pages/MyPage";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { StreetCats } from "./pages/streetCat/StreetCat";
import { Layout } from "./components/layout/Layout";

const routeList = [
  {
    path: "/",
    elemet: <MyPage />
  },
  {
    path: "/boards/street-cats",
    elemet: <StreetCats />
  },
]

const router = createBrowserRouter(routeList.map((item) => {
  return {
    ...item,
    element: <Layout>{item.elemet}</Layout>,
  }
}))

const App: React.FC = () => {
  return (
  <QueryClientProvider client={queryClient}>
   <RouterProvider router={router}/>
  </QueryClientProvider>
  )
}

export default App;
