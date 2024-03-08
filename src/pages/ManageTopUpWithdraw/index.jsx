import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TransferCollaborator from "./TransferCollaborator";
import TransferCustomer from "./TransferCustomer";
import CustomTab from "../../components/customTab/CustomTab";
import TransferStaff from "./TransferStaff";

const ManageTopUpWithdraw = () => {
  const tempData = [
    {
      label: "Cộng tác viên",
      children: <TransferCollaborator />,
    },
    {
      label: "Khách hàng",
      children: <TransferCustomer />,
    },

    {
      label: "Nhân viên",
      children: <TransferStaff />,
    },
  ];
  return (
    <>
      <CustomTab dataItems={tempData} />
    </>
  );
};

export default ManageTopUpWithdraw;
