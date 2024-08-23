import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/userStore";

type Props = {
  children: React.ReactNode;
};

const ProtectedPath = ({ children }: Props) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/users/login" replace={true} />;
  }

  return children;
};

export default ProtectedPath;
