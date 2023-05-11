import { Route, Routes } from "react-router-dom";

import ManageFeedback from "../container/System/ManageFeedback";
import ManagePushNotification from "../container/System/ManagePushNotification";
import ManageSetting from "../container/System/ManageSetting";
import ChildPromotion from "../container/System/ManagePromotion/ChildPromotion";
import Home from "../container/System/Dashboard/DashBoard";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profiles from "../container/System/ManageUser/Customer/Profiles";
import DetailsOrder from "../container/System/DetailsOrder";
import DetailsOrderSchedule from "../container/System/DetailsOrder/OrderScheduleDetails";
import ManageOrder from "../container/System/ManageOrder";
import ManageReport from "../container/System/ManageReport";

const Marketing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route
        path="/details-order/details-order-schedule"
        element={<DetailsOrderSchedule />}
      />
      <Route path="/group-order/manage-order" element={<ManageOrder />} />

      <Route path="/promotion/manage-setting" element={<ManageSetting />} />
      <Route path="/system/user-manage" element={<ManageCustomer />} />
      <Route
        path="/system/user-manage/details-customer"
        element={<Profiles />}
      />
      <Route path="/profile-customer" element={<Profiles />} />
      <Route
        path="/promotion/manage-setting/child-promotion"
        element={<ChildPromotion />}
      />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route
        path="/notification/manage-push-notification"
        element={<ManagePushNotification />}
      />
      <Route path="/feedback/manage-feedback" element={<ManageFeedback />} />
    </Routes>
  );
};

export default Marketing;
