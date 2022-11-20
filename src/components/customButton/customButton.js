import React from "react";
import "./button.scss";

const CustomButton = (props) => {
  const { color, type, className, onClick, title, style } = props;
  return (
    <>
      <button
        color={color}
        type={type}
        className={className}
        onClick={onClick}
        style={style}
      >
        {title}
      </button>
    </>
  );
};

export default CustomButton;
