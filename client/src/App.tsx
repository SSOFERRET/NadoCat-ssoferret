import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import MyPage from "./pages/mypage/MyPage";
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
import ErrorPage from "./pages/error/ErrorPage";
import ChatList from "./pages/chat/ChatList";
import Chat from "./pages/chat/Chat";

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
          { path: "my", element: <MyPage /> },
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
      {
        path: "chats",
        children: [
          { path: "list", element: <ChatList /> },
          { path: "chat", element: <Chat /> },
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
