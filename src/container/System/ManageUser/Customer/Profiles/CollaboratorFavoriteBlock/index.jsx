import { useEffect, useState } from "react";
import "./index.scss";
import {
  getFavoriteAndBlockByCustomers,
  unblockCustomerApi,
  unfavouriteCustomerApi,
} from "../../../../../../api/customer";
import { Image, Table } from "antd";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../../helper/toast";
import ModalCustom from "../../../../../../components/modalCustom";

const FavouriteBlock = ({ id }) => {
  const [tab, setTab] = useState("favourite");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getFavoriteAndBlockByCustomers(id, tab, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab, id]);

  const handleFavouriteAndBlock = (idCollaborator) => {
    setIsLoading(true);
    if (tab === "favourite") {
      unfavouriteCustomerApi(id, idCollaborator)
        .then((res) => {
          setIsLoading(false);
          setModal(false);
          getFavoriteAndBlockByCustomers(id, tab, 0, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    } else {
      unblockCustomerApi(id, idCollaborator)
        .then((res) => {
          setIsLoading(false);
          setModal(false);
          getFavoriteAndBlockByCustomers(id, tab, 0, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    }
  };

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
                  <div className="div-info">
                    <Image src={item?.avatar} className="image-ctv" />

                    <div className="div-name-item">
                      <a className="text-name">{item?.full_name}</a>
                      <a className="text-name">{item?.id_view}</a>
                      <a className="text-name">
                        {item?.star}
                        <i class="uil uil-star icon-star"></i>
                      </a>
                    </div>
                  </div>
                  <div
                    className="div-cancel"
                    onClick={() => {
                      setItem(item);
                      setModal(true);
                    }}
                  >
                    <a className="text-cancel">{`${i18n.t("cancel_modal", {
                      lng: lang,
                    })}`}</a>
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

      <ModalCustom
        isOpen={modal}
        title={
          tab === "favourite"
            ? `${i18n.t("cancel_collaborator_favourite", { lng: lang })}`
            : `${i18n.t("cancel_collaborator_block", { lng: lang })}`
        }
        handleOk={() => {
          handleFavouriteAndBlock(item?._id);
        }}
        handleCancel={() => setModal(false)}
        body={
          <>
            <a>
              {tab === "favourite"
                ? `${i18n.t("want_cancel_collaborator_favourite", {
                    lng: lang,
                  })}`
                : `${i18n.t("want_cancel_collaborator_block", { lng: lang })}`}
            </a>
            <a> {item?.full_name}</a>
          </>
        }
      />

      {isLoading && <LoadingPagination />}
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
