import React from 'react'
import "./index.scss";

const ButtonCustom = (props) => {
  const { label, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="button-custom"
    >
      {label}
    </button>
  );
};

export default ButtonCustom;