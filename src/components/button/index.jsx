import React from 'react'

const ButtonCustom = (props) => {
  const { label, color, hoverColor, size, onClick } = props;
  return (
    <>
      <button
        onClick={onClick}
        style={{ borderRadius: "6px" }}
        // className="px-6 py-2 border-2 bỏd"
        className={`bg-violet-500 text-white hover:bg-violet-400 duration-300 ease-out ${
          size === "small"
            ? "py-[2px] px-[4px] text-xs"
            : "py-[10px] px-[12px] text-xs" // Size normal
        } `}
      >
        {label}
      </button>
    </>
  );
};

export default ButtonCustom;