import { Route, Routes } from "react-router-dom";
import LoginAffiliate from "../container/auth/Affiliate";

const AuthAffiliate = () => {
  return (
    <div>
      <Routes>
        <Route path="/auth/login-affiliate" element={<LoginAffiliate />} />
      </Routes>
    </div>
  );
};
export default AuthAffiliate;
