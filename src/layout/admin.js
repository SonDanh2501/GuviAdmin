import { Navigate, Route, Routes } from "react-router-dom";

import ManagePushNotification from "../container/System/ManagePushNotification";
import FeedbackManage from "../container/System/ManageFeedback/FeedbackManage";
import ManageSetting from "../container/System/ManageSetting";
import Home from "../container/System/Dashboard/DashBoard";
import DeepCleaningManager from "../container/System/ManageDeepCleaning";
import DetailsOrder from "../container/System/DetailsOrder";
import DetailsOrderSchedule from "../container/System/DetailsOrder/OrderScheduleDetails";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";
import Profiles from "../container/System/ManageUser/Customer/Profiles";
import ManageCustomer from "../container/System/ManageUser/Customer";
import ManageCollaborator from "../container/System/ManageUser/Collaborator";
import DetailActivityCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/components/DetailActivity";
import OrderUsePromotion from "../container/System/ManagePromotion/OrderUsePromotion";
import GroupServiceManage from "../container/System/ManageService/ManageGroupService/ManageGroupService/GroupServiceManage";
import ServiceManage from "../container/System/ManageService/ManageService/ServiceManage";
import ManageOrder from "../container/System/ManageOrder";
import AddOrder from "../container/System/ManageOrder/DrawerAddOrder";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";
import ManageTopup from "../container/System/ManageTopup";
import ManageFinance from "../container/System/ManageFinance";
import GroupCustomerManage from "../container/System/ManageConfiguration/ScreenConfiguration/GroupCustomer";
import ManageReport from "../container/System/ManageReport";
import DetailReportManager from "../container/System/ManageReport/DetailsReportCollaborator";
import DetailRegisterCustomer from "../container/System/ManageReport/ReportUser/DetailRegisterCustomer";
import ReportInviteDetails from "../container/System/ManageReport/ReportInvite/ReportInviteDetails";
import ManageConfiguration from "../container/System/ManageConfiguration/ManageConfiguration";
import ReasonManage from "../container/System/ManageSetting/ManageReason/ReasonManage";
import AppCustomer from "../container/System/ManageConfiguration/ScreenConfiguration/AppCustomer";
import AppCollaborator from "../container/System/ManageConfiguration/ScreenConfiguration/AppCollaborator";
import SettingQrCode from "../container/System/ManageConfiguration/ScreenConfiguration/SettingQrcode";
import CreateAccount from "../container/System/ManageConfiguration/ScreenConfiguration/CreateAccount";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/system/deep-cleaning" element={<DeepCleaningManager />} />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route
        path="/details-order/details-order-schedule"
        element={<DetailsOrderSchedule />}
      />
      <Route path="/details-collaborator" element={<ProfileCollaborator />} />
      <Route path="/details-customer" element={<Profiles />} />
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
        path="/system/collaborator-manage/details-collaborator/details-activity"
        element={<DetailActivityCollaborator />}
      />
      <Route path="/promotion/manage-setting" element={<ManageSetting />} />

      <Route
        path="/promotion/manage-setting/order-promotion"
        element={<OrderUsePromotion />}
      />

      <Route
        path="/services/manage-group-service"
        element={<GroupServiceManage />}
      />
      <Route
        path="/services/manage-group-service/manage-service"
        element={<ServiceManage />}
      />
      <Route path="/feedback/manage-feedback" element={<FeedbackManage />} />
      <Route path="/group-order/manage-order" element={<ManageOrder />} />

      <Route
        path="/group-order/manage-order/create-order"
        element={<AddOrder />}
      />
      <Route
        path="/group-order/manage-order/details-collaborator"
        element={<ProfileCollaborator />}
      />
      <Route
        path="/group-order/manage-order/details-customer"
        element={<Profiles />}
      />
      <Route path="/profile-customer" element={<Profiles />} />
      <Route path="/group-order/manage-order/all" element={<ManageOrder />} />
      <Route
        path="/group-order/manage-order/doing"
        element={<OrderDoingManage />}
      />

      <Route path="/topup/manage-topup" element={<ManageTopup />} />
      <Route path="/finance/manage-finance" element={<ManageFinance />} />

      <Route
        path="/adminManage/manage-configuration/manage-group-customer"
        element={<GroupCustomerManage />}
      />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route path="/report/manage-report/all" element={<ManageReport />} />
      <Route
        path="/report/manage-report/report-details"
        element={<DetailReportManager />}
      />
      <Route
        path="/report/manage-report/details-register-customer"
        element={<DetailRegisterCustomer />}
      />

      <Route
        path="/report/manage-report/details-customer-invite"
        element={<ReportInviteDetails />}
      />

      <Route
        path="/notification/manage-push-notification"
        element={<ManagePushNotification />}
      />

      <Route
        path="/adminManage/manage-configuration"
        element={<ManageConfiguration />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-reason"
        element={<ReasonManage />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-app-customer"
        element={<AppCustomer />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-app-collaborator"
        element={<AppCollaborator />}
      />
      <Route
        path="/adminManage/manage-configuration/setting-qrcode"
        element={<SettingQrCode />}
      />
      <Route
        path="/adminManage/manage-configuration/create-account"
        element={<CreateAccount />}
      />
    </Routes>
  );
};

export default Admin;
