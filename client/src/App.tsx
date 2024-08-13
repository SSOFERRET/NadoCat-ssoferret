import { BrowserRouter,Routes, Route } from "react-router-dom";
import MyPage from "./pages/MyPage";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";

const App: React.FC = () => {
  return (
  <QueryClientProvider client={queryClient}>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<MyPage/>} />
    </Routes>
   </BrowserRouter>
  </QueryClientProvider>

  )
}

export default App;
