import { Navigate, Route, Routes } from "react-router-dom";
import ManageTopup from "../container/System/ManageTopup";
import ManageReport from "../container/System/ManageReport";
import DetailsOrder from "../container/System/DetailsOrder";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";

const Accountant = () => {
  return (
    <Routes>
      <Route path="/topup/manage-topup" element={<ManageTopup />} />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route path="/report/manage-report/all" element={<ManageReport />} />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route path="/details-collaborator" element={<ProfileCollaborator />} />
    </Routes>
  );
};

export default Accountant;
