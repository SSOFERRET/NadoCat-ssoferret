import React from "react";

export interface SignupProps {
    email: string;
    password: string;
    nickname: string;
  }
  

const Signup = () => {
  return (
    <div>
      <h1>회원가입</h1>
    </div>
  );
};

export default Signup;

