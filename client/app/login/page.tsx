"use client";
import UserContext from "context/AccountContext";
import LoginPanel from "./LoginPanel";

const Login = () => {
  return (
    <div>
      <UserContext>
        <LoginPanel />
      </UserContext>
    </div>
  );
};
export default Login;
