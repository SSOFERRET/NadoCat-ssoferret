import { BrowserRouter,Routes, Route } from "react-router-dom";
import MyPage from "./pages/MyPage";
import React from "react";
import { StreetCats } from "./pages/streetCat/StreetCat";

const App: React.FC = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<MyPage/>} />
      <Route path="/boards/street-cats" element={<StreetCats/>} />
    </Routes>
   </BrowserRouter>

  )
}

export default App;
