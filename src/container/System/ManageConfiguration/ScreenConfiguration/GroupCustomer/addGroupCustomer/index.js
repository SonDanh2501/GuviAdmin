import { Button, Drawer, Input, Radio } from "antd";
import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../../../../../../components/customButton/customButton";
import CustomTextInput from "../../../../../../components/CustomTextInput/customTextInput";
import "./index.scss";
import { set } from "lodash";

const AddGroupCustomer = () => {
  const [valueIn, setValueIn] = useState("and");
  const [valueOut, setValueOut] = useState("and");
  const [compareIn, setCompareIn] = useState("and");
  const [compareOut, setCompareOut] = useState("and");
  const [nameCondition, setNameCondition] = useState("");

  const dispatch = useDispatch();

  return (
    <>
      <div>
        <a className="title-condition">Điều kiện vào</a>
        <div className="div-tab-condition">
          {DATA_TAB.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setValueIn(item?.value)}
                className={
                  item?.value === valueIn ? "div-tab-selected" : "div-tab"
                }
              >
                <a className="text-tab">{item?.title}</a>
              </div>
            );
          })}
        </div>
        <div className="div-body">
          <div className="div-footer-body">
            <div className="div-tab-condition">
              {DATA_TAB.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setCompareIn(item?.value)}
                    className={
                      item?.value === compareIn ? "div-tab-selected" : "div-tab"
                    }
                  >
                    <a className="text-tab">{item?.title}</a>
                  </div>
                );
              })}
            </div>
            <Button className="btn-add-group">Thêm điều kiện</Button>
          </div>
          <div className="ml-5">
            <div className="div-input">
              <CustomTextInput label="Loại" classNameForm="input-condition" />
              <CustomTextInput
                label="So sánh"
                classNameForm="input-condition"
              />
              <CustomTextInput
                label="Giá trị"
                classNameForm="input-condition"
              />
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <a className="title-condition">Điều kiện ra</a>
        <div className="div-tab-condition">
          {DATA_TAB.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setValueOut(item?.value)}
                className={
                  item?.value === valueOut ? "div-tab-selected" : "div-tab"
                }
              >
                <a className="text-tab">{item?.title}</a>
              </div>
            );
          })}
        </div>

        <div className="div-body">
          <div className="div-footer-body">
            <div className="div-tab-condition">
              {DATA_TAB.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setCompareOut(item?.value)}
                    className={
                      item?.value === compareOut
                        ? "div-tab-selected"
                        : "div-tab"
                    }
                  >
                    <a className="text-tab">{item?.title}</a>
                  </div>
                );
              })}
            </div>
            <Button className="btn-add-group">Thêm điều kiện</Button>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default memo(AddGroupCustomer);

const DATA_TAB = [
  {
    title: "Và",
    value: "and",
  },
  {
    title: "Hoặc",
    value: "or",
  },
];
