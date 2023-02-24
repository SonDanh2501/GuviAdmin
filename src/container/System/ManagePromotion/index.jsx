import { Button } from "antd";
import { useState } from "react";
import "./index.scss";
import PromotionManage from "./Promotion/promotionManage";
import ManagePromotionGuvi from "./PromotionGuvi";
import ManagePromotionOrther from "./PromotionOrther";

const ManagePromotions = () => {
  const [selected, setSelected] = useState("code");
  const [brand, setBrand] = useState("guvi");
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
        }}
      >
        Khuyến mãi đối tác
      </Button>
      <Button
        className={selected === "event" ? "btn-selected" : "btn-default"}
        onClick={() => setSelected("event")}
      >
        Chương trình khuyến mãi
      </Button>

      {selected === "code" && brand === "guvi" ? (
        // <ManagePromotionGuvi type={selected} brand={brand} />
        <PromotionManage type={selected} brand={brand} />
      ) : selected === "code" && brand === "orther" ? (
        // <ManagePromotionOrther type={selected} brand={brand} />
        <PromotionManage type={selected} brand={brand} />
      ) : (
        <PromotionManage type={selected} brand={""} />
        // <ManagePromotionOrther type={selected} brand={""} />
      )}
    </div>
  );
};

export default ManagePromotions;
