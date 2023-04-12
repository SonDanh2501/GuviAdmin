import { Navigate, Route, Routes } from "react-router-dom";
import ManageTopup from "../container/System/ManageTopup";
import ManageReport from "../container/System/ManageReport";

const Accountant = () => {
  return (
    <Routes>
      <Route path="/topup/manage-topup" element={<ManageTopup />} />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route path="/report/manage-report/all" element={<ManageReport />} />
    </Routes>
  );
};

export default Accountant;
