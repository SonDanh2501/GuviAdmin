import React, { memo, useEffect, useState } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import {
    getElementState,
    getLanguageState,
} from "../../../redux/selectors/auth";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import "./index.scss";

const TabPanelContent = (props) => {
    const {
        items,
        active
    } = props;

    const checkElement = useSelector(getElementState);
    const lang = useSelector(getLanguageState);
    const [saveToCookie] = useCookies();
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState(0);

    // return (
    //     <div className="tab-panel-content">
    //         <ul>
    //             {items.map((tab, index) => (
    //                 <li key={index} onClick={() => setActiveTab(index)}>
    //                     {tab.label}
    //                 </li>
    //             ))}
    //         </ul>



    //         <div className="tab-content">
    //             {items.map((tab, index) => (
    //                 <div className={activeTab === tab.key ? "active" : "inactive"}>
    //                     {tab.content}
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );



    return (
        <div className="tab-panel-content">
            <div className="header-tabs">
                    {width > 900 ? (
                            items.map((tab, index) => {
                                return (
                                    <div className={activeTab === tab.key ? "item-tab-select" : "item-tab"}
                                        onClick={() => {
                                            setActiveTab(tab.key)
                                            // onChangeTab(tab);
                                        }}
                                    >
                                        <p className="text-title">{tab?.label}</p>
                                    </div>
                                );
                            })
                    ) : (
                        <Select
                            options={items}
                            value={items[0].key}
                            onChange={(e, item) => {
                                setActiveTab(item.key)
                                // onChangeTab(item);
                            }}
                            style={{ width: "100%" }}
                        />
                    )}
            </div>

            <div className="content-tabs">
                {items.map((tab, index) => (

(activeTab === tab.key) ? tab.content : <></>


                ))}
            </div>
        </div>

    );
};

export default memo(TabPanelContent);
