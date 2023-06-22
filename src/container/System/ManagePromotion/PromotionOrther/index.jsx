import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../redux/selectors/service";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const ManagePromotionOrther = (props) => {
  const { type, brand, currentPage, setCurrentPage, startPage, setStartPage } =
    props;
  const [tab, setTab] = useState("no_exchange");
  const lang = useSelector(getLanguageState);

  return (
    <div className=" ml-2 mt-3">
      <div className="div-tab">
        {DATA_TAB?.map((item, index) => {
          return (
            <div
              className="tab"
              onClick={() => {
                setTab(item?.tab);
              }}
            >
              <a
                className={
                  tab === item?.tab
                    ? "text-title-tab"
                    : "text-title-tab-default"
                }
              >
                {`${i18n.t(item?.title, { lng: lang })}`}
              </a>
              <div className={tab === item?.tab ? "tab-line" : ""}></div>
            </div>
          );
        })}
      </div>
      <div>
        <PromotionManage
          type={type}
          brand={brand}
          idService={""}
          exchange={tab}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          startPage={startPage}
          setStartPage={setStartPage}
        />
      </div>
    </div>
  );
};

export default ManagePromotionOrther;

const DATA_TAB = [
  { id: 1, title: "give", tab: "no_exchange" },
  { id: 2, title: "redemption_points", tab: "exchange" },
];
