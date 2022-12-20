"use client";
import UserContext from "context/AccountContext";
import SignUpPanel from "./SignUpPanel";

const Login = () => {
  return (
    <div>
      <UserContext>
        <SignUpPanel />
      </UserContext>
    </div>
  );
};
export default Login;
