import React from "react";
import icons from "../../../utils/icons";
import "./index.scss";

const { IoMedalOutline, IoReceiptOutline, IoThumbsDownOutline } = icons;

const CardPunishBonus = (props) => {
  const {} = props;
  return (
    <div className="card__bonus-punish">
      {/* Số lần khen thưởng và phạt */}
      <div className="card__bonus-punish--total">
        <div className="card__bonus-punish--total-container">
          <IoMedalOutline
            style={{ backgroundColor: "#dcfce7" }}
            className="card-statistics__icon"
            color="green"
          />
          <div className="card__bonus-punish--total-container-number">
            <span className="card__bonus-punish--total-container-number-label">
              Khen thưởng
            </span>
            <span className="card__bonus-punish--total-container-number-number">
              15{" "}
              <span className="card__bonus-punish--total-container-number-number-sub">
                lần
              </span>
            </span>
          </div>
        </div>
        <div className="card__bonus-punish--total-container">
          <IoThumbsDownOutline
            style={{ backgroundColor: "#fee2e2" }}
            className="card-statistics__icon"
            color="red"
          />
          <div className="card__bonus-punish--total-container-number">
            <span className="card__bonus-punish--total-container-number-label">
              Kỷ luật
            </span>
            <span className="card__bonus-punish--total-container-number-number">
              4{" "}
              <span className="card__bonus-punish--total-container-number-number-sub">
                lần
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* Khen thưởng gần nhất */}
      <div className="card__bonus-punish--recent card__bonus-punish--recent-success">
        <div className="card__bonus-punish--recent-icon">
          <IoReceiptOutline
            style={{ backgroundColor: "#dcfce7" }}
            className="card-statistics__icon"
            color="green"
          />
          <div className="card__bonus-punish--recent-icon-label">
            <span>Quyết định khen thưởng</span>
            <span className="card__bonus-punish--recent-icon-label-time">
              10 thg 02, 2023
            </span>
          </div>
        </div>
        <div className="card__bonus-punish--recent-status">
          <span>Chờ duyệt</span>
        </div>
      </div>
      {/* Vi phạm gần nhất */}
      <div className="card__bonus-punish--recent card__bonus-punish--recent-punish">
        <div className="card__bonus-punish--recent-icon">
          <IoReceiptOutline
            style={{ backgroundColor: "#fee2e2" }}
            className="card-statistics__icon"
            color="red"
          />
          <div className="card__bonus-punish--recent-icon-label">
            <span>Quyết định phạt</span>
            <span className="card__bonus-punish--recent-icon-label-time">
              10 thg 02, 2023
            </span>
          </div>
        </div>
        <div className="card__bonus-punish--recent-status">
          <span>Đã duyệt</span>
        </div>
      </div>
    </div>
  );
};

export default CardPunishBonus;
