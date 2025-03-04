import { Route, Routes } from "react-router-dom";
import LoginAffiliate from "../container/auth/Affiliate";
import OverView from "../container/System/Affiliate/OverView/index";
import ReferredList from "../container/System/Affiliate/ReferredList/index";

const Affiliate = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<OverView />} />
        <Route path="/referred-list" element={<ReferredList />} />
        <Route path="*" element={<OverView />} />
      </Routes>
    </div>
  );
};
export default Affiliate;
