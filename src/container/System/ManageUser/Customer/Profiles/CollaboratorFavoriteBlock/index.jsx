import { useEffect, useState } from "react";
import "./index.scss";
import { getFavoriteAndBlockByCustomers } from "../../../../../../api/customer";

const FavouriteBlock = ({ id }) => {
  const [tab, setTab] = useState("block");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // useEffect(() => {
  //   getFavoriteAndBlockByCustomers(id, tab, 0, 20)
  //     .then((res) => {})
  //     .catch((err) => {});
  // }, [tab]);

  return (
    <>
      <div className="tab-block">
        {TAB.map((item, index) => {
          return (
            <div
              key={index}
              className={
                item?.value === tab ? "div-tab-item-select" : "div-tab-item"
              }
              onClick={() => setTab(item?.value)}
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>

      <div className="mt-3"></div>
    </>
  );
};

export default FavouriteBlock;

const TAB = [
  {
    title: "Cộng tác viên hạn chế",
    value: "block",
  },
  {
    title: "Cộng tác viên yêu thích",
    value: "favourite",
  },
];
