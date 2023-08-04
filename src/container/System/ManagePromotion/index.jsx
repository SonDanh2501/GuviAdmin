import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  Pagination,
  Progress,
  Select,
  Switch,
  Table,
  Tabs,
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
  updatePromotion,
} from "../../../api/promotion.jsx";
import ModalCustom from "../../../components/modalCustom/index.jsx";
import LoadingPagination from "../../../components/paginationLoading/index.jsx";
import { formatMoney } from "../../../helper/formatMoney.js";
import { errorNotify } from "../../../helper/toast.js";
import useWindowDimensions from "../../../helper/useWindowDimensions.js";
import i18n from "../../../i18n/index.js";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth.js";
import { getProvince, getService } from "../../../redux/selectors/service.js";
import "./styles.scss";
import { useCookies } from "../../../helper/useCookies.js";
import { useHorizontalScroll } from "../../../helper/useSideScroll.js";

const ManagePromotions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [typeSort, setTypeSort] = useState(-1);
  const [saveToCookie, readCookie] = useCookies();
  const [state, setState] = useState({
    currentPage: 1,
    startPage: 0,
    type: "",
    brand: "",
    idService: "",
    status: "",
    modalShowApp: false,
    value: "",
    kind: "",
  });
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);
  const scrollRef = useHorizontalScroll();
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  const province = useSelector(getProvince);
  const service = useSelector(getService);

  const TAB_PROMOTION = [
    {
      value: "doing",
      label: `${i18n.t("Đang kích hoạt", { lng: lang })}`,
    },
    { value: "", label: `${i18n.t("all", { lng: lang })}` },
    {
      value: "upcoming",
      label: `${i18n.t("Chưa kích hoạt", { lng: lang })}`,
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
  ];
  const optionService = [
    {
      value: "",
      label: `${i18n.t("Tất cả dịch vụ", { lng: lang })}`,
    },
  ];

  service.map((item) => {
    optionService.push({
      value: item?._id,
      label: item?.title?.[lang],
    });
  });

  useEffect(() => {
    setState({
      ...state,
      status:
        readCookie("tab_status_promotion") === ""
          ? ""
          : readCookie("tab_status_promotion"),
      idService:
        readCookie("service_prmotion") === ""
          ? ""
          : readCookie("service_prmotion"),
      type:
        readCookie("selected_promotion") === " "
          ? ""
          : readCookie("selected_promotion"),
      brand:
        readCookie("brand_promotion") === ""
          ? ""
          : readCookie("brand_promotion"),
      value:
        readCookie("value_promotion") === ""
          ? ""
          : readCookie("value_promotion"),
      kind:
        readCookie("kind_promotion") === "" ? "" : readCookie("kind_promotion"),
    });
    fetchPromotion(
      "",
      readCookie("tab_status_promotion") === ""
        ? ""
        : readCookie("tab_status_promotion"),
      0,
      20,
      readCookie("selected_promotion") === " "
        ? ""
        : readCookie("selected_promotion"),
      readCookie("brand_promotion") === "" ? "" : readCookie("brand_promotion"),
      readCookie("service_prmotion") === ""
        ? ""
        : readCookie("service_prmotion"),
      "",
      typeSort
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deletePromotion(id)
        .then((res) => {
          fetchPromotion(
            valueSearch,
            state?.status,
            state?.startPage,
            20,
            state?.type,
            state?.brand,
            state?.idService,
            "",
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
    [valueSearch, typeSort, state]
  );

  const onActive = useCallback(
    (id, is_active) => {
      setIsLoading(true);
      if (is_active) {
        activePromotion(id, { is_active: false })
          .then((res) => {
            fetchPromotion(
              valueSearch,
              state?.status,
              state?.startPage,
              20,
              state?.type,
              state?.brand,
              state?.idService,
              "",
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
              state?.status,
              state?.startPage,
              20,
              state?.type,
              state?.brand,
              state?.idService,
              "",
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
    [valueSearch, typeSort, state]
  );

  const onChange = (page) => {
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setState({ ...state, currentPage: page, startPage: start });
    fetchPromotion(
      valueSearch,
      state?.status,
      start,
      20,
      state?.type,
      state?.brand,
      state?.idService,
      "",
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
        state?.status,
        state?.startPage,
        20,
        state?.type,
        state?.brand,
        state?.idService,
        "",
        typeSort
      )
        .then((res) => {
          setIsLoading(false);
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }, 1000),
    [state, typeSort]
  );

  const onChangeTab = (item) => {
    setIsLoading(true);
    saveToCookie("tab_status_promotion", item?.status);
    saveToCookie("selected_promotion", item?.selected);
    saveToCookie("brand_promotion", item?.brand);
    saveToCookie("value_promotion", item?.value);
    saveToCookie("kind_promotion", item?.kind);
    setState({
      ...state,
      status: item?.status,
      startPage: 0,
      currentPage: 1,
      type: item?.selected,
      brand: item?.brand,
      value: item?.value,
      kind: item?.kind,
    });
    fetchPromotion(
      valueSearch,
      item?.status,
      0,
      20,
      item?.selected,
      item?.brand,
      state?.idService,
      "",
      typeSort
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeService = (value) => {
    setIsLoading(true);
    saveToCookie("service_prmotion", value);
    setState({ ...state, idService: value });
    fetchPromotion(
      valueSearch,
      state?.status,
      state?.startPage,
      20,
      state?.type,
      state?.brand,
      value,
      "",
      typeSort
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeTypePromotion = (value, item) => {
    saveToCookie("selected_promotion", item?.selected);
    saveToCookie("brand_promotion", item?.brand);
    saveToCookie("kind_promotion", value);
    setState({
      ...state,
      type: item?.selected,
      brand: item?.brand,
      kind: value,
    });
    if (
      state.status === "doing" &&
      item?.selected === "code" &&
      item?.brand === "guvi"
    ) {
      saveToCookie("value_promotion", "kmkh");
      setState({
        ...state,
        value: "kmkh",
        type: item?.selected,
        brand: item?.brand,
        kind: value,
      });
    } else if (
      state.status === "doing" &&
      item?.selected === "code" &&
      item?.brand === "orther"
    ) {
      saveToCookie("value_promotion", "kmdtkh");
      setState({
        ...state,
        value: "kmdtkh",
        type: item?.selected,
        brand: item?.brand,
        kind: value,
      });
    } else if (
      state.status === "doing" &&
      item?.selected === "event" &&
      item?.brand === ""
    ) {
      saveToCookie("value_promotion", "ctkmkh");
      setState({
        ...state,
        value: "ctkmkh",
        type: item?.selected,
        brand: item?.brand,
        kind: value,
      });
    } else if (
      state.status === "upcoming" &&
      item?.selected === "code" &&
      item?.brand === "guvi"
    ) {
      saveToCookie("value_promotion", "kmckh");
      setState({
        ...state,
        value: "kmckh",
        type: item?.selected,
        brand: item?.brand,
        kind: value,
      });
    } else if (
      state.status === "upcoming" &&
      item?.selected === "code" &&
      item?.brand === "guvi"
    ) {
      saveToCookie("value_promotion", "kmdtckh");
      setState({
        ...state,
        value: "kmdtckh",
        type: item?.selected,
        brand: item?.brand,
        kind: value,
      });
    } else if (
      state.status === "upcoming" &&
      item?.selected === "event" &&
      item?.brand === ""
    ) {
      saveToCookie("value_promotion", "ctkmckh");
      setState({
        ...state,
        value: "ctkmckh",
        type: item?.selected,
        brand: item?.brand,
        kind: value,
      });
    }

    fetchPromotion(
      valueSearch,
      state?.status,
      0,
      20,
      item?.selected,
      item?.brand,
      state?.idService,
      "",
      typeSort
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeShow = (id, active) => {
    setIsLoading(true);
    if (active) {
      updatePromotion(id, {
        is_show_in_app: false,
      })
        .then((res) => {
          setIsLoading(false);
          setState({ ...state, modalShowApp: false });
          fetchPromotion(
            valueSearch,
            state?.status,
            state?.startPage,
            20,
            state?.type,
            state?.brand,
            state?.idService,
            "",
            typeSort
          )
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    } else {
      updatePromotion(id, {
        is_show_in_app: true,
      })
        .then((res) => {
          setIsLoading(false);
          setState({ ...state, modalShowApp: false });
          fetchPromotion(
            valueSearch,
            state?.status,
            state?.startPage,
            20,
            state?.type,
            state?.brand,
            state?.idService,
            "",
            typeSort
          )
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    }
  };

  const handleSortPosition = (value) => {
    setTypeSort(value);
    setIsLoading(true);
    fetchPromotion(
      valueSearch,
      state?.status,
      0,
      20,
      state?.type,
      state?.brand,
      state?.idService,
      "",
      value
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("Khuyến mãi", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div
            className="div-img-promotion"
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
            }
          >
            {/* <Image src={data?.thumbnail} className="img-customer-promotion" /> */}
            <div className="div-name-promotion">
              {data?.type_promotion === "code" &&
              data?.type_discount === "partner_promotion" ? (
                <a className="text-name-brand">
                  Ưu đãi từ "<a className="text-brand">{data?.brand}</a>"
                </a>
              ) : (
                <a className="text-title-code">{data?.code}</a>
              )}

              {data?.type_promotion === "code" &&
              data?.type_discount === "partner_promotion" ? (
                <></>
              ) : (
                <a className="text-title-promotion">
                  {data?.discount_unit === "amount"
                    ? `Giảm giá ${formatMoney(data?.discount_max_price)} ${
                        data?.price_min_order > 0 ? "" : "cho dịch vụ"
                      }`
                    : `Giảm giá ${data?.discount_value}%, tối đa ${formatMoney(
                        data?.discount_max_price
                      )} `}{" "}
                  {data?.price_min_order > 0
                    ? ` đơn từ ${formatMoney(
                        data?.price_min_order
                      )} cho dịch vụ `
                    : ""}
                  {service?.map((item, index) => {
                    return (
                      <a key={index} className="text-service">
                        {data?.service_apply?.includes(item?._id)
                          ? item?.title?.vi
                          : null}
                      </a>
                    );
                  })}
                </a>
              )}
            </div>
          </div>
        );
      },
      width: "31%",
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
          <a
            className="text-promotion"
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
            }
          >
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
          <a className="title-column">{`${i18n.t("Hình ảnh", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
            }
          >
            {data?.type_promotion === "code" &&
            data?.type_discount === "order" ? (
              <Image
                src={data?.thumbnail}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  border: "0.5px solid #d6d6d6",
                }}
                preview={false}
              />
            ) : data?.type_promotion === "code" &&
              data?.type_discount === "partner_promotion" ? (
              <Image
                src={data?.thumbnail}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  border: "0.5px solid #d6d6d6",
                }}
                preview={false}
              />
            ) : null}
          </div>
        );
      },
      align: "center",
      width: "8%",
    },
    // {
    //   title: () => <a className="title-column">Hiện thị</a>,
    //   render: (data) => {
    //     return (
    //       <Switch
    //         size="small"
    //         checked={data?.is_show_in_app}
    //         onChange={() => setState({ ...state, modalShowApp: true })}
    //         className={
    //           data?.is_show_in_app ? "switch-select-show-app" : "switch"
    //         }
    //       />
    //     );
    //   },
    //   align: "center",
    //   width: "6%",
    // },
    {
      title: () => <a className="title-column">Khu vực</a>,
      render: (data) => {
        return (
          <div
            className="div-area-promotion"
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
            }
          >
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
                : data?.status === "out_of_stock"
                ? "div-out-stock"
                : "div-cancel-promotion"
            }
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
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
      render: (data) => {
        return (
          <div
            className="div-use-promotion"
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
            }
          >
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
                className="progress-bar"
              />
            )}
          </div>
        );
      },
      align: "right",
      width: "8%",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("Bắt đầu", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        const startDate = moment(new Date(data?.limit_start_date)).format(
          "DD/MM/YYYY"
        );
        const start = moment(new Date(data?.date_create)).format("DD/MM/YYYY");
        return (
          <div
            onClick={() =>
              navigate("/promotion/manage-setting/edit-promotion", {
                state: { id: data?._id },
              })
            }
          >
            {data?.is_limit_date ? (
              <div className="div-date-promotion">
                <a className="text-title-promotion"> {startDate}</a>
              </div>
            ) : (
              <div className="div-date-promotion">
                <a className="text-title-promotion">{start}</a>
              </div>
            )}
          </div>
        );
      },
      align: "center",
      width: "10%",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("Kết thúc", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        const endDate = moment(new Date(data?.limit_end_date)).format(
          "DD/MM/YYYY"
        );
        return (
          <div className="div-date-promotion">
            {data?.is_limit_date ? (
              <a className="text-title-promotion"> {endDate}</a>
            ) : (
              <a className="text-title-promotion">{`${i18n.t("no_expiry", {
                lng: lang,
              })}`}</a>
            )}
          </div>
        );
      },
      align: "center",
      width: "10%",
    },
  ];

  return (
    <div>
      {width > 900 ? (
        <div className="div-tab-promotion" ref={scrollRef}>
          {PROMOTION_TAB?.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  item?.value === state?.value
                    ? "div-tab-item-select"
                    : "div-tab-item"
                }
                onClick={() => onChangeTab(item)}
              >
                <a className="text-tab">{item?.label}</a>
              </div>
            );
          })}
        </div>
      ) : (
        <Select
          options={PROMOTION_TAB}
          style={{ width: "100%" }}
          value={state?.value}
          onChange={(value, item) => onChangeTab(item)}
        />
      )}
      <div className="div-header-promotion mt-4">
        <Select
          options={optionService}
          className="select-type-service"
          value={state?.idService}
          onChange={onChangeService}
        />
        <Select
          options={TYPE_PRMOTION}
          className="select-type-promotion"
          value={state?.kind}
          onChange={(e, item) => onChangeTypePromotion(e, item)}
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
        <Button
          onClick={() =>
            navigate(`/promotion/manage-setting/edit-position-promotion`)
          }
          className="btn-edit-position"
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
              current={state?.currentPage}
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
        <ModalCustom
          isOpen={state?.modalShowApp}
          title={"Trạng thái hiện thị"}
          handleOk={() => onChangeShow(itemEdit?._id, itemEdit?.is_show_in_app)}
          handleCancel={() => setState({ ...state, modalShowApp: false })}
          textOk={itemEdit?.is_show_in_app ? `Ẩn` : `Hiện`}
          body={
            <a>
              {itemEdit?.is_show_in_app
                ? `Bạn có muốn ẩn khuyến mãi trên app`
                : `Bạn có muốn hiện thị khuyến mãi trên app`}
              <a className="text-name-modal">{itemEdit?.code}</a>
            </a>
          }
        />
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ManagePromotions;

const TYPE_PRMOTION = [
  {
    value: "",
    label: "Tất cả KM",
    brand: "",
    selected: "",
  },
  {
    value: "promotion",
    label: "Mã KM GUVI",
    brand: "guvi",
    selected: "code",
  },
  {
    value: "orther",
    label: "Mã KM Đối tác",
    brand: "orther",
    selected: "code",
  },
  {
    value: "event",
    label: "CTKM",
    brand: "",
    selected: "event",
  },
];

const PROMOTION_TAB = [
  {
    value: "",
    status: "",
    label: `Tất cả khuyến mãi`,
    selected: "",
    brand: "",
    kind: "",
  },
  {
    value: "kmkh",
    status: "doing",
    label: `KM đang kích hoạt`,
    selected: "code",
    brand: "guvi",
    kind: "promotion",
  },
  {
    value: "kmckh",
    status: "upcoming",
    label: `KM chưa kích hoạt`,
    selected: "code",
    brand: "guvi",
    kind: "promotion",
  },
  {
    value: "kmdtkh",
    status: "doing",
    label: `KM Đối tác đang kích hoạt`,
    selected: "code",
    brand: "orther",
    kind: "orther",
  },
  {
    value: "kmdtckh",
    status: "upcoming",
    label: `KM Đối tác chưa kích hoạt`,
    selected: "code",
    brand: "orther",
    kind: "orther",
  },
  {
    value: "ctkmkh",
    status: "doing",
    label: `CTKM đang kích hoạt`,
    selected: "event",
    brand: "",
    kind: "event",
  },
  {
    value: "ctkmckh",
    status: "upcoming",
    label: `CTKM chưa kích hoạt`,
    selected: "event",
    brand: "",
    kind: "event",
  },
  {
    value: "kt",
    status: "done",
    label: `Kết thúc`,
    selected: "",
    brand: "",
    kind: "",
  },
];
