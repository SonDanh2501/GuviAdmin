import React, { useState } from "react";
import "./index.scss";
import { ConfigProvider, Popover } from "antd";
import icons from "../../utils/icons";

const { IoCheckmarkCircle, IoAddCircleOutline } = icons;

const ButtonCustom = (props) => {
  const {
    type,
    label,
    onClick,
    disable,
    style,
    options,
    value,
    setValueSelectedProps,
    fullScreen,
    borderRadiusFull,
    customColor,
  } = props;
  const [open, setOpen] = useState(false);
  const content = (
    <div className="button-custom-content">
      {options?.map((item, index) => (
        <div
          onClick={() => {
            handleSelected(item.code);
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
          {item?.code === value && <IoCheckmarkCircle size={"18px"} />}
        </div>
      ))}
    </div>
  );
  const contentMultiSelect =
    type === "multiSelect" ? (
      <div className="button-custom-content">
        {options?.map((item, index) => (
          <div
            key={index}
            onClick={() => handleMultiSelect(item.code)}
            className={`button-custom-content__child ${
              value.length > 0 && value.includes(item.code) ? "checked" : ""
            }`}
          >
            <span className="button-custom-content__child--text">
              {item.label || item.name}
              {item?.total || item?.total === 0 ? (
                <span
                  className={`button-custom-content__child--text-number ${
                    value.length > 0 && value.includes(item.code)
                      ? "checked"
                      : ""
                  }`}
                >
                  {item.total}
                </span>
              ) : null}
            </span>
            {value.length > 0 && value.includes(item.code) && (
              <IoCheckmarkCircle size="18px" />
            )}
          </div>
        ))}
      </div>
    ) : null;

  /* ~~~ Support function ~~~ */
  const handleOpen = (newOpen) => {
    setOpen(newOpen);
  };
  const handleClose = () => {
    // setSearchInput("");
    setOpen(false);
  };
  /* ~~~ Handle function ~~~ */
  // 1. Hàm xử lí khi type === "select"
  const handleSelected = (valueSelect) => {
    // options.map((el) => {
    //   if (el.value === valueSelect) setSelectValue(el.label);
    // });
    setValueSelectedProps(valueSelect);
    handleClose();
  };
  // 2. Hàm xử lý khi type === "multiSelect"
  const handleMultiSelect = (valueSelect) => {
    if (value?.length === 0) {
      setValueSelectedProps([valueSelect]);
    } else {
      const found = value?.find((el) => el === valueSelect);
      if (found) {
        // Nếu có thì bỏ chọn
        const result = value.filter((el) => el !== found);
        setValueSelectedProps(result);
      } else {
        // Nếu không có thì thêm vào giá trị value
        setValueSelectedProps([...value, valueSelect]);
      }
    }
  };
  return (
    <div>
      {!options ? (
        <button
          onClick={onClick}
          disabled={disable}
          className={`button-custom ${disable && "disable"} ${
            style === "normal" && "normal"
          } ${fullScreen && "full-screen"} ${
            borderRadiusFull && "border-full"
          } ${customColor && customColor}`}
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
            content={type === "multiSelect" ? contentMultiSelect : content}
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
                {Array.isArray(value) && value.length > 0 ? (
                  <span>
                    {value.length > 2
                      ? `${value.length} đã chọn`
                      : options
                          .filter((option) => value.includes(option.code))
                          .map((el) => el.label)
                          .join(", ")}
                  </span>
                ) : (
                  <span>
                    {options?.find((el) => el.code === value)?.label ||
                      "Tất cả"}
                  </span>
                )}
              </div>
            </div>
          </Popover>
        </ConfigProvider>
      )}
    </div>
  );
};

export default ButtonCustom;
