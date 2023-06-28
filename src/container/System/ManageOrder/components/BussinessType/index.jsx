import { Button, DatePicker, Input, List, Select, Switch } from "antd";
import _debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchCollaboratorsCreateOrder } from "../../../../../api/collaborator";
import { DATA_TIME_TOTAL } from "../../../../../api/fakeData";
import {
  getPlaceDetailApi,
  googlePlaceAutocomplete,
} from "../../../../../api/location";
import {
  checkCodePromotionOrderApi,
  checkEventCodePromotionOrderApi,
  createOrderApi,
  getAddressCustomerApi,
  getServiceFeeOrderApi,
} from "../../../../../api/order";
import {
  getCalculateFeeApi,
  getPromotionByCustomerApi,
} from "../../../../../api/service";
import LoadingPagination from "../../../../../components/paginationLoading";
import InputCustom from "../../../../../components/textInputCustom";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import "./index.scss";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";

const BussinessType = (props) => {
  const {
    extendService,
    addService,
    bussinessType,
    id,
    name,
    setErrorNameCustomer,
    idService,
  } = props;
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState([]);
  const [bussiness, setBussiness] = useState([]);
  const [errorTime, setErrorTime] = useState("");
  const [dateWork, setDateWork] = useState("");
  const [errorDateWork, setErrorDateWork] = useState("");
  const [timeWork, setTimeWork] = useState("");
  const [errorTimeWork, setErrorTimeWork] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mutipleSelected, setMutipleSelected] = useState([]);
  const [promotionCustomer, setPromotionCustomer] = useState([]);
  const [priceOrder, setPriceOrder] = useState();
  const [discount, setDiscount] = useState(0);
  const [codePromotion, setCodePromotion] = useState("");
  const [eventPromotion, setEventPromotion] = useState([]);
  const [eventFeePromotion, setEventFeePromotion] = useState(0);
  const [feeService, setFeeService] = useState(0);
  const [dataFeeService, setDataFeeService] = useState(0);
  const [itemPromotion, setItemPromotion] = useState(0);
  const [isAutoOrder, setIsAutoOrder] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [errorCollaborator, setErrorCollaborator] = useState("");
  const [dataAddress, setDataAddress] = useState([]);
  const [estimate, setEstimate] = useState();
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getPromotionByCustomerApi(id, 0, 20, idService)
        .then((res) => setPromotionCustomer(res.data))
        .catch((err) => console.log(err));

      getAddressCustomerApi(id, 0, 20)
        .then((res) => {
          setDataAddress(res?.data);
        })
        .catch((err) => {});
    }
  }, [id]);

  const dateFormat = "YYYY-MM-DD";

  const onChange = (date, dateString) => {
    setDateWork(dateString);
    setErrorDateWork("");
  };

  const onChangeTime = (value) => {
    setTimeWork(value);
    setErrorTimeWork("");
  };

  const onChangeTimeService = (value) => {
    setTime({
      count: value?.count,
      _id: value?._id,
    });
    setEstimate(value?.estimate);
  };

  const onChangeBussinessService = (value) => {
    setBussiness({
      count: value?.count,
      _id: value?._id,
    });
  };

  const onChooseMultiple = useCallback(
    (_id) => {
      if (mutipleSelected.some((item) => item._id === _id)) {
        function filterByID(item) {
          if (item._id !== _id) {
            return true;
          }
          return false;
        }

        setMutipleSelected((prev) => prev.filter(filterByID));
      } else {
        setMutipleSelected((prev) => [...prev, { _id, count: 1 }]);
      }
    },
    [mutipleSelected]
  );

  const timeW = dateWork + "T" + timeWork + ".000Z";

  var AES = require("crypto-js/aes");
  const temp = JSON.stringify({
    lat: lat,
    lng: long,
    address: address,
  });
  var accessToken = AES.encrypt(temp, "guvico");

  const handleSearchLocation = useCallback(
    _debounce((value) => {
      setAddress(value);
      setIsLoading(true);
      // axios
      //   .get(
      //     "https://rsapi.goong.io/Place/AutoComplete?api_key=K6YbCtlzCGyTBd08hwWlzLCuuyTinXVRdMYDb8qJ",
      //     {
      //       params: {
      //         input: value,
      //       },
      //     }
      //   )
      //   .then((res) => {
      //     if (res.data.predictions) {
      //       setPlaces(res.data.predictions);
      //     } else {
      //       setPlaces([]);
      //     }

      //     setIsLoading(false);
      //   })
      //   .catch((err) => {
      //     setIsLoading(false);
      //     setPlaces([]);
      //   });
      googlePlaceAutocomplete(value)
        .then((res) => {
          if (res.predictions) {
            setPlaces(res.predictions);
          } else {
            setPlaces([]);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setPlaces([]);
        });
    }, 1500),
    []
  );

  const findPlace = useCallback((id) => {
    setIsLoading(true);
    setPlaces([]);
    // axios
    //   .get(
    //     "https://rsapi.goong.io/Place/Detail?api_key=K6YbCtlzCGyTBd08hwWlzLCuuyTinXVRdMYDb8qJ",
    //     {
    //       params: {
    //         place_id: id,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     setIsLoading(false);
    //     setLat(res?.data?.result?.geometry?.location?.lat);
    //     setLong(res?.data?.result?.geometry?.location?.lng);
    //   })
    //   .catch((e) => {
    //     setIsLoading(false);
    //   });
    getPlaceDetailApi(id)
      .then((res) => {
        setIsLoading(false);
        setLat(res?.result?.geometry?.location?.lat);
        setLong(res?.result?.geometry?.location?.lng);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (
      lat &&
      long &&
      address &&
      timeWork &&
      dateWork &&
      mutipleSelected &&
      time
    ) {
      setIsLoading(true);
      getCalculateFeeApi({
        token: accessToken.toString(),
        type: "loop",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: [timeW],
        extend_optional: mutipleSelected.concat(time).concat(bussiness),
        payment_method: paymentMethod,
      })
        .then((res) => {
          setPriceOrder(res?.initial_fee);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });

      getServiceFeeOrderApi({
        token: accessToken.toString(),
        type: "loop",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: [timeW],
        extend_optional: mutipleSelected.concat(time).concat(bussiness),
        payment_method: paymentMethod,
      })
        .then((res) => {
          const totalEventFee =
            res?.service_fee.length > 0
              ? res?.service_fee.map((el) => el.fee).reduce((a, b) => a + b)
              : 0;
          setFeeService(totalEventFee);
          setDataFeeService(res?.service_fee);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    }

    if (
      lat &&
      long &&
      address &&
      timeWork &&
      dateWork &&
      mutipleSelected &&
      time &&
      id
    ) {
      setIsLoading(true);
      checkEventCodePromotionOrderApi(id, {
        token: accessToken.toString(),
        type: "loop",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: [timeW],
        extend_optional: mutipleSelected.concat(time).concat(bussiness),
        payment_method: paymentMethod,
      })
        .then((res) => {
          const totalEventFee =
            res?.event_promotion.length > 0
              ? res?.event_promotion
                  .map((el) => el.discount)
                  .reduce((a, b) => a + b)
              : 0;
          setEventFeePromotion(totalEventFee);
          setEventPromotion(res?.event_promotion);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    }
  }, [
    lat,
    long,
    timeWork,
    dateWork,
    mutipleSelected,
    time,
    id,
    paymentMethod,
    bussiness,
  ]);

  const checkPromotion = useCallback(
    (item) => {
      setIsLoading(true);
      const extend = mutipleSelected.concat(time);
      if (item?.code === codePromotion) {
        setCodePromotion("");
        setDiscount(0);
        setItemPromotion([]);
        setIsLoading(false);
      } else {
        checkCodePromotionOrderApi(id, {
          id_customer: id,
          token: accessToken.toString(),
          type: "loop",
          type_address_work: "house",
          note_address: "",
          note: note,
          is_auto_order: false,
          date_work_schedule: [timeW],
          extend_optional: extend.concat(bussiness),
          code_promotion: item?.code,
          payment_method: paymentMethod,
        })
          .then((res) => {
            setIsLoading(false);
            setCodePromotion(item?.code);
            setDiscount(res?.discount);
            setItemPromotion(item);
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
      id,
      lat,
      long,
      timeWork,
      dateWork,
      mutipleSelected,
      time,
      paymentMethod,
      bussiness,
    ]
  );

  const onCreateOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    const extend = mutipleSelected.concat(time);
    if (
      (lat &&
        long &&
        address &&
        timeWork &&
        dateWork &&
        mutipleSelected &&
        time &&
        id) ||
      idCollaborator
    ) {
      createOrderApi({
        id_customer: id,
        token: accessToken.toString(),
        type: "loop",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: isAutoOrder,
        date_work_schedule: [timeW],
        extend_optional: extend.concat(bussiness),
        code_promotion: codePromotion,
        payment_method: paymentMethod,
        id_collaborator: idCollaborator,
      })
        .then((res) => {
          navigate("/group-order/manage-order");
          window.location.reload();
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } else if (!id) {
      setErrorNameCustomer("Vui lòng chọn khách hàng");
      dispatch(loadingAction.loadingRequest(false));
    } else if (!address && !lat && !long) {
      setErrorAddress("Vui lòng nhập đầy đủ địa chỉ");
      dispatch(loadingAction.loadingRequest(false));
    } else if (time.length === 0) {
      setErrorTime("Vui lòng chọn dịch vụ");
      dispatch(loadingAction.loadingRequest(false));
    } else if (!dateWork) {
      setErrorDateWork("Vui lòng chọn ngày làm");
      dispatch(loadingAction.loadingRequest(false));
    } else if (!timeWork) {
      setErrorTimeWork("Vui lòng chọn giờ làm");
      dispatch(loadingAction.loadingRequest(false));
    } else if (!idCollaborator) {
      setErrorCollaborator("Vui lòng chọn CTV");
      dispatch(loadingAction.loadingRequest(false));
    } else {
      dispatch(loadingAction.loadingRequest(false));
    }
  }, [
    id,
    lat,
    long,
    address,
    timeWork,
    dateWork,
    mutipleSelected,
    time,
    codePromotion,
    isAutoOrder,
    note,
    idCollaborator,
    paymentMethod,
    bussiness,
  ]);

  const searchValue = (value) => {
    setNameCollaborator(value);
  };

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setNameCollaborator(value);
      if (value) {
        searchCollaboratorsCreateOrder(id, value)
          .then((res) => {
            if (value === "") {
              setDataCollaborator([]);
            } else {
              setDataCollaborator(res.data);
            }
          })
          .catch((err) => console.log(err));
      } else if (idCollaborator) {
        setDataCollaborator([]);
      } else {
        setDataCollaborator([]);
      }
      setIdCollaborator("");
    }, 500),
    [id]
  );

  return (
    <>
      <div>
        <div className="div-search-address">
          <InputCustom
            title={`${i18n.t("address", { lng: lang })}`}
            placeholder={`${i18n.t("enter_address", { lng: lang })}`}
            style={{ width: "50%" }}
            value={address}
            type="text"
            onChange={(e) => {
              setAddress(e.target.value);
              handleSearchLocation(e.target.value);
            }}
          />
        </div>

        {places.length > 0 && (
          <List type={"unstyled"} className="list-item-place">
            {places?.map((item, index) => {
              return (
                <option
                  key={index}
                  onClick={(e) => {
                    setAddress(item?.description);
                    findPlace(item?.place_id);
                  }}
                >
                  {item?.description}
                </option>
              );
            })}
          </List>
        )}

        {dataAddress.length > 0 && (
          <div className="mt-2">
            <a className="title-list-address">{`${i18n.t("address_default", {
              lng: lang,
            })}`}</a>
            <List type={"unstyled"} className="list-item-address-customer">
              {dataAddress?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      address === item?.address
                        ? "div-item-address-selected"
                        : "div-item-address"
                    }
                    onClick={() => {
                      setAddress(item?.address);
                      setLat(item?.lat);
                      setLong(item?.lng);
                    }}
                  >
                    <i class="uil uil-map-marker"></i>
                    <div className="div-name-address">
                      <a className="title-address">
                        {item?.address.slice(0, item?.address.indexOf(","))}
                      </a>
                      <a className="title-details-address">{item?.address}</a>
                    </div>
                  </div>
                );
              })}
            </List>
          </div>
        )}

        <a className="text-error">{errorAddress}</a>
        <div className="div-add-service mt-3">
          <a className="label">
            {`${i18n.t("times", { lng: lang })}`}{" "}
            <a style={{ color: "red" }}>(*)</a>
          </a>
          <div className="div-service">
            {extendService?.map((item) => {
              return (
                <div
                  className={
                    item?._id === time?._id
                      ? "select-service"
                      : "select-service-default"
                  }
                  onClick={() => onChangeTimeService(item)}
                >
                  <a
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.title?.[lang]}
                  </a>
                  <a
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.estimate === 0.5
                      ? item?.description?.[lang]
                      : item?.description?.[lang].slice(
                          0,
                          item?.description?.[lang].indexOf("2")
                        )}
                  </a>
                  <a
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.estimate !== 0.5 &&
                      item?.description?.[lang].slice(
                        item?.description?.[lang].indexOf(" ")
                      )}
                  </a>
                </div>
              );
            })}
          </div>
          <a className="text-error">{errorTime}</a>
        </div>

        <div className="div-add-service mt-3">
          <a className="label">
            {`${i18n.t("business_type", { lng: lang })}`}{" "}
            <a style={{ color: "red" }}>(*)</a>
          </a>
          <div className="div-service">
            {bussinessType?.map((item) => {
              return (
                <div
                  className={
                    item?._id === bussiness?._id
                      ? "select-service"
                      : "select-service-default"
                  }
                  onClick={() => onChangeBussinessService(item)}
                >
                  <a
                    className={
                      item?._id === bussiness?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.title?.[lang]}
                  </a>
                  <a
                    className={
                      item?._id === bussiness?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.estimate === 0.5
                      ? item?.description?.[lang]
                      : item?.description?.[lang].slice(
                          0,
                          item?.description?.[lang].indexOf("2")
                        )}
                  </a>
                  <a
                    className={
                      item?._id === bussiness?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.estimate !== 0.5 &&
                      item?.description?.[lang].slice(
                        item?.description?.[lang].indexOf(" ")
                      )}
                  </a>
                </div>
              );
            })}
          </div>
          <a className="text-error">{errorTime}</a>
        </div>

        <div className="div-add-service mt-3">
          <a className="label">{`${i18n.t("extra_service", {
            lng: lang,
          })}`}</a>
          <div className="div-service-serve">
            {/* {addService?.map((item) => {
              return (
                <button
                  className={
                    mutipleSelected.some((items) => items._id === item?._id)
                      ? "select-service"
                      : "select-service-default"
                  }
                  onClick={() => onChooseMultiple(item?._id)}
                  disabled={
                    estimate === 4 && item?.estimate === 0
                      ? false
                      : estimate !== 4
                      ? false
                      : true
                  }
                >
                  <a
                    className={
                      mutipleSelected.some((items) => items._id === item?._id)
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.title?.[lang]}
                  </a>
                  <a
                    className={
                      mutipleSelected.some((items) => items._id === item?._id)
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.description?.[lang]}
                  </a>
                </button>
              );
            })} */}
            {addService?.map((item, index) => {
              return (
                <div key={index} className="div-switch-add-service">
                  <a className="title-switch">{item?.title?.[lang]}</a>
                  <Switch
                    checked={
                      mutipleSelected.some((items) => items._id === item?._id)
                        ? true
                        : false
                    }
                    size="small"
                    onChange={() => onChooseMultiple(item?._id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-picker">
          <a className="label">
            {`${i18n.t("date_work", { lng: lang })}`}{" "}
            <a style={{ color: "red" }}>(*)</a>
          </a>
          <DatePicker
            format={dateFormat}
            onChange={onChange}
            className="select-time"
          />
          <a className="text-error">{errorDateWork}</a>
        </div>

        <div className="form-picker-hours">
          <a className="label-hours">
            {`${i18n.t("time_work", { lng: lang })}`} (*)
          </a>
          <div className="div-hours">
            {DATA_TIME_TOTAL.map((item) => {
              const timeChosse = item?.title?.slice(0, 2);
              return (
                <Button
                  className={
                    timeWork === item.time
                      ? "select-time"
                      : "select-time-default"
                  }
                  onClick={() => onChangeTime(item.time)}
                  // disabled={
                  //   dateWork === dayNow
                  //     ? timeNow >= timeChosse
                  //       ? true
                  //       : false
                  //     : false
                  // }
                >
                  {item.title}
                </Button>
              );
            })}
          </div>
          <a className="text-error">{errorTimeWork}</a>
        </div>

        {/* <div className="div-auto-order">
          <a className="label-hours">Lặp lại hàng tuần</a>
          <Switch
            defaultChecked={isAutoOrder}
            style={{ width: 50, marginRight: 20 }}
            onChange={() => setIsAutoOrder(!isAutoOrder)}
          />
        </div> */}

        <div className="div-payment-method">
          <InputCustom
            title={`${i18n.t("payment_method", { lng: lang })}`}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e)}
            options={[
              { value: "cash", label: `${i18n.t("cash", { lng: lang })}` },
              {
                value: "point",
                label: `${i18n.t("wallet_gpay", { lng: lang })}`,
              },
            ]}
            className="input-form-select-payment"
            select={true}
          />
        </div>

        <InputCustom
          title={`${i18n.t("note", { lng: lang })}`}
          textArea={true}
          placeholder={`${i18n.t("enter_note", { lng: lang })}`}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "50%" }}
        />

        <div>
          <div>
            <InputCustom
              title={`${i18n.t("collaborator", { lng: lang })}`}
              style={{ width: "50%" }}
              error={errorCollaborator}
              onChange={(e) => {
                searchCollaborator(e.target.value);
                searchValue(e.target.value);
              }}
              value={nameCollaborator}
              placeholder={`${i18n.t("search", { lng: lang })}`}
            />
          </div>

          {dataCollaborator.length > 0 && (
            <List type={"unstyled"} className="list-item-add-ctv-order">
              {dataCollaborator?.map((item, index) => {
                return (
                  <button
                    className={
                      item?.is_block
                        ? "div-item-add-order-block"
                        : item?.is_favorite
                        ? "div-item-add-order-favorite"
                        : "div-item-add-order"
                    }
                    key={index}
                    disabled={item?.is_block ? true : false}
                    onClick={(e) => {
                      setIdCollaborator(item?._id);
                      setNameCollaborator(item?.full_name);
                      setDataCollaborator([]);
                    }}
                  >
                    <div>
                      <img src={item?.avatar} className="img-collaborator" />
                      <a>
                        {item?.full_name} - {item?.phone} - {item?.id_view}
                      </a>
                    </div>
                    {item?.is_favorite ? (
                      <i class="uil uil-heart icon-heart"></i>
                    ) : (
                      <></>
                    )}
                  </button>
                );
              })}
            </List>
          )}
        </div>

        <div className="div-promotion mt-3">
          {promotionCustomer.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  codePromotion === item.code
                    ? "div-item-promotion-selected"
                    : "div-item-promotion"
                }
                onClick={() => {
                  checkPromotion(item);
                }}
              >
                <a className="text-code-promotion">{item?.code}</a>
                <a className="text-title-promotion">{item?.title?.[lang]}</a>
              </div>
            );
          })}
        </div>
        {priceOrder && (
          <div className="div-total mt-3">
            <a>
              {`${i18n.t("provisional", { lng: lang })}`}:{" "}
              {formatMoney(priceOrder)}
            </a>
            <a>
              {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
              {formatMoney(feeService)}
            </a>
            {eventPromotion.map((item, index) => {
              return (
                <a style={{ color: "red" }}>
                  {item?.title?.[lang]}: {"-"}
                  {formatMoney(item?.discount)}
                </a>
              );
            })}
            {discount > 0 && (
              <div>
                <a style={{ color: "red" }}>{itemPromotion?.title?.vi}: </a>
                <a style={{ color: "red" }}> {formatMoney(-discount)}</a>
              </div>
            )}
          </div>
        )}

        <div className="div-footer mt-5">
          <a className="text-price">
            {`${i18n.t("price", { lng: lang })}`}:{" "}
            {priceOrder > 0
              ? formatMoney(
                  priceOrder + feeService - discount - eventFeePromotion
                )
              : formatMoney(0)}
          </a>
          <Button onClick={onCreateOrder}>{`${i18n.t("post", {
            lng: lang,
          })}`}</Button>
        </div>
        {isLoading && <LoadingPagination />}
      </div>
    </>
  );
};

export default BussinessType;
