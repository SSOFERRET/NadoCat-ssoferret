import { BrowserRouter,Routes, Route } from "react-router-dom";
import MyPage from "./pages/mypage/MyPage";
import React from "react";
import Chat from "./pages/chat/Chat";

const App: React.FC = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<MyPage/>} />
      <Route path="/chat" element={<Chat/>} />
    </Routes>
   </BrowserRouter>

  )
}

export default App;
