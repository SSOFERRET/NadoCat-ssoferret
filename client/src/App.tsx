import { BrowserRouter,Routes, Route } from "react-router-dom";
import MyPage from "./pages/mypage/MyPage";
import React from "react";

const App: React.FC = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<MyPage/>} />
    </Routes>
   </BrowserRouter>

  )
}

export default App;
