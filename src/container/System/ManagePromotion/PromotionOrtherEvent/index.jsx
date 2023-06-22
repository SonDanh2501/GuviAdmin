import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../redux/selectors/service";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const ManagePromotionEvent = (props) => {
  const { type, brand, currentPage, setCurrentPage, startPage, setStartPage } =
    props;
  const service = useSelector(getService);
  const [tab, setTab] = useState("tat_ca");
  const [id, setId] = useState("");
  const lang = useSelector(getLanguageState);
  const dataTab = [
    {
      idService: "",
      kind: "tat_ca",
      title: `${i18n.t("all", { lng: lang })}`,
    },
  ];

  service.map((item) => {
    dataTab.push({
      idService: item?._id,
      kind: item?.kind,
      title: item?.title?.[lang],
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
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          startPage={startPage}
          setStartPage={setStartPage}
        />
      </div>
    </div>
  );
};

export default ManagePromotionEvent;
