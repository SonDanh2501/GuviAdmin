import React from "react";
import icons from "../../../utils/icons";
import "./index.scss";

const { IoCubeOutline, IoTrendingUp } = icons;

const CardTotalValue = (props) => {
  const { label, total, previousCompare, IconComponent, color, horizontal } =
    props;
  return (
    <>
      {horizontal ? (
        <div className="card__total-value-horizontal">
          {/* Top content */}
          <div className="card__total-value-horizontal--top">
            {/* Label */}
            <span className="card__total-value-horizontal--top-label">
              {label}
            </span>
            {/* Icon */}
            <IconComponent
              className={`card__total-value-horizontal--top-icon ${color}`}
              color={color}
            />
          </div>
          {/* Bottom content */}
          <div className="card__total-value-horizontal--bottom">
            {/* number */}
            <span className="card__total-value-horizontal--bottom-number">
              {total}
            </span>
            {/* <div>
              <span
                className={`card__total-value-horizontal--bottom-previous ${color}`}
              >
                {previousCompare}%
                <IoTrendingUp color={`${color}`} />
              </span>
              <span className="">So với kì trước</span>
            </div> */}
          </div>
        </div>
      ) : (
        <div className="card__total-value">
          {/* Icon */}
          <div>
            <IconComponent
              className={`card__total-value--icon ${color}`}
              color={color === "yellow" ? "orange" : color}
            />
          </div>
          {/* Header */}
          <span className="card__total-value--header">{label}</span>
          {/* Number */}
          <span className={`card__total-value--number ${color}`}>{total}</span>
          {/* So với kì trước */}
          <div className="card__total-value--previous-period">
            <span className="card__total-value--previous-period-label">
              So với kì trước
            </span>

            <span className="card__total-value--previous-period-number uptrend">
              +{previousCompare}%
              <IoTrendingUp color="#22c55e" />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CardTotalValue;
