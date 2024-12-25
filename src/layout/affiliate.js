import { Route, Routes } from "react-router-dom";
import LoginAffiliate from "../container/auth/Affiliate";
import OverView from "../container/System/Affiliate/OverView/index";
import RefferendList from "../container/System/Affiliate/RefferendList/index";
import BankVerify from "../container/System/Affiliate/BankVerify";

const Affiliate = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<OverView />} />
        <Route path="/referend-list" element={<RefferendList />} />
        <Route path="/testing-bank" element={<BankVerify />} />
        <Route path="*" element={<OverView />} />
      </Routes>
    </div>
  );
};
export default Affiliate;
