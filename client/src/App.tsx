import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import MyPage from "./pages/mypage/MyPage";
import StreetCats from "./pages/streetCat/StreetCat";
import { My } from "./pages/user/My";
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
import Missings from "./pages/missing/Missings";
import ChatList from "./pages/chat/ChatList";
import Chat from "./pages/chat/Chat";
import CommunityPostWrite from "./pages/community/CommunityPostWrite";
import EventPostWrite from "./pages/event/EventPostWrite";
import EventPostEdit from "./pages/event/EventPostEdit";
import Search from "./pages/search/Search";
import MissingDetail from "./pages/missing/MissingDetail";
import Boards from "./pages/boards/Boards";
import ProtectedPath from "./pages/protectedPath/ProtectedPath";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: "", element: <Home /> },
      {
        path: "users",
        children: [
          { path: "interest", element: <MyPage /> },
          { path: "my/:uuid", element:  <ProtectedPath><My /></ProtectedPath> },
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
          { path: "", element: <Boards /> },
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
              {
                path: "write",
                element: (
                  <ProtectedPath>
                    <CommunityPostWrite />
                  </ProtectedPath>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedPath>
                    <CommunityPostEdit />
                  </ProtectedPath>
                ),
              },
            ],
          },
          {
            path: "events",
            children: [
              { path: "", element: <Event /> },
              { path: ":id", element: <EventDetail /> },
              {
                path: "write",
                element: (
                  <ProtectedPath>
                    <EventPostWrite />
                  </ProtectedPath>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedPath>
                    <EventPostEdit />
                  </ProtectedPath>
                ),
              },
            ],
          },
          {
            path: "missings",
            children: [
              { path: "", element: <Missings /> },
              { path: ":id", element: <MissingDetail /> },
            ],
          },
        ],
      },
      {
        path: "/search",
        children: [{ path: "", element: <Search /> }],
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
