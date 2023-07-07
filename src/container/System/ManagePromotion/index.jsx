import { Button } from "antd";
import { useState } from "react";
import "./index.scss";
import PromotionManage from "./Promotion/promotionManage";
import ManagePromotionGuvi from "./PromotionGuvi";
import ManagePromotionOrther from "./PromotionOrther";
import ManagePromotionEvent from "./PromotionOrtherEvent";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import i18n from "../../../i18n";

const ManagePromotions = () => {
  const [selected, setSelected] = useState("code");
  const [brand, setBrand] = useState("guvi");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const lang = useSelector(getLanguageState);

  return (
    <div>
      <Button
        className={
          selected === "code" && brand === "guvi"
            ? "btn-selected-promotion"
            : "btn-default-promotion"
        }
        onClick={() => {
          setSelected("code");
          setBrand("guvi");
          setCurrentPage(1);
          setStartPage(0);
        }}
      >
        {`${i18n.t("guvi_promotion", { lng: lang })}`}
      </Button>
      <Button
        className={
          selected === "code" && brand === "orther"
            ? "btn-selected-promotion"
            : "btn-default-promotion"
        }
        onClick={() => {
          setSelected("code");
          setBrand("orther");
          setCurrentPage(1);
          setStartPage(0);
        }}
      >
        {`${i18n.t("partner_promotion", { lng: lang })}`}
      </Button>
      <Button
        className={
          selected === "event"
            ? "btn-selected-promotion"
            : "btn-default-promotion"
        }
        onClick={() => {
          setCurrentPage(1);
          setStartPage(0);
          setSelected("event");
        }}
        style={{ width: "auto" }}
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
