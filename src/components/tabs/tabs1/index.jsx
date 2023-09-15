import "./index.scss";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
    getElementState,
    getLanguageState,
    getUser,
  } from "../../../redux/selectors/auth";
  import {
    Select
  } from "antd";
  import i18n from "../../../i18n";
  import useWindowDimensions from "../../../helper/useWindowDimensions";

const Tabs = (props) => {
    const {
        itemTab,
    } = props;
    const checkElement = useSelector(getElementState);
    const lang = useSelector(getLanguageState);
    const [tab, setTab] = useState(itemTab[0].value);
    const [keyActive, setKeyActive] = useState(0);
    const { width } = useWindowDimensions();

    const onChangeTab = (item) => {
        console.log(item, 'item');
        setTab(item.value);
        setKeyActive(item.key);

        props.onValueChangeTab(item);
      };
    return (
<div className="div-tab-order">
{width > 900 ? (
  <div className="div-tab">
    {itemTab.map((item, index) => {
      return (
        <div
          key={index}
          className={
            item?.key === keyActive ? "item-tab-select" : "item-tab"
          }
          onClick={() => {
            onChangeTab(item);
          }}
        >
          <p className="text-title">{item?.label}</p>
        </div>
      );
    })}
  </div>
) : ( 
  <Select
    options={itemTab}
    value={tab}
    onChange={(e, item) => {
      onChangeTab(item);
    }}
    style={{ width: "100%" }}
  />
)}
</div>
    )
}

export default Tabs;