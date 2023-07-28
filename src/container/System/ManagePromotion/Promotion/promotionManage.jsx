import { SearchOutlined } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  Button,
  Dropdown,
  Image,
  Input,
  Pagination,
  Progress,
  Select,
  Space,
  Table,
  notification,
} from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  activePromotion,
  deletePromotion,
  fetchPromotion,
} from "../../../../api/promotion.jsx";
import ModalCustom from "../../../../components/modalCustom/index.jsx";
import LoadingPagination from "../../../../components/paginationLoading/index.jsx";
import { errorNotify } from "../../../../helper/toast.js";
import useWindowDimensions from "../../../../helper/useWindowDimensions.js";
import i18n from "../../../../i18n/index.js";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth.js";
import "./PromotionManage.scss";
import { getProvince } from "../../../../redux/selectors/service.js";

const PromotionManage = ({
  type,
  brand,
  idService,
  exchange,
  tab,
  currentPage,
  setCurrentPage,
  startPage,
  setStartPage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [typeSort, setTypeSort] = useState(1);
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);
  const [api, contextHolder] = notification.useNotification();
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  const province = useSelector(getProvince);

  useEffect(() => {
    fetchPromotion("", "", 0, 20, type, brand, idService, exchange, typeSort)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [idService, exchange]);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deletePromotion(id)
        .then((res) => {
          fetchPromotion(
            valueSearch,
            valueFilter,
            startPage,
            20,
            type,
            brand,
            idService,
            exchange,
            typeSort
          )
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          setModal(false);
          setIsLoading(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    },
    [
      type,
      brand,
      idService,
      startPage,
      exchange,
      valueSearch,
      valueFilter,
      typeSort,
    ]
  );

  const onActive = useCallback(
    (id, is_active) => {
      setIsLoading(true);
      if (is_active) {
        activePromotion(id, { is_active: false })
          .then((res) => {
            fetchPromotion(
              valueSearch,
              valueFilter,
              startPage,
              20,
              type,
              brand,
              idService,
              exchange,
              typeSort
            )
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
            setModalActive(false);
            setIsLoading(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      } else {
        activePromotion(id, { is_active: true })
          .then((res) => {
            fetchPromotion(
              valueSearch,
              valueFilter,
              startPage,
              20,
              type,
              brand,
              idService,
              exchange,
              typeSort
            )
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
            setModalActive(false);
            setIsLoading(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      }
    },
    [
      type,
      brand,
      idService,
      startPage,
      exchange,
      valueFilter,
      valueSearch,
      typeSort,
    ]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    fetchPromotion(
      valueSearch,
      valueFilter,
      start,
      20,
      type,
      brand,
      idService,
      exchange,
      typeSort
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      setIsLoading(true);
      fetchPromotion(
        value,
        valueFilter,
        startPage,
        20,
        type,
        brand,
        idService,
        exchange,
        typeSort
      )
        .then((res) => {
          setIsLoading(false);
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }, 1000),
    [type, brand, idService, startPage, valueFilter, typeSort]
  );

  const handleChange = (value) => {
    setValueFilter(value);
    setIsLoading(true);
    fetchPromotion(
      valueSearch,
      value,
      startPage,
      20,
      type,
      brand,
      idService,
      exchange,
      typeSort
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const handleSortPosition = (value) => {
    setTypeSort(value);
    setIsLoading(true);
    fetchPromotion(
      valueSearch,
      valueFilter,
      0,
      20,
      type,
      brand,
      idService,
      exchange,
      value
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const openNotificationWithIcon = () => {
    api.warning({
      message: "Mã đã quá hạn!!!",
      description:
        "Bật hoạt động cho mã này cần gia hạn thêm ngày cho mã khuyến mãi.",
      duration: 10,
    });
  };

  const items = [
    {
      key: "1",
      label: checkElement?.includes("edit_promotion") && (
        <a
          onClick={() =>
            navigate("/promotion/manage-setting/edit-promotion", {
              state: { id: itemEdit?._id },
            })
          }
        >{`${i18n.t("edit", { lng: lang })}`}</a>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_promotion") && (
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
    {
      key: "3",
      label: itemEdit?.is_parrent_promotion &&
        checkElement?.includes("detail_promotion") && (
          <a
            onClick={() => {
              navigate("/promotion/manage-setting/child-promotion", {
                state: { code: itemEdit?.code },
              });
            }}
          >
            {`${i18n.t("detail", { lng: lang })}`}
          </a>
        ),
    },
  ];

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("promotion_name", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="div-img-promotion">
            {/* <Image src={data?.thumbnail} className="img-customer-promotion" /> */}
            <div className="div-name-promotion">
              <a className="text-title-code">{data?.code}</a>
              <a className="text-title-promotion">{data?.title?.[lang]}</a>
            </div>
          </div>
        );
      },
      width: "25%",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("Hình thức", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <a className="text-promotion">
            {data?.type_promotion === "code" && data?.type_discount === "order"
              ? "Mã KM"
              : data?.type_promotion === "code" &&
                data?.type_discount === "partner_promotion"
              ? "Mã KM"
              : "CTKM"}
          </a>
        );
      },
      align: "left",
      width: "8%",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("Từ", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <a className="text-promotion">
            {data?.type_promotion === "code" && data?.type_discount === "order"
              ? "GUVI"
              : data?.type_promotion === "code" &&
                data?.type_discount === "partner_promotion"
              ? "Đối tác"
              : "GUVI"}
          </a>
        );
      },
      align: "center",
    },
    {
      title: () => <a className="title-column">Khu vực</a>,
      render: (data) => {
        return (
          <div className="div-area-promotion">
            {!data?.is_apply_area ? (
              <a className="text-area">Toàn quốc</a>
            ) : (
              <>
                {province?.map((item, index) => {
                  return (
                    <a key={index} className="text-area">
                      {data?.city?.includes(item?.code)
                        ? item?.name + ", "
                        : null}
                    </a>
                  );
                })}
              </>
            )}
          </div>
        );
      },
      width: "10%",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("status", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <div
            className={
              data?.status === "upcoming"
                ? "div-text-upcoming"
                : data?.status === "doing"
                ? "div-doing-status-promotion"
                : "div-cancel-promotion"
            }
          >
            {data?.status === "upcoming" ? (
              <a className="text-upcoming">{`${i18n.t("upcoming", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "doing" ? (
              <a className="text-doing-status">{`${i18n.t("happenning", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "out_of_stock" ? (
              <a className="text-cancel-promotion">{`${i18n.t("out_stock", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "out_of_date" ? (
              <a className="text-cancel-promotion">{`${i18n.t("out_date", {
                lng: lang,
              })}`}</a>
            ) : (
              <a className="text-cancel-promotion">{`${i18n.t("closed", {
                lng: lang,
              })}`}</a>
            )}
          </div>
        );
      },
      align: "left",
      width: "10%",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("use", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <div className="div-use-promotion">
            <a
              className="text-title-use"
              onClick={() =>
                navigate("/promotion/manage-setting/order-promotion", {
                  state: { id: data?._id },
                })
              }
            >
              {data?.is_parrent_promotion
                ? data?.total_used_promotion + "/" + data?.total_child_promotion
                : data?.limit_count > 0
                ? data?.total_used_promotion + "/" + data?.limit_count
                : data?.total_used_promotion}
            </a>
            {(data?.is_parrent_promotion || data?.limit_count > 0) && (
              <Progress
                percent={
                  data?.is_parrent_promotion
                    ? (data?.total_used_promotion /
                        data?.total_child_promotion) *
                      100
                    : (data?.total_used_promotion / data?.limit_count) * 100
                }
                strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                showInfo={false}
                size="small"
                style={{ width: "50%" }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("expiry", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        const startDate = moment(new Date(data?.limit_start_date)).format(
          "DD/MM/YYYY"
        );
        const endDate = moment(new Date(data?.limit_end_date)).format(
          "DD/MM/YYYY"
        );
        return (
          <>
            {data?.is_limit_date ? (
              <div className="div-date-promotion">
                <a className="text-title-promotion">{startDate}</a>

                <a className="text-title-promotion">{endDate}</a>
              </div>
            ) : (
              <a className="text-title-promotion">{`${i18n.t("no_expiry", {
                lng: lang,
              })}`}</a>
            )}
          </>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 ">
        <div className="div-header-promotion mt-4">
          <Select
            defaultValue={`${i18n.t("filter_status", { lng: lang })}`}
            size={"large"}
            className="select-filter-promotion"
            onChange={handleChange}
            value={valueFilter}
            options={[
              { value: "", label: `${i18n.t("filter_status", { lng: lang })}` },
              {
                value: "upcoming",
                label: `${i18n.t("upcoming", { lng: lang })}`,
              },
              {
                value: "doing",
                label: `${i18n.t("happenning", { lng: lang })}`,
              },
              {
                value: "out_of_stock",
                label: `${i18n.t("out_stock", { lng: lang })}`,
              },
              {
                value: "out_of_date",
                label: `${i18n.t("out_date", { lng: lang })}`,
              },
              { value: "done", label: `${i18n.t("closed", { lng: lang })}` },
            ]}
          />
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            prefix={<SearchOutlined />}
            className="input-search-promotion"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {checkElement?.includes("create_promotion") && (
            <>
              <Button
                onClick={() =>
                  navigate(`/promotion/manage-setting/create-promotion`)
                }
                className="btn-add-promotion-v2"
              >
                Thêm khuyến mãi
              </Button>
            </>
          )}
        </div>
        <div className="div-add-edit">
          <Button
            onClick={() =>
              navigate(`/promotion/manage-setting/edit-position-promotion`, {
                state: {
                  type: type,
                  brand: brand,
                  idService: idService,
                  exchange: exchange,
                },
              })
            }
            style={{ width: "auto", marginBottom: 5 }}
          >
            Chỉnh sửa vị trí
          </Button>
        </div>

        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record._id}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItemEdit(record);
                  navigate("/promotion/manage-setting/edit-promotion", {
                    state: { id: record?._id },
                  });
                },
              };
            }}
            scroll={{
              x: width <= 900 ? 1400 : 0,
            }}
          />
          <div className="div-pagination p-2">
            <a>
              {`${i18n.t("total", { lng: lang })}`}: {total}
            </a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={total}
                showSizeChanger={false}
                pageSize={20}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("delete_promotion", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <a>{`${i18n.t("want_delete_promotion", { lng: lang })}`}</a>
                <a className="text-name-modal">{itemEdit?.title?.[lang]}</a>
              </>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalActive}
            title={
              itemEdit?.is_active
                ? `${i18n.t("lock_promotion", { lng: lang })}`
                : `${i18n.t("unlock_promotion", { lng: lang })}`
            }
            handleOk={() => onActive(itemEdit?._id, itemEdit?.is_active)}
            handleCancel={toggleActive}
            textOk={
              itemEdit?.is_active
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            body={
              <a>
                {itemEdit?.is_active
                  ? `${i18n.t("want_lock_promotion", { lng: lang })}`
                  : `${i18n.t("want_unlock_promotion", { lng: lang })}`}
                <a className="text-name-modal">{itemEdit?.title?.[lang]}</a>
              </a>
            }
          />
        </div>
        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
};

export default memo(PromotionManage);
