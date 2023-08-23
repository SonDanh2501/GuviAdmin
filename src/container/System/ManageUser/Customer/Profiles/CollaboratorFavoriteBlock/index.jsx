import { Button, Image, List } from "antd";
import _debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchCollaborators } from "../../../../../../api/collaborator";
import {
  blockCustomerApi,
  favouriteCustomerApi,
  getFavoriteAndBlockByCustomers,
  unblockCustomerApi,
  unfavouriteCustomerApi,
} from "../../../../../../api/customer";
import ModalCustom from "../../../../../../components/modalCustom";
import LoadingPagination from "../../../../../../components/paginationLoading";
import InputCustom from "../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../helper/toast";
import i18n from "../../../../../../i18n";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import "./index.scss";

const FavouriteBlock = ({ id }) => {
  const [tab, setTab] = useState("favourite");
  const [data, setData] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [value, setValue] = useState("");
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getFavoriteAndBlockByCustomers(id, tab, 0, 20)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, [tab, id]);

  const handleUnFavouriteAndBlock = (idCollaborator) => {
    setIsLoading(true);
    if (tab === "favourite") {
      unfavouriteCustomerApi(id, idCollaborator)
        .then((res) => {
          setIsLoading(false);
          setModal(false);
          getFavoriteAndBlockByCustomers(id, tab, 0, 20)
            .then((res) => {
              setData(res?.data);
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

  const handleAddFavouriteAndBlock = (idCollaborator) => {
    setIsLoading(true);
    if (tab === "favourite") {
      favouriteCustomerApi(id, idCollaborator)
        .then((res) => {
          setIsLoading(false);
          setValue("");
          setDataCollaborator([]);
          getFavoriteAndBlockByCustomers(id, tab, 0, 20)
            .then((res) => {
              setData(res?.data);
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
      blockCustomerApi(id, idCollaborator)
        .then((res) => {
          setIsLoading(false);
          setValue("");
          setDataCollaborator([]);
          getFavoriteAndBlockByCustomers(id, tab, 0, 20)
            .then((res) => {
              setData(res?.data);
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

  const handleSearch = _debounce((value) => {
    fetchCollaborators(lang, 0, 10, "all", value, "")
      .then((res) => {
        if (value === "") {
          setDataCollaborator([]);
        } else {
          setDataCollaborator(res?.data);
        }
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  }, 1000);

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
              onClick={() => {
                setTab(item?.value);
                setValue("");
                setDataCollaborator([]);
              }}
            >
              <p className="text-tab">{`${i18n.t(item?.title, {
                lng: lang,
              })}`}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <InputCustom
          title={
            tab === "favourite"
              ? "Thêm cộng tác viên yêu thích"
              : "Thêm cộng tác viên hạn chế"
          }
          style={{ width: "50%" }}
          placeholder={`${i18n.t("search", { lng: lang })}`}
          onChange={(e) => {
            handleSearch(e.target.value);
            setValue(e.target.value);
          }}
          value={value}
        />
        {dataCollaborator.length > 0 && (
          <List type={"unstyled"} className="list-item-collaborator">
            {dataCollaborator?.map((item, index) => {
              return (
                <div className="item_list" key={index} onClick={(e) => {}}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={item?.avatar}
                      style={{ width: 30, height: 30, borderRadius: 4 }}
                    />
                    <p className="text-item">
                      {item?.full_name} - {item?.phone} - {item?.id_view}
                    </p>
                  </div>
                  <Button
                    className="btn-add"
                    onClick={() => handleAddFavouriteAndBlock(item?._id)}
                  >
                    {tab === "favourite" ? "Yêu thích" : "Chặn"}
                  </Button>
                </div>
              );
            })}
          </List>
        )}
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
                      <p className="text-name">{item?.full_name}</p>
                      <p className="text-name">{item?.id_view}</p>
                      <p className="text-name">
                        {item?.star}
                        <i class="uil uil-star icon-star"></i>
                      </p>
                    </div>
                  </div>
                  <div
                    className="div-cancel"
                    onClick={() => {
                      setItem(item);
                      setModal(true);
                    }}
                  >
                    <p className="text-cancel">{`${i18n.t("cancel_modal", {
                      lng: lang,
                    })}`}</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <p className="text-no-data">
            {tab === "favourite"
              ? `${i18n.t("no_favorite", {
                  lng: lang,
                })}`
              : `${i18n.t("no_block", {
                  lng: lang,
                })}`}
          </p>
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
          handleUnFavouriteAndBlock(item?._id);
        }}
        textOk={`${i18n.t("yes", { lng: lang })}`}
        handleCancel={() => setModal(false)}
        body={
          <>
            <p>
              {tab === "favourite"
                ? `${i18n.t("want_cancel_collaborator_favourite", {
                    lng: lang,
                  })}`
                : `${i18n.t("want_cancel_collaborator_block", { lng: lang })}`}
            </p>
            <p> {item?.full_name}</p>
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
