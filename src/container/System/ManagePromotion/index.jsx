import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import PromotionManage from "./Promotion/promotionManage";
import ManagePromotionGuvi from "./PromotionGuvi";
import ManagePromotionOrther from "./PromotionOrther";
import ManagePromotionEvent from "./PromotionOrtherEvent";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import i18n from "../../../i18n";
import { useCookies } from "../../../helper/useCookies";
import { getService } from "../../../redux/selectors/service";
import useWindowDimensions from "../../../helper/useWindowDimensions";

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

  useEffect(() => {
    setSelected(
      readCookie("select_promo") === "" ? "code" : readCookie("select_promo")
    );
    setBrand(
      readCookie("brand_promo") === "" ? "guvi" : readCookie("brand_promo")
    );
  }, []);

  return (
    <div>
      {/* <Button
        style={{ width: "auto" }}
        className={
          selected === "code" && brand === "guvi"
            ? "btn-selected-promotion"
            : "btn-default-promotion"
        }
        onClick={() => {
          setSelected("code");
          setBrand("guvi");
          saveToCookie("select_promo", "code");
          saveToCookie("brand_promo", "guvi");
          setCurrentPage(1);
          setStartPage(0);
        }}
      >
        {`${i18n.t("guvi_promotion", { lng: lang })}`}
      </Button>
      <Button
        style={{ width: "auto" }}
        className={
          selected === "code" && brand === "orther"
            ? "btn-selected-promotion"
            : "btn-default-promotion"
        }
        onClick={() => {
          setSelected("code");
          setBrand("orther");
          saveToCookie("select_promo", "code");
          saveToCookie("brand_promo", "orther");
          setCurrentPage(1);
          setStartPage(0);
        }}
      >
        {`${i18n.t("partner_promotion", { lng: lang })}`}
      </Button>
      <Button
        style={{ width: "auto" }}
        className={
          selected === "event"
            ? "btn-selected-promotion"
            : "btn-default-promotion"
        }
        onClick={() => {
          setCurrentPage(1);
          setStartPage(0);
          setSelected("event");
          saveToCookie("select_promo", "event");
        }}
      >
        {`${i18n.t("promotions", { lng: lang })}`}
      </Button> */}

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
