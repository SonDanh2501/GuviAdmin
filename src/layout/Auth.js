import { Route, Routes } from "react-router-dom";
import Login from "../container/auth/Login";

const Auth = () => {
  return (
    <div>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default Auth;
