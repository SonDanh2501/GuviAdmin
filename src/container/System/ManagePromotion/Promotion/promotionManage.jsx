import {
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  Button,
  Dropdown,
  Image,
  Input,
  notification,
  Pagination,
  Select,
  Space,
  Table,
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
import offToggle from "../../../../assets/images/off-button.png";
import onToggle from "../../../../assets/images/on-button.png";
import AddPromotion from "../../../../components/addPromotion/addPromotion.js";
import AddPromotionEvent from "../../../../components/addPromotionEvent/addPromotionEvent.js";
import AddPromotionOrther from "../../../../components/addPromotionOrther/addPromotionOrther.js";
import EditPromotion from "../../../../components/editPromotion/editPromotion.js";
import EditPromotionEvent from "../../../../components/editPromotionEvent/editPromotionEvent.js";
import EditPromotionOrther from "../../../../components/editPromotionOrther/editPromotionOrther.js";
import ModalCustom from "../../../../components/modalCustom/index.jsx";
import LoadingPagination from "../../../../components/paginationLoading/index.jsx";
import { errorNotify } from "../../../../helper/toast.js";
import i18n from "../../../../i18n/index.js";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth.js";
import "./PromotionManage.scss";
const width = window.innerWidth;

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
  const [modalEdit, setModalEdit] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [typeSort, setTypeSort] = useState(1);
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);
  const [api, contextHolder] = notification.useNotification();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromotion("", "", 0, 20, type, brand, idService, exchange, typeSort)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [idService]);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deletePromotion(id)
        .then((res) => {
          fetchPromotion(
            valueSearch,
            valueFilter,
            0,
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
              0,
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
              0,
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
      0,
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
        0,
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
      0,
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
          onClick={() => {
            setModalEdit(!modalEdit);
          }}
        >
          {`${i18n.t("edit", { lng: lang })}`}
        </a>
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

  const columns =
    type === "code"
      ? [
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
                  <Image
                    src={data?.thumbnail}
                    className="img-customer-promotion"
                  />
                  <a className="text-title-promotion">{data?.title?.[lang]}</a>
                </div>
              );
            },
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
                <a
                  className="text-title-promotion"
                  onClick={() =>
                    navigate("/promotion/manage-setting/order-promotion", {
                      state: { id: data?._id },
                    })
                  }
                >
                  {data?.is_parrent_promotion
                    ? data?.total_used_promotion +
                      "/" +
                      data?.total_child_promotion
                    : data?.total_used_promotion}
                </a>
              );
            },
            // sorter: (a, b) => a.total_used_promotion - b.total_used_promotion,
          },
          {
            title: () => {
              return (
                <div className="div-title-column-position">
                  <a className="text-column">{`${i18n.t("position", {
                    lng: lang,
                  })}`}</a>
                  <div className="div-direction">
                    <CaretUpOutlined
                      onClick={() => handleSortPosition(1)}
                      style={
                        typeSort === 1
                          ? { fontSize: 10, color: "blue" }
                          : { fontSize: 10, color: "gray" }
                      }
                    />
                    <CaretDownOutlined
                      onClick={() => handleSortPosition(-1)}
                      style={
                        typeSort === -1
                          ? { fontSize: 10, color: "blue" }
                          : { fontSize: 10, color: "gray" }
                      }
                    />
                  </div>
                </div>
              );
            },
            align: "center",
            render: (data) => (
              <a className="text-title-promotion">{data?.position}</a>
            ),
          },
          {
            title: () => {
              return (
                <a className="title-column">{`${i18n.t("code", {
                  lng: lang,
                })}`}</a>
              );
            },
            align: "center",
            render: (data) => (
              <a className="text-title-promotion">{data?.code}</a>
            ),
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
                <a className="text-title-promotion">
                  {data?.is_limit_date
                    ? startDate + "-" + endDate
                    : `${i18n.t("no_expiry", { lng: lang })}`}
                </a>
              );
            },
          },
          {
            title: () => {
              return (
                <a className="title-column">{`${i18n.t("on_off", {
                  lng: lang,
                })}`}</a>
              );
            },
            align: "center",
            render: (data) => {
              var date =
                data?.limit_end_date &&
                moment(data?.limit_end_date.slice(0, 10));
              var now = moment();
              return (
                <div>
                  {contextHolder}
                  {checkElement?.includes("active_promotion") && (
                    <>
                      {data?.is_active ? (
                        <img
                          src={onToggle}
                          className="img-toggle"
                          onClick={toggleActive}
                        />
                      ) : (
                        <div>
                          {data?.is_limit_date ? (
                            date < now ? (
                              <img
                                src={offToggle}
                                className="img-toggle"
                                onClick={() =>
                                  openNotificationWithIcon("warning")
                                }
                              />
                            ) : (
                              <img
                                src={offToggle}
                                className="img-toggle"
                                onClick={toggleActive}
                              />
                            )
                          ) : (
                            <img
                              src={offToggle}
                              className="img-toggle"
                              onClick={toggleActive}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            },
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
                <div>
                  {data?.status === "upcoming" ? (
                    <a className="text-upcoming">{`${i18n.t("upcoming", {
                      lng: lang,
                    })}`}</a>
                  ) : data?.status === "doing" ? (
                    <a className="text-upcoming">{`${i18n.t("happenning", {
                      lng: lang,
                    })}`}</a>
                  ) : data?.status === "out_of_stock" ? (
                    <a className="text-cancel">{`${i18n.t("out_stock", {
                      lng: lang,
                    })}`}</a>
                  ) : data?.status === "out_of_date" ? (
                    <a className="text-cancel">{`${i18n.t("out_date", {
                      lng: lang,
                    })}`}</a>
                  ) : (
                    <a className="text-cancel">{`${i18n.t("closed", {
                      lng: lang,
                    })}`}</a>
                  )}
                </div>
              );
            },
          },
          {
            title: "",
            key: "action",
            align: "right",
            render: (record) => (
              <Space size="middle">
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                  placement="bottom"
                >
                  <a style={{ color: "black" }}>
                    <UilEllipsisV />
                  </a>
                </Dropdown>
              </Space>
            ),
          },
        ]
      : [
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
                  {/* <img
                    className="img-customer-promotion"
                    src={data?.thumbnail}
                  /> */}
                  <a className="text-title-promotion">
                    {data.title.vi.length > 25
                      ? data?.title?.[lang].slice(0, 25) + "..."
                      : data?.title?.[lang]}
                  </a>
                </div>
              );
            },
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
                <a
                  onClick={() =>
                    navigate("/promotion/manage-setting/order-promotion", {
                      state: { id: data?._id },
                    })
                  }
                >
                  {data?.is_parrent_promotion
                    ? data?.total_used_promotion +
                      "/" +
                      data?.total_child_promotion
                    : data?.total_used_promotion}
                </a>
              );
            },
            sorter: (a, b) => a.total_used_promotion - b.total_used_promotion,
          },
          {
            title: () => {
              return (
                <div className="div-title-column-position">
                  <a className="text-column">{`${i18n.t("position", {
                    lng: lang,
                  })}`}</a>
                  <div className="div-direction">
                    <CaretUpOutlined
                      onClick={() => handleSortPosition(1)}
                      style={
                        typeSort === 1
                          ? { fontSize: 10, color: "blue" }
                          : { fontSize: 10, color: "gray" }
                      }
                    />
                    <CaretDownOutlined
                      onClick={() => handleSortPosition(-1)}
                      style={
                        typeSort === -1
                          ? { fontSize: 10, color: "blue" }
                          : { fontSize: 10, color: "gray" }
                      }
                    />
                  </div>
                </div>
              );
            },
            align: "center",
            render: (data) => (
              <a className="text-title-promotion">{data?.position}</a>
            ),
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
                <a className="text-time-promotion">
                  {data?.is_limit_date
                    ? startDate + "-" + endDate
                    : `${i18n.t("no_expiry", { lng: lang })}`}
                </a>
              );
            },
          },
          {
            title: () => {
              return (
                <a className="title-column">{`${i18n.t("on_off", {
                  lng: lang,
                })}`}</a>
              );
            },
            align: "center",
            render: (data) => {
              var date =
                data?.limit_end_date &&
                moment(data?.limit_end_date.slice(0, 10));
              var now = moment();
              return (
                <div>
                  {contextHolder}
                  {checkElement?.includes("active_promotion") && (
                    <>
                      {data?.is_active ? (
                        <img
                          src={onToggle}
                          className="img-toggle"
                          onClick={toggleActive}
                        />
                      ) : (
                        <div>
                          {data?.is_limit_date ? (
                            date < now ? (
                              <img
                                src={offToggle}
                                className="img-toggle"
                                onClick={() =>
                                  openNotificationWithIcon("warning")
                                }
                              />
                            ) : (
                              <img
                                src={offToggle}
                                className="img-toggle"
                                onClick={toggleActive}
                              />
                            )
                          ) : (
                            <img
                              src={offToggle}
                              className="img-toggle"
                              onClick={toggleActive}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            },
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
                <div>
                  {data?.status === "upcoming" ? (
                    <a className="text-upcoming">{`${i18n.t("upcoming", {
                      lng: lang,
                    })}`}</a>
                  ) : data?.status === "doing" ? (
                    <a className="text-upcoming">{`${i18n.t("happenning", {
                      lng: lang,
                    })}`}</a>
                  ) : data?.status === "out_of_stock" ? (
                    <a className="text-cancel">{`${i18n.t("out_stock", {
                      lng: lang,
                    })}`}</a>
                  ) : data?.status === "out_of_date" ? (
                    <a className="text-cancel">{`${i18n.t("out_date", {
                      lng: lang,
                    })}`}</a>
                  ) : (
                    <a className="text-cancel">{`${i18n.t("closed", {
                      lng: lang,
                    })}`}</a>
                  )}
                </div>
              );
            },
          },
          {
            title: "",
            key: "action",
            align: "right",
            render: (record) => (
              <Space size="middle">
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                  placement="bottom"
                >
                  <a style={{ color: "black" }}>
                    <UilEllipsisV />
                  </a>
                </Dropdown>
              </Space>
            ),
          },
        ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <div className="div-header-promotion">
          <Select
            defaultValue={`${i18n.t("filter_status", { lng: lang })}`}
            size={"large"}
            style={{ width: 190 }}
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
            style={{ width: "60%", height: 38 }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {checkElement?.includes("create_promotion") && (
            <>
              {type === "code" && brand === "guvi" ? (
                <AddPromotion
                  idService={idService}
                  tab={tab}
                  startPage={startPage}
                  setDataPromo={setData}
                  setTotalPromo={setTotal}
                  type={type}
                  brand={brand}
                  exchange={exchange}
                  search={valueSearch}
                  status={valueFilter}
                  typeSort={typeSort}
                />
              ) : type === "code" && brand === "orther" ? (
                <AddPromotionOrther
                  idService={idService}
                  startPage={startPage}
                  setDataPromo={setData}
                  setTotalPromo={setTotal}
                  type={type}
                  brand={brand}
                  exchange={exchange}
                  search={valueSearch}
                  status={valueFilter}
                  typeSort={typeSort}
                />
              ) : (
                <AddPromotionEvent
                  idService={idService}
                  tab={tab}
                  startPage={startPage}
                  setDataPromo={setData}
                  setTotalPromo={setTotal}
                  type={type}
                  brand={brand}
                  exchange={exchange}
                  search={valueSearch}
                  status={valueFilter}
                  typeSort={typeSort}
                />
              )}
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
                },
              };
            }}
            scroll={
              width <= 490
                ? {
                    x: 1600,
                  }
                : null
            }
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
          {type === "code" && brand === "guvi" ? (
            <EditPromotion
              state={modalEdit}
              setState={() => setModalEdit(!modalEdit)}
              data={itemEdit}
              startPage={startPage}
              setDataPromo={setData}
              setTotalPromo={setTotal}
              type={type}
              brand={brand}
              exchange={exchange}
              idService={idService}
              tab={tab}
              search={valueSearch}
              status={valueFilter}
              typeSort={typeSort}
            />
          ) : type === "code" && brand === "orther" ? (
            <EditPromotionOrther
              state={modalEdit}
              setState={() => setModalEdit(!modalEdit)}
              data={itemEdit}
              startPage={startPage}
              setDataPromo={setData}
              setTotalPromo={setTotal}
              type={type}
              brand={brand}
              exchange={exchange}
              idService={idService}
              tab={tab}
              search={valueSearch}
              status={valueFilter}
              typeSort={typeSort}
            />
          ) : (
            <EditPromotionEvent
              state={modalEdit}
              setState={() => setModalEdit(!modalEdit)}
              data={itemEdit}
              startPage={startPage}
              setDataPromo={setData}
              setTotalPromo={setTotal}
              type={type}
              brand={brand}
              exchange={exchange}
              idService={idService}
              tab={tab}
              search={valueSearch}
              status={valueFilter}
              typeSort={typeSort}
            />
          )}
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
