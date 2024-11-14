import React from "react";
import { IoStar } from "react-icons/io5";
import "./index.scss";

const CardStatistical = (props) => {
  const { label, color, icon_color, totalStar, totalPercent } = props;
  return (
    <div className="card-statistics-rating card-shadow">
      <div
        style={{ backgroundColor: `${color}` }}
        className="card-statistics-rating-label"
      >
        <IoStar
          size="1.2rem"
          color={icon_color} // green
          style={{ marginBottom: "2px" }}
        />
        <span>{label}</span>
      </div>
      <div className="card-statistics-rating-content">
        <div className="right-content">
          <span className="sub-text">Số lượng</span>
          <span className="text">{totalStar}</span>
        </div>
        <div className="left-content">
          <span className="sub-text">Chiếm</span>
          <span className="text">{totalPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default CardStatistical;
