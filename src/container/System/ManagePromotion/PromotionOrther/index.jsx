import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../redux/selectors/service";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";

const ManagePromotionOrther = (props) => {
  const { type, brand, currentPage, setCurrentPage, startPage, setStartPage } =
    props;
  const [tab, setTab] = useState("no_exchange");
  const [id, setId] = useState("");

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
                {item?.title}
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
  { id: 1, title: "Tặng", tab: "no_exchange" },
  { id: 2, title: "Điểm quy đổi", tab: "exchange" },
];
