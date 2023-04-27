import { useState } from "react";
import "./index.scss";
import TableExpired from "./TableExpired";

const OrderExpired = () => {
  const [tab, setTab] = useState("system");
  return (
    <div>
      <div className="div-tab-expired">
        {TAB.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => setTab(item.value)}
              className={
                tab === item.value ? "div-item-tab-select" : "div-item-tab"
              }
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <TableExpired status={tab} />
      </div>
    </div>
  );
};

export default OrderExpired;

const TAB = [
  {
    title: "Hệ thống huỷ",
    value: "system",
  },
  {
    title: "Cộng tác viên huỷ",
    value: "collaborator",
  },
];
