import { Select, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingPagination from "../../../../components/paginationLoading";
import { getService } from "../../../../redux/selectors/service";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
import useWindowDimensions from "../../../../helper/useWindowDimensions";

const ManagePromotionGuvi = (props) => {
  const { type, brand, currentPage, setCurrentPage, startPage, setStartPage } =
    props;
  const service = useSelector(getService);
  const [tab, setTab] = useState("tat_ca");
  const [id, setId] = useState("");
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

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
    <div className=" ml-2 mt-3">
      {width > 900 ? (
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
      )}
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

export default ManagePromotionGuvi;
