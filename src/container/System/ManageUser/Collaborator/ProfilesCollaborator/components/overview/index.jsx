import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import "./styles.scss";
import { Col, Row } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { useEffect, useState } from "react";

const Overview = () => {
  const [total, setTotal] = useState({
    total_favourite: 10,
    total_order: 47,
    total_hour: 1000,
  });
  const [data, setData] = useState([]);
  const lang = useSelector(getLanguageState);

  useEffect(() => {}, []);
  return (
    <>
      <div className="div-overview">
        <div className="div-body-overview">
          <a className="text-wallet">Ví Chính: {formatMoney(200000)}</a>
          <a className="text-wallet">Ví Thưởng: {formatMoney(100000)}</a>
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col span={8}>
              <div className="div-item-total">
                <a className="number-total">{total.total_order}</a>
                <a className="detail-total">Số ca làm</a>
              </div>
            </Col>
            <Col span={8}>
              <div className="div-item-total">
                <a className="number-total">{total.total_hour}</a>
                <a className="detail-total">Số giờ làm</a>
              </div>
            </Col>
            <Col span={8}>
              <div className="div-item-total-favorite">
                <div className="div-number">
                  <a className="number-total">{total.total_favourite}</a>
                  <HeartFilled
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontSize: 20,
                    }}
                  />
                </div>
                <a className="detail-total">Yêu thích</a>
              </div>
            </Col>
          </Row>

          <div className="mt-4">
            <a className="text-order-near">Đơn gần nhất</a>
            {[1, 2, 3, 4, 5].map((item, index) => {
              return (
                <div key={index} className="item-list-order">
                  <div className="div-detail-item">
                    <a className="text-item">Mã: 097907070</a>
                    <a className="text-item">Dịch vụ: </a>
                    <a className="text-item">Ngày làm: </a>
                    <a className="text-item">Khách hàng:</a>
                  </div>
                  <div>
                    <a className="title-status">Trạng thái: </a>
                    <a>Hoàn thành</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
