import { Route, Routes } from "react-router-dom";

import DetailsOrder from "../container/System/DetailsOrder";
import DeepCleaningManager from "../container/System/ManageDeepCleaning";
import ManageFeedback from "../container/System/ManageFeedback";
import ManageOrder from "../container/System/ManageOrder";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profiles from "../container/System/ManageUser/Customer/Profiles";
import AddOrder from "../container/System/ManageOrder/DrawerAddOrder";
import DetailsOrderSchedule from "../container/System/DetailsOrder/OrderScheduleDetails";
import OrderExpired from "../container/System/ManageOrder/OrderExpired";

const SupportCustomer = () => {
  return (
    <Routes>
      <Route path="/group-order/manage-order" element={<ManageOrder />} />
      <Route path="/details-customer" element={<Profiles />} />
      <Route
        path="/group-order/manage-order/create-order"
        element={<AddOrder />}
      />
      <Route
        path="/details-order/details-order-schedule"
        element={<DetailsOrderSchedule />}
      />
      <Route path="/group-order/manage-order/all" element={<ManageOrder />} />
      <Route
        path="/group-order/manage-order/doing"
        element={<OrderDoingManage />}
      />
      <Route path="/group-order/manage-order/done" element={<OrderExpired />} />
      <Route path="/system/deep-cleaning" element={<DeepCleaningManager />} />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route path="/system/user-manage" element={<ManageCustomer />} />
      <Route
        path="/system/user-manage/details-customer"
        element={<Profiles />}
      />
      <Route path="/profile-customer" element={<Profiles />} />

      <Route path="/feedback/manage-feedback" element={<ManageFeedback />} />
    </Routes>
  );
};

export default SupportCustomer;
