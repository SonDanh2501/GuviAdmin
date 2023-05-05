import { useEffect, useState } from "react";
import "./index.scss";
import { getFavoriteAndBlockByCustomers } from "../../../../../../api/customer";
import { Image, Table } from "antd";

const FavouriteBlock = ({ id }) => {
  const [tab, setTab] = useState("favourite");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getFavoriteAndBlockByCustomers(id, tab, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab, id]);

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
      <div className="mt-3">
        {data?.map((item, index) => {
          return (
            <div key={index} className="div-item-list-ctv">
              <div>
                <Image src={item?.avatar} className="image-ctv" />
              </div>
              <div className="div-name-item">
                <a className="text-name">{item?.full_name}</a>
                <a className="text-name">{item?.id_view}</a>
                <a className="text-name">
                  {item?.star}
                  <i class="uil uil-star icon-star"></i>
                </a>
              </div>
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
    title: "Cộng tác viên yêu thích",
    value: "favourite",
  },
  {
    title: "Cộng tác viên hạn chế",
    value: "block",
  },
];
