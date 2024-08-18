import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { StreetCats } from "./pages/streetCat/StreetCat";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Layout from "./components/layout/Layout";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/community/CommunityDetail";
import Chat from "./pages/chat/Chat";
import MyPage from "./pages/mypage/MyPage";
import ChatList from "./pages/chat/ChatList";
import ChatTest from "./pages/chat/ChatTest";

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
    elemennt: <Community />,
  },
  {
    path: "/boards/communities/:id",
    element: <CommunityDetail />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/chattest",
    element: <ChatTest />,
  },
  {
    path: "/chat/chatlist",
    element: <ChatList />,
  },
];

const router = createBrowserRouter(
  routeList.map((item) => {
    if (item.path === "/chat" || item.path === "/chattest") {
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
