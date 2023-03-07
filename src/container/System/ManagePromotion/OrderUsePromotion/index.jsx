import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getOrderUsePromotion } from "../../../../api/promotion";
import "./index.scss";
import OrderPromotion from "./OrderPromotion";

const OrderUsePromotion = () => {
  const { state } = useLocation();
  const { id } = state || {};

  const [data, setData] = useState([]);
  const [total, setTotal] = useState();

  useEffect(() => {
    getOrderUsePromotion(id, "")
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [id]);

  const onChangeTab = (active) => {
    if (active === "2") {
      getOrderUsePromotion(id, "done")
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => console.log(err));
    } else if (active === "3") {
      getOrderUsePromotion(id, "cancel")
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => console.log(err));
    } else if (active === "1") {
      getOrderUsePromotion(id, "")
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="div-container">
      <a className="text-title-order-promotion">Đơn hàng sử dụng khuyến mãi</a>

      <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
        <Tabs.TabPane tab="Tất cả" key="1">
          <OrderPromotion data={data} total={total} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thành công" key="2">
          <OrderPromotion data={data} total={total} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thất bại" key="3">
          <OrderPromotion data={data} total={total} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default OrderUsePromotion;
