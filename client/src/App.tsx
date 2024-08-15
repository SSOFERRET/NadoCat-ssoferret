import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { StreetCats } from "./pages/streetCat/StreetCat";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Layout from "./components/layout/Layout";
import Community from "./pages/community/Community";
import Chat from "./pages/chat/Chat";
import MyPage from "./pages/mypage/MyPage";

const routeList = [
  {
    path: "/users/my",
    elemet: <MyPage />,
  },
  {
    path: "/boards/street-cats",
    elemet: <StreetCats />,
  },
  {
    path: "/users/login",
    elemet: <Login />,
  },
  {
    path: "/users/signup",
    elemet: <Signup />,
  },
  {
    path: "/boards/communities",
    elemet: <Community />,
  },
  {
    path: "/chat",
    elemet: <Chat />,
  },
];

const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: <Layout>{item.elemet}</Layout>,
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
