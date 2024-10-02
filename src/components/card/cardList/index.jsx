import React from "react";
import icons from "../../../utils/icons";
import "./index.scss";
import defaultLogo from "../../../assets/images/testLogo.svg";

const CardList = (props) => {
  const { data } = props;
  return (
    <div className="card__list">
      <div className="card__list--image">
        <span className="card__list--image-label">Các bài kiểm tra</span>
        <img className="card__list--image-image" src={defaultLogo} />
      </div>
      {data?.map((lesson, index) => (
        <div
          className={`card__list--exam ${
            index !== data?.length - 1 && "not-last-exam"
          }`}
        >
          <div className="card__list--exam-content">
            <span className="card__list--exam-content-header">
              {lesson?.title?.vi}
            </span>
            <span className="card__list--exam-content-subheader">
              {lesson?.description?.vi}
            </span>
          </div>
          <div
            className={`card__list--exam-status ${
              !lesson?.is_pass && "not-pass"
            }`}
          >
            <span>{lesson?.is_pass ? "Hoàn thành" : "Chưa hoàn thành"}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
