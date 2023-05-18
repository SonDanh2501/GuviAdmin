import { Button } from "antd";
import { useState } from "react";
import "./index.scss";
import PromotionManage from "./Promotion/promotionManage";
import ManagePromotionGuvi from "./PromotionGuvi";
import ManagePromotionOrther from "./PromotionOrther";
import ManagePromotionEvent from "./PromotionOrtherEvent";

const ManagePromotions = () => {
  const [selected, setSelected] = useState("code");
  const [brand, setBrand] = useState("guvi");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  return (
    <div>
      <Button
        className={
          selected === "code" && brand === "guvi"
            ? "btn-selected"
            : "btn-default"
        }
        onClick={() => {
          setSelected("code");
          setBrand("guvi");
          setCurrentPage(1);
          setStartPage(0);
        }}
      >
        Khuyến mãi Guvi
      </Button>
      <Button
        className={
          selected === "code" && brand === "orther"
            ? "btn-selected"
            : "btn-default"
        }
        onClick={() => {
          setSelected("code");
          setBrand("orther");
          setCurrentPage(1);
          setStartPage(0);
        }}
      >
        Khuyến mãi đối tác
      </Button>
      <Button
        className={selected === "event" ? "btn-selected" : "btn-default"}
        onClick={() => {
          setCurrentPage(1);
          setStartPage(0);
          setSelected("event");
        }}
      >
        Chương trình khuyến mãi
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
