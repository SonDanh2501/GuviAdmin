import { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { formatMoney } from "../../../helper/formatMoney";
import { renderStarFromNumber } from "../../../utils/contant";
import icons from "../../../utils/icons";

const {IoStar} = icons

const ItemCollaborator = (data) => {
  const infoCollaborator = data?.data;
  const onPress = data?.onClick;
  const selectedId = data?.selected
  const {
    full_name,
    star,
    id_view,
    avatar,
    collaborator_wallet,
    work_wallet,
    phone,
  } = infoCollaborator;

  return (
    <div
      onClickCapture={onPress}
      className={`collaborate-card ${
        data?.data._id === selectedId && "selected"
      }`}
    >
      {/* Header */}
      <div className="collaborate-card__header">
        {/* Left */}
        <div className="collaborate-card__header--left">
          <img
            className="collaborate-card__header--left-avatar"
            src={avatar}
          ></img>
          {/* Thông tin */}
          <div className="collaborate-card__header--left-info">
            <span className="collaborate-card__header--left-info-name">
              {full_name}{" "}
              <span className="collaborate-card__header--left-info-name-star">
                {`(${star}`}{" "}
                <IoStar color="orange" style={{ paddingTop: "3px" }} /> {`)`}
              </span>
            </span>
            <span className="collaborate-card__header--left-info-phone">
              {phone}
            </span>
          </div>
        </div>
        {/* Right */}
        <div className="collaborate-card__header--right">
          <input
            style={{
              accentColor: "#8b5cf6",
              height: "14px",
              width: "14px",
            }}
            type="checkbox"
            checked={data?.data._id === selectedId ? true : false}
          ></input>
        </div>
      </div>
      {/* Footer */}
      <div className="collaborate-card__footer">
        <div className="collaborate-card__footer--child ">
          <span className="collaborate-card__footer--child-header">
            Ví đối tác
          </span>
          <span className="collaborate-card__footer--child-number">
            {formatMoney(work_wallet)}
          </span>
        </div>
        <div className="collaborate-card__footer--child ">
          <span className="collaborate-card__footer--child-header">Ví rút</span>
          <span className="collaborate-card__footer--child-number">
            {formatMoney(collaborator_wallet)}
          </span>
        </div>
        <div className="collaborate-card__footer--child ">
          <span className="collaborate-card__footer--child-header">
            Mã đối tác
          </span>
          <span className="collaborate-card__footer--child-number">
            {id_view}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCollaborator;
