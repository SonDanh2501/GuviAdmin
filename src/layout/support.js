import { Navigate, Route, Routes } from "react-router-dom";
import DeepCleaningManager from "../container/System/ManageDeepCleaning";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profiles from "../container/System/ManageUser/Customer/Profiles";
import ManageCollaborator from "../container/System/ManageUser/Collaborator";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";
import ManageOrder from "../container/System/ManageOrder";
import ManageTopup from "../container/System/ManageTopup";
import ManageReport from "../container/System/ManageReport";
import DetailsOrder from "../container/System/DetailsOrder";

const Support = () => {
  return (
    <Routes>
      <Route path="/group-order/manage-order" element={<ManageOrder />} />
      <Route path="/group-order/manage-order/all" element={<ManageOrder />} />
      <Route
        path="/group-order/manage-order/doing"
        element={<OrderDoingManage />}
      />
      <Route path="/profile-customer" element={<Profiles />} />
      <Route path="/system/deep-cleaning" element={<DeepCleaningManager />} />
      <Route path="/system/user-manage" element={<ManageCustomer />} />
      <Route
        path="/system/user-manage/details-customer"
        element={<Profiles />}
      />
      <Route
        path="/system/collaborator-manage"
        element={<ManageCollaborator />}
      />
      <Route
        path="/system/collaborator-manage/details-collaborator"
        element={<ProfileCollaborator />}
      />
      <Route
        path="/group-order/manage-order/details-collaborator"
        element={<ProfileCollaborator />}
      />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route path="/details-collaborator" element={<ProfileCollaborator />} />
      <Route path="/topup/manage-topup" element={<ManageTopup />} />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route path="/report/manage-report/all" element={<ManageReport />} />
    </Routes>
  );
};

export default Support;
