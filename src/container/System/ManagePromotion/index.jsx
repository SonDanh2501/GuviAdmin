import { Button } from "antd";
import { useState } from "react";
import "./index.scss";
import PromotionManage from "./Promotion/promotionManage";

const ManagePromotions = () => {
  const [selected, setSelected] = useState("code");
  return (
    <div>
      <Button
        className={selected === "code" ? "btn-selected" : "btn-default"}
        onClick={() => setSelected("code")}
      >
        Mã khuyến mãi
      </Button>
      <Button
        className={selected === "event" ? "btn-selected" : "btn-default"}
        onClick={() => setSelected("event")}
      >
        Chương trình khuyến mãi
      </Button>

      {selected === "code" ? (
        <PromotionManage type={selected} />
      ) : (
        <PromotionManage type={selected} />
      )}
    </div>
  );
};

export default ManagePromotions;
