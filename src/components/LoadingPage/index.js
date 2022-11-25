import React, { memo } from "react";
import "./style.scss";

const Loading = ({ loading }) => {
  return (
    <div className={`app-loading ${loading ? "show" : "hide"}`}>
      <div className="loading">
        <p>loading</p>
        <span />
      </div>
    </div>
  );
};

export default memo(Loading);
