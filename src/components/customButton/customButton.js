import React from "react";
import "./button.scss";
import { Button } from "antd";

const CustomButton = (props) => {
  const { color, type, className, onClick, title, style } = props;
  return (
    <>
      <Button
        color={color}
        type={type}
        className={className}
        onClick={onClick}
        style={style}
      >
        {title}
      </Button>
    </>
  );
};

export default CustomButton;
