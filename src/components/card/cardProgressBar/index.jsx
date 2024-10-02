import React from "react";
import icons from "../../../utils/icons";
import { calculateNumberPercent } from "../../../utils/contant";
import defaultLogo from "../../../assets/images/jobLogo.svg";
import "./index.scss";

const { IoCheckmarkCircleOutline, IoCloseCircleOutline } = icons;

const CardProgressBar = (props) => {
  const { totalJobs, totalJobsSuccess, totalJobsCancel, totalJobsOther } = props;
  return (
    <div className="card__progress-bar">
      <div className="card__progress-bar--image">
        <div className="card__progress-bar--image-content">
          <span className="card__progress-bar-image-content-subtext">
            Tổng số công việc
          </span>
          <div className="card__progress-bar--image-content-total">
            <span className="card__progress-bar--image-content-total-number">
              {totalJobsCancel + totalJobsSuccess + totalJobsOther}
            </span>
            <span className="card__progress-bar--image-content-total-unit">
              việc
            </span>
          </div>
        </div>
        <img
          className="card__progress-bar--image-image"
          src={defaultLogo}
        ></img>
      </div>
      {/*Container hiệu quả công việc */}
      <div className="card__progress-bar--content">
        <div className="card__progress-bar--content-child">
          <div>
            <IoCheckmarkCircleOutline
              style={{ backgroundColor: "#dcfce7" }}
              className="card-statistics__icon"
              color="green"
            />
          </div>
          <div className="card__progress-bar--content-child-progress-bar">
            <div className="card__progress-bar--content-child-progress-bar-number">
              <span className="card__progress-bar--content-child-progress-bar-number-label">
                Đơn đã hoàn thành
              </span>
              <span className="card__progress-bar--content-child-progress-bar-number-total">
                {/* {totalJobsSuccess + totalJobsOther} đơn */}
                {totalJobsSuccess} đơn
              </span>
            </div>
            <div className="card__progress-bar--content-child-progress-bar-container">
              <span
                // className={`${
                //   calculateNumberPercent(
                //     totalJobs,
                //     totalJobsSuccess + totalJobsOther
                //   ) > 60 && "more-than-overal"
                // }`}
                className={`${
                  calculateNumberPercent(totalJobs, totalJobsSuccess) > 60 &&
                  "more-than-overal"
                }`}
              >
                {calculateNumberPercent(totalJobs, totalJobsSuccess)}%
              </span>
              <div
                className="card__progress-bar--content-child-progress-bar-contanier-bar 
            card__progress-bar--content-child-progress-bar-contanier-bar-success"
                style={{
                  width: `${calculateNumberPercent(
                    totalJobs,
                    totalJobsSuccess + totalJobsOther
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="card__progress-bar--content-child">
          <div>
            <IoCloseCircleOutline
              style={{ backgroundColor: "#fee2e2" }}
              className="card-statistics__icon"
              color="red"
            />
          </div>
          <div className="card__progress-bar--content-child-progress-bar">
            <div className="card__progress-bar--content-child-progress-bar-number">
              <span className="card__progress-bar--content-child-progress-bar-number-label">
                Đơn đã hủy
              </span>
              <span className="card__progress-bar--content-child-progress-bar-number-total">
                {totalJobsCancel} đơn
              </span>
            </div>
            <div className="card__progress-bar--content-child-progress-bar-container">
              <span
                className={`${
                  calculateNumberPercent(totalJobs, totalJobsCancel) > 60 &&
                  "more-than-overal"
                }`}
              >
                {calculateNumberPercent(totalJobs, totalJobsCancel)}%
              </span>
              <div
                className="card__progress-bar--content-child-progress-bar-contanier-bar 
            card__progress-bar--content-child-progress-bar-contanier-bar-cancel"
                style={{
                  width: `${calculateNumberPercent(
                    totalJobs,
                    totalJobsCancel
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProgressBar;
