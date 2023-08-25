import { useState } from "react";
import "./index.scss";
import TableExpired from "./TableExpired";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const OrderExpired = () => {
  const lang = useSelector(getLanguageState);
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
              <p className="text-tab m-0">{`${i18n.t(item?.title, {
                lng: lang,
              })}`}</p>
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
    title: "cancel_system",
    value: "system",
  },
  {
    title: "cancel_collaborator",
    value: "collaborator",
  },
];
