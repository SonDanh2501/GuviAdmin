import { useState } from "react";
import "./index.scss";
import FinanceCollaborator from "./FinanceCollaborator";
import FinanceCustomer from "./FinanceCustomer";

const ManageFinance = () => {
  const [tab, setTab] = useState("ctv");

  console.log(tab);
  return (
    <>
      <div className="div-map-item">
        {DATA?.map((item, index) => {
          return (
            <div
              onClick={() => setTab(item?.value)}
              className={
                item?.value === tab
                  ? "div-item-finance-select"
                  : "div-item-finance"
              }
            >
              <a className="text-item">{item?.title}</a>
            </div>
          );
        })}
      </div>
      {tab === "ctv" ? <FinanceCollaborator /> : <FinanceCustomer />}
    </>
  );
};

export default ManageFinance;

const DATA = [
  {
    id: 1,
    title: "Cộng tác viên",
    value: "ctv",
  },
  {
    id: 2,
    title: "Khách hàng",
    value: "kh",
  },
];
