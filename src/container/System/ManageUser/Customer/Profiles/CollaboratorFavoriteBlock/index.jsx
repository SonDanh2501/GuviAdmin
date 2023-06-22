import { useEffect, useState } from "react";
import "./index.scss";
import { getFavoriteAndBlockByCustomers } from "../../../../../../api/customer";
import { Image, Table } from "antd";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";

const FavouriteBlock = ({ id }) => {
  const [tab, setTab] = useState("favourite");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const lang = useSelector(getLanguageState);

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
              <a className="text-tab">{`${i18n.t(item?.title, {
                lng: lang,
              })}`}</a>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        {data.length > 0 ? (
          <>
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
          </>
        ) : (
          <a className="text-no-data">
            {tab === "favourite"
              ? `${i18n.t("no_favorite", {
                  lng: lang,
                })}`
              : `${i18n.t("no_block", {
                  lng: lang,
                })}`}
          </a>
        )}
      </div>

      <div className="mt-3"></div>
    </>
  );
};

export default FavouriteBlock;

const TAB = [
  {
    title: "favorite_collaborator",
    value: "favourite",
  },
  {
    title: "block_collaborators",
    value: "block",
  },
];
