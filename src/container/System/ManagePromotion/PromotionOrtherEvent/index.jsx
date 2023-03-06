import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../redux/selectors/service";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";

const ManagePromotionEvent = ({ type, brand }) => {
  const service = useSelector(getService);
  const [tab, setTab] = useState("tat_ca");
  const [id, setId] = useState("");
  const dataTab = [
    {
      idService: "",
      kind: "tat_ca",
      title: "Tất cả",
    },
  ];

  service.map((item) => {
    dataTab.push({
      idService: item?._id,
      kind: item?.kind,
      title: item?.title?.vi,
    });
  });
  return (
    <div className=" ml-2 mt-3">
      <div className="div-tab">
        {dataTab?.map((item, index) => {
          return (
            <div
              key={index}
              className="tab"
              onClick={() => {
                setTab(item?.kind);
                setId(item?.idService);
              }}
            >
              <a
                className={
                  tab === item?.kind
                    ? "text-title-tab"
                    : "text-title-tab-default"
                }
              >
                {item?.title}
              </a>
              <div className={tab === item?.kind ? "tab-line" : ""}></div>
            </div>
          );
        })}
      </div>
      <div>
        <PromotionManage
          type={type}
          brand={brand}
          idService={id}
          exchange={""}
          tab={tab}
        />
      </div>
    </div>
  );
};

export default ManagePromotionEvent;
