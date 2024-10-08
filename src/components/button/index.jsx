import React from 'react'
import "./index.scss";

const ButtonCustom = (props) => {
  const { label, onClick, disable, style, isCheckButton } = props;
  return (
    <div>
      {isCheckButton ? (
        <button
          onClick={onClick}
          disabled={disable}
          className={`button-custom-checked ${disable && "disable"} ${
            style === "normal" && "normal"
          }`}
        >
          {label}
        </button>
      ) : (
        <button
          onClick={onClick}
          disabled={disable}
          className={`button-custom ${disable && "disable"} ${
            style === "normal" && "normal"
          }`}
        >
          {label}
        </button>
      )}
    </div>
  );
};

export default ButtonCustom;