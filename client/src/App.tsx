import { BrowserRouter,Routes, Route } from "react-router-dom";
import MyPage from "./pages/MyPage";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { StreetCats } from "./pages/streetCat/StreetCat";

const App: React.FC = () => {
  return (
  <QueryClientProvider client={queryClient}>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<MyPage/>} />
      <Route path="/boards/street-cats" element={<StreetCats/>} />
    </Routes>
   </BrowserRouter>
  </QueryClientProvider>

  )
}

export default App;
