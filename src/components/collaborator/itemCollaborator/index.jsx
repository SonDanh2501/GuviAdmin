import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { formatMoney } from "../../../helper/formatMoney";
const ItemCollaborator = (data) => {
  const infoCollaborator = data?.data;
  const onPress = data?.onClick;
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
      className={`item-collaborator-container  item-collaborator-container_disabled`}
    >
      {avatar && <img src={`${avatar}`} className="item-collaborator-avatar" />}
      <div className="info">
        <p>{full_name}</p>
        <div className="item-collaborator_container-star">
          <p>{star}</p>
          <i class="uil uil-star icon-star"></i>
          <p>{phone}</p>
        </div>
        <p>{id_view} </p>
        <p>Ví CV: {formatMoney(work_wallet)}</p>
        <p>Ví Rút: {formatMoney(collaborator_wallet)}</p>
      </div>
    </div>
  );
};

export default ItemCollaborator;
