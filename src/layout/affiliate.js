import { Route, Routes } from "react-router-dom";
import LoginAffiliate from "../container/auth/Affiliate";

const Affiliate = () => {
    return (
      <div>
        <Routes>
          <Route path="/auth/login-affiliate" element={<LoginAffiliate />} />
          <Route path="/" element={<LoginAffiliate />} />
        </Routes>
      </div>
    );
  };
  export default Affiliate;
  