import React, { memo, useCallback, useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import {
  searchCollaborators,
  searchCollaboratorsCreateOrder,
} from "../../../../api/collaborator";
import { errorNotify } from "../../../../helper/toast";
import {
  addCollaboratorToOrderApi,
  changeCollaboratorToOrderApi,
  getOrderApi,
} from "../../../../api/order";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import _debounce from "lodash/debounce";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
const AddCollaboratorOrder = (props) => {
  const {
    idOrder,
    idCustomer,
    status,
    type,
    kind,
    startPage,
    setData,
    setTotal,
    setIsLoading,
  } = props;
  const [open, setOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [check, setCheck] = useState(true);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const valueSearch = (value) => {
    setName(value);
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCollaboratorsCreateOrder(idCustomer, value)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
          });
      } else {
        setDataFilter([]);
      }

      setId("");
    }, 500),
    []
  );

  const addCollaboratorToOrder = useCallback(() => {
    setIsLoading(true);
    if (status === "confirm") {
      changeCollaboratorToOrderApi(idOrder)
        .then((res) => {
          addCollaboratorToOrderApi(idOrder, {
            id_collaborator: id,
            check_time: check,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              getOrderApi("", startPage, 20, type, kind, "", "", "", "", "")
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
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    } else {
      addCollaboratorToOrderApi(idOrder, {
        id_collaborator: id,
        check_time: check,
      })
        .then((res) => {
          setIsLoading(false);
          setOpen(false);
          getOrderApi("", startPage, 20, type, kind, "", "", "", "", "")
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
  }, [id, idOrder, startPage, type, kind, check]);

  return (
    <>
      <a
        className={
          checkElement?.includes("add_collaborator_guvi_job") ||
          checkElement?.includes("add_collaborator_guvi_job")
            ? "text-add-ctv-order"
            : "text-add-ctv-order-hide"
        }
        onClick={showDrawer}
      >
        {status === "confirm"
          ? `${i18n.t("change_ctv", {
              lng: lang,
            })}`
          : `${i18n.t("add_ctv", {
              lng: lang,
            })}`}
      </a>
      <Drawer
        title={
          status === "confirm"
            ? `${i18n.t("change_collaborator", {
                lng: lang,
              })}`
            : `${i18n.t("add_collaborator", {
                lng: lang,
              })}`
        }
        placement="right"
        onClose={onClose}
        width={500}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div className="div-add-collaborator">
          <div>
            <a className="label">{`${i18n.t("collaborator", {
              lng: lang,
            })}`}</a>
            <Input
              placeholder={`${i18n.t("search", {
                lng: lang,
              })}`}
              value={name}
              type="text"
              onChange={(e) => {
                handleSearch(e.target.value);
                valueSearch(e.target.value);
              }}
              className="input"
            />
            {/* {errorName && <a className="error">{errorName}</a>} */}
            {dataFilter.length > 0 && (
              <List
                type={"unstyled"}
                className="list-item-add-collaborator-order"
              >
                {dataFilter?.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      disabled={item?.is_block ? true : false}
                      className={
                        item?.is_block
                          ? "div-item-add-order-block"
                          : item?.is_favorite
                          ? "div-item-add-order-favorite"
                          : "div-item-add-order"
                      }
                      onClick={(e) => {
                        setId(item?._id);
                        setName(item?.full_name);
                        setDataFilter([]);
                      }}
                    >
                      <div className="div-name">
                        <img src={item?.avatar} className="img-collaborator" />
                        <a className="text-name">
                          {item?.full_name} - {item?.phone} - {item?.id_view}
                        </a>
                      </div>
                      {item?.is_favorite ? (
                        <i class="uil uil-heart icon-heart"></i>
                      ) : (
                        <></>
                      )}
                    </Button>
                  );
                })}
              </List>
            )}
          </div>

          <Checkbox
            checked={check}
            onChange={(e) => setCheck(e.target.checked)}
            style={{ marginTop: 50 }}
          >
            Kiểm tra trùng giờ
          </Checkbox>

          {id && (
            <Button
              className="btn-add-collaborator-order"
              onClick={addCollaboratorToOrder}
            >
              {status === "confirm"
                ? `${i18n.t("change_ctv", {
                    lng: lang,
                  })}`
                : `${i18n.t("add_ctv", {
                    lng: lang,
                  })}`}
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
};
export default memo(AddCollaboratorOrder);
