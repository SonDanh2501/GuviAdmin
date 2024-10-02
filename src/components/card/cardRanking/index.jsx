import React from "react";
import icons from "../../../utils/icons";
import "./index.scss";
import defaultLogo from "../../../assets/images/moneyLogo.svg";

const {IoLogoUsd, IoTrendingDown, IoTrendingUp, IoCashOutline, IoWalletOutline} = icons

const CardRanking = (props) => {

  return (
    <div className="card__ranking">
      {/* Ảnh tài chính */}
      <div className="card__ranking--image">
        <div className="card__ranking--image-content">
          <span className="card__ranking--image-content-subtext">
            Tổng tiền thu được
          </span>
          <span className="card__ranking--image-content-total">
            100.000.000đ
          </span>
        </div>
        <img className="card__ranking--image-image" src={defaultLogo}></img>
      </div>
      {/* Thu nhập */}
      <div className="card__ranking--content">
        <div className="card__ranking--content-child not-last">
          <div className="card__ranking--content-child-container">
            <div>
              <IoLogoUsd
                style={{ backgroundColor: "#dcfce7" }}
                className="card-statistics__icon"
                color="green"
              />
            </div>
            <div>
              <span>Thu nhập/tháng</span>
            </div>
          </div>
          <div className="card__ranking--content-child-money card__ranking--content-child-money-month">
            <span>10.000.000đ</span>
            <IoTrendingDown size="16px" color="red" />
          </div>
        </div>
        <div className="card__ranking--content-child not-last">
          <div className="card__ranking--content-child-container">
            <div>
              <IoCashOutline
                style={{ backgroundColor: "#fef9c3" }}
                className="card-statistics__icon"
                color="orange"
              />
            </div>
            <div>
              <span>Thu nhập/năm</span>
            </div>
          </div>
          <div className="card__ranking--content-child-money card__ranking--content-child-money-year">
            <span>100.000.000đ</span>
            <IoTrendingUp size="16px" color="green" />
          </div>
        </div>
        <div className="card__ranking--content-child">
          <div className="card__ranking--content-child-container">
            <div>
              <IoWalletOutline
                style={{ backgroundColor: "#dbeafe" }}
                className="card-statistics__icon"
                color="blue"
              />
            </div>
            <div>
              <span>Tổng doanh thu</span>
            </div>
          </div>
          <div className="card__ranking--content-child-money card__ranking--content-child-money-total">
            <span>300.000.000đ</span>
            <IoTrendingUp size="16px" color="green" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardRanking