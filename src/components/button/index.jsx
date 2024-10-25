import React, { useState } from "react";
import "./index.scss";
import { ConfigProvider, Popover } from "antd";
import icons from "../../utils/icons";

const { IoCheckmarkCircleSharp, IoAddCircleOutline } = icons;

const ButtonCustom = (props) => {
  const {
    label,
    onClick,
    disable,
    style,
    isCheckButton,
    options,
    value,
    setValueSelectedProps,
    total,
    fullScreen,
  } = props;
  const [open, setOpen] = useState(false);

  const content = (
    <div className="button-custom-content">
      {options?.map((item, index) => (
        <div
          onClick={() => {
            handldeSelected(item.code);
          }}
          // style={{ borderRadius: "6px" }}
          // className={`${
          //   item?.code === value && "bg-violet-500 font-bold text-white"
          // } hover:bg-violet-500/50 hover:text-white cursor-pointer p-2 mb-0.5 font-normal duration-300 flex items-center justify-between`}
          className={`button-custom-content__child ${
            item?.code === value && "checked"
          }`}
        >
          <span className="button-custom-content__child--text" key={index}>
            {item.label ? item.label : item.name}
            <span
              className={`button-custom-content__child--text-number ${
                item?.code === value && "checked"
              } ${!item?.total && item?.total !== 0 && "hidden"}`}
            >
              {item?.total}
            </span>
          </span>
          {item?.code === value && <IoCheckmarkCircleSharp size={"20px"} />}
        </div>
      ))}
    </div>
  );
  /* ~~~ Support fucntion ~~~ */
  const handleOpen = (newOpen) => {
    setOpen(newOpen);
  };
  const handleClose = () => {
    // setSearchInput("");
    setOpen(false);
  };
  /* ~~~ Handle fucntion ~~~ */
  // 1. Hàm xử lí khi type === "select"
  const handldeSelected = (valueSelect) => {
    // options.map((el) => {
    //   if (el.value === valueSelect) setSelectValue(el.label);
    // });
    setValueSelectedProps(valueSelect);
    handleClose();
  };

  return (
    <div>
      {!options ? (
        <button
          onClick={onClick}
          disabled={disable}
          className={`button-custom ${disable && "disable"} ${
            style === "normal" && "normal"
          } ${fullScreen && "full-screen"}`}
        >
          {label}
        </button>
      ) : (
        <ConfigProvider
        // theme={{
        //   components: {
        //     Popover: {
        //       titleMinWidth: dimensions?.width && dimensions?.width - 35,
        //     },
        //   },
        // }}
        >
          <Popover
            trigger="click"
            placement="bottomLeft"
            title={" "}
            open={disable ? false : open}
            content={content}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <div className={`button-custom-select ${disable && "disable"}`}>
              <span
                className={`button-custom-select__label ${
                  disable && "disable"
                }`}
              >
                <IoAddCircleOutline size="16px" />
                {label}
              </span>
              <div className="button-custom-select__line"></div>
              <div className="button-custom-select__option">
                <span>{options?.find((el) => el.code === value)?.label}</span>
              </div>
            </div>
          </Popover>
        </ConfigProvider>
      )}
    </div>
  );
};

export default ButtonCustom;
