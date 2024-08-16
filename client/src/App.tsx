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
import ChatList from "./pages/chat/ChatList";

const routeList = [
  {
    path: "/users/my",
    element: <MyPage />,
  },
  {
    path: "/boards/street-cats",
    element: <StreetCats />,
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
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/chat/chatlist",
    element: <ChatList />,
  },
];

const router = createBrowserRouter(
  routeList.map((item) => {
    if (item.path === "/chat") {
      return item;
    }
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
