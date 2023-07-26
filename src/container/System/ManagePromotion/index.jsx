import { Button } from "antd";
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

const ManagePromotions = () => {
  const [selected, setSelected] = useState("code");
  const [brand, setBrand] = useState("guvi");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const lang = useSelector(getLanguageState);
  const [saveToCookie, readCookie] = useCookies();

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
      <Button
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
      </Button>

      {selected === "code" && brand === "guvi" ? (
        <ManagePromotionGuvi
          type={selected}
          brand={brand}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          startPage={startPage}
          setStartPage={setStartPage}
        />
      ) : selected === "code" && brand === "orther" ? (
        <ManagePromotionOrther
          type={selected}
          brand={brand}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          startPage={startPage}
          setStartPage={setStartPage}
        />
      ) : (
        <ManagePromotionEvent
          type={selected}
          brand={""}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          startPage={startPage}
          setStartPage={setStartPage}
        />
      )}
    </div>
  );
};

export default ManagePromotions;
