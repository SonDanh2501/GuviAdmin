import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import i18n from "../../../i18n";
import { getLanguageState } from "../../../redux/selectors/auth";
import { getService } from "../../../redux/selectors/service";
import PromotionManage from "./Promotion/promotionManage";
import "./index.scss";

const ManagePromotions = () => {
  const [selected, setSelected] = useState("");
  const [brand, setBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const [saveToCookie, readCookie] = useCookies();
  const [tab, setTab] = useState("tat_ca");
  const [id, setId] = useState("");
  const service = useSelector(getService);
  const dataTab = [
    {
      value: "",
      kind: "tat_ca",
      label: `${i18n.t("all", { lng: lang })}`,
    },
  ];

  service.map((item) => {
    dataTab.push({
      value: item?._id,
      kind: item?.kind,
      label: item?.title?.[lang],
    });
  });

  return (
    <div>
      {/* {width > 900 ? (
        <div className="div-tab">
          {dataTab?.map((item, index) => {
            return (
              <div
                key={index}
                className="tab"
                onClick={() => {
                  setTab(item?.kind);
                  setId(item?.value);
                  setStartPage(0);
                  setCurrentPage(1);
                }}
              >
                <a
                  className={
                    tab === item?.kind
                      ? "text-title-tab"
                      : "text-title-tab-default"
                  }
                >
                  {item?.label}
                </a>
                <div className={tab === item?.kind ? "tab-line" : ""}></div>
              </div>
            );
          })}
        </div>
      ) : (
        <Select
          options={dataTab}
          style={{ width: "100%" }}
          value={id}
          onChange={(e, item) => {
            setTab(item?.kind);
            setId(e);
            setStartPage(0);
            setCurrentPage(1);
          }}
        />
      )} */}
      <div>
        <PromotionManage
          type={selected}
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

export default ManagePromotions;
