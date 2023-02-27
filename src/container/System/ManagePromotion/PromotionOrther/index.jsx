import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../redux/selectors/service";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";

const ManagePromotionOrther = ({ type, brand }) => {
  // const service = useSelector(getService);
  // const [tab, setTab] = useState("");
  // const [id, setId] = useState("");

  // useEffect(() => {
  //   setTab(service[0]?.kind);
  //   setId(service[0]?._id);
  // }, [service]);
  return (
    <div className=" ml-2 mt-3">
      {/* <div className="div-tab">
        {service?.map((item, index) => {
          return (
            <div
              className="tab"
              onClick={() => {
                setTab(item?.kind);
                setId(item?._id);
              }}
            >
              <a
                className={
                  tab === item?.kind
                    ? "text-title-tab"
                    : "text-title-tab-default"
                }
              >
                {item?.title?.vi}
              </a>
              <div className={tab === item?.kind ? "tab-line" : ""}></div>
            </div>
          );
        })}
      </div> */}
      <div>
        <PromotionManage type={type} brand={brand} idService={""} />
      </div>
    </div>
  );
};

export default ManagePromotionOrther;
