import { Navigate, Route, Routes } from "react-router-dom";

import ManagePushNotification from "../container/System/ManagePushNotification";
import FeedbackManage from "../container/System/ManageFeedback/FeedbackManage";
import ManageSetting from "../container/System/ManageSetting";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profiles from "../container/System/ManageUser/Customer/Profiles";
import DeepCleaningManager from "../container/System/ManageDeepCleaning";
import DetailsOrder from "../container/System/DetailsOrder";
import ManageOrder from "../container/System/ManageOrder";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";

const SupportCustomer = () => {
  return (
    <Routes>
      <Route path="/group-order/manage-order" element={<ManageOrder />} />
      <Route path="/details-customer" element={<Profiles />} />

      <Route path="/group-order/manage-order/all" element={<ManageOrder />} />
      <Route
        path="/group-order/manage-order/doing"
        element={<OrderDoingManage />}
      />
      <Route path="/system/deep-cleaning" element={<DeepCleaningManager />} />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route path="/system/user-manage" element={<ManageCustomer />} />
      <Route
        path="/system/user-manage/details-customer"
        element={<Profiles />}
      />
      <Route path="/profile-customer" element={<Profiles />} />

      <Route path="/feedback/manage-feedback" element={<FeedbackManage />} />
    </Routes>
  );
};

export default SupportCustomer;
