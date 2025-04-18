import {
  Button,
  DatePicker,
  Image,
  InputNumber,
  List,
  Popover,
  Switch,
} from "antd";
import { toPng } from "html-to-image";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchCollaboratorsCreateOrder } from "../../../../../api/collaborator";
import { DATA_TIME_TOTAL, date } from "../../../../../api/fakeData";
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
import i18n from "../../../../../i18n";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";

const CleaningHourly = (props) => {
  const {
    extendService,
    addService,
    id,
    name,
    setErrorNameCustomer,
    idService,
    nameService,
  } = props;
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState([]);
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
  const [itemPromotion, setItemPromotion] = useState(0);
  const [isAutoOrder, setIsAutoOrder] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [errorCollaborator, setErrorCollaborator] = useState("");
  const [dataAddress, setDataAddress] = useState([]);
  const [tipCollaborator, setTipCollaborator] = useState(0);
  const [dayLoop, setDayLoop] = useState([]);
  const lang = useSelector(getLanguageState);
  const ref = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getPromotionByCustomerApi(id, 0, 20, idService)
        .then((res) => setPromotionCustomer(res.data))
        .catch((err) => {});

      getAddressCustomerApi(id, 0, 20)
        .then((res) => {
          setDataAddress(res?.data);
        })
        .catch((err) => {});
    }
  }, [id, idService]);

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

  const onChooseDayLoop = useCallback(
    (day) => {
      if (dayLoop.some((item) => item === day)) {
        function filterByID(item) {
          if (item !== day) {
            return true;
          }
          return false;
        }

        setDayLoop((prev) => prev.filter(filterByID));
      } else {
        setDayLoop((prev) => [...prev, day]);
      }
    },
    [dayLoop]
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
        extend_optional: mutipleSelected.concat(time),
        payment_method: paymentMethod,
      })
        .then((res) => {
          setPriceOrder(res?.initial_fee);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
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
        extend_optional: mutipleSelected.concat(time),
        payment_method: paymentMethod,
      })
        .then((res) => {
          const totalEventFee =
            res?.service_fee.length > 0
              ? res?.service_fee.map((el) => el.fee).reduce((a, b) => a + b)
              : 0;
          setFeeService(totalEventFee);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
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
        extend_optional: mutipleSelected.concat(time),
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
            message: err?.message,
          });
        });
    }
  }, [lat, long, timeWork, dateWork, mutipleSelected, time, id, paymentMethod]);

  const checkPromotion = useCallback(
    (item) => {
      setIsLoading(true);
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
          extend_optional: mutipleSelected.concat(time),
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
            setCodePromotion("");
            errorNotify({
              message: err?.message,
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
      codePromotion,
    ]
  );

  const onCreateOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));

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
        extend_optional: mutipleSelected.concat(time),
        code_promotion: codePromotion,
        payment_method: paymentMethod,
        id_collaborator: idCollaborator,
        tip_collaborator: tipCollaborator,
        day_loop: dayLoop,
        time_zone: "Asia/Ho_Chi_Minh",
      })
        .then((res) => {
          navigate("/group-order/manage-order");
          window.location.reload();
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
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
    tipCollaborator,
    dayLoop,
  ]);

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

  const onGetBill = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${name}-${nameService}-${moment().format(
          "DD/MM/YYYY"
        )}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref, name, nameService]);

  return (
    <>
      <div>
        <div className="div-search-address">
          <InputCustom
            title={`${i18n.t("address", { lng: lang })}`}
            placeholder={`${i18n.t("enter_address", { lng: lang })}`}
            className="input-search-address"
            value={address}
            type="text"
            onChange={(e) => {
              setAddress(e.target.value);
              handleSearchLocation(e.target.value);
            }}
          />
        </div>

        {places.length > 0 && (
          <div className="list-item-place">
            {places?.map((item, index) => {
              return (
                <div className="div-item">
                  <p
                    key={index}
                    onClick={(e) => {
                      setAddress(item?.description);
                      findPlace(item?.place_id);
                    }}
                    className="item-option-place"
                  >
                    {item?.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {address === "" && (
          <>
            {dataAddress.length > 0 && (
              <div className="mt-2">
                <p className="title-list-address">{`${i18n.t(
                  "address_default",
                  {
                    lng: lang,
                  }
                )}`}</p>
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
                          <p className="title-address">
                            {item?.address.slice(0, item?.address.indexOf(","))}
                          </p>
                          <p className="title-details-address">
                            {item?.address}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </List>
              </div>
            )}
          </>
        )}

        <p className="text-error">{errorAddress}</p>
        <div className="div-add-service mt-3">
          <p className="label-time">{`${i18n.t("times", { lng: lang })}`}</p>
          <div className="div-service">
            {extendService.map((item) => {
              return (
                <div
                  className={
                    item?._id === time?._id
                      ? "select-service"
                      : "select-service-default"
                  }
                  onClick={() => onChangeTimeService(item)}
                >
                  <p
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.title?.[lang]}
                  </p>
                  <p
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {/* {item?.estimate === 0.5
                      ? item?.description?.vi
                      : item?.description?.vi.slice(
                          0,
                          item?.description?.[lang].indexOf("2")
                        )} */}
                    {item?.description?.[lang]?.slice(
                      item?.description?.[lang].indexOf(" ")
                    )}
                  </p>
                  <p
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.estimate !== 0.5 &&
                      item?.description?.[lang].slice(
                        0,
                        item?.description?.[lang].indexOf(" ")
                      )}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-error">{errorTime}</p>
        </div>

        <div className="div-add-service mt-3">
          <p className="label-time">{`${i18n.t("extra_service", {
            lng: lang,
          })}`}</p>
          <div className="div-service">
            {addService.map((item) => {
              return (
                <button
                  className={
                    mutipleSelected.some((items) => items._id === item?._id)
                      ? "select-service"
                      : "select-service-default"
                  }
                  onClick={() => onChooseMultiple(item?._id)}
                  // disabled={
                  //   estimate === 4 && item?.estimate === 0
                  //     ? false
                  //     : estimate !== 4
                  //     ? false
                  //     : true
                  // }
                >
                  <p
                    className={
                      mutipleSelected.some((items) => items._id === item?._id)
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.title?.[lang]}
                  </p>
                  <p
                    className={
                      mutipleSelected.some((items) => items._id === item?._id)
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.description?.[lang]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-picker mt-2">
          <p className="label m-0 mb-2">{`${i18n.t("date_work", {
            lng: lang,
          })}`}</p>
          <DatePicker
            format={dateFormat}
            onChange={onChange}
            className="select-time"
          />
          <p className="text-error">{errorDateWork}</p>
        </div>

        <div className="form-picker-hours">
          <p className="label-hours">
            {`${i18n.t("time_work", { lng: lang })}`} (*)
          </p>
          <div className="div-hours">
            {DATA_TIME_TOTAL.map((item) => {
              return (
                <Button
                  style={{ width: "auto" }}
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
          <p className="text-error">{errorTimeWork}</p>
        </div>

        <div className="div-auto-order">
          <p className="label-hours">
            {`${i18n.t("weeekly_schedule", { lng: lang })}`}
          </p>
          <Switch
            defaultChecked={isAutoOrder}
            style={{ width: 50, marginRight: 20 }}
            onChange={() => setIsAutoOrder(!isAutoOrder)}
          />
        </div>
        {isAutoOrder && (
          <div className="div-loop">
            {date.map((item, index) => {
              return (
                <div
                  className={
                    dayLoop.some((items) => items === item?.value)
                      ? "div-item-loop-day-select"
                      : "div-item-loop-day"
                  }
                  key={index}
                  onClick={() => onChooseDayLoop(item?.value)}
                >
                  {item?.title?.[lang]}
                </div>
              );
            })}
          </div>
        )}

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

        <InputCustom
          title={`${i18n.t("note", { lng: lang })}`}
          placeholder={`${i18n.t("enter_note", { lng: lang })}`}
          onChange={(e) => setNote(e.target.value)}
          className="input-form-note"
        />

        <div className="div-money">
          <p className="label-tip">
            (*) {`${i18n.t("tip_collaborator", { lng: lang })}`}
          </p>
          <InputNumber
            formatter={(value) =>
              `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
            }
            value={tipCollaborator}
            onChange={(e) => setTipCollaborator(e)}
            className="input-note"
            min={0}
            max={50000}
          />
        </div>

        <div className="mt-3">
          <div>
            <InputCustom
              title={`${i18n.t("collaborator", { lng: lang })}`}
              className="input-search-collaborator"
              error={errorCollaborator}
              onChange={(e) => {
                searchCollaborator(e.target.value);
                setNameCollaborator(e.target.value);
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
                    <div className="div-name">
                      <Image
                        preview={false}
                        src={item?.avatar}
                        className="img-collaborator"
                      />
                      <p className="text-name">
                        {item?.full_name} - {item?.phone} - {item?.id_view}
                      </p>
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
                <p className="text-code-promotion">{item?.code}</p>
                <p className="text-title-promotion">{item?.title?.[lang]}</p>
              </div>
            );
          })}
        </div>
        {priceOrder && (
          <div className="div-total mt-3">
            <p className="m-0">
              {`${i18n.t("provisional", { lng: lang })}`}:{" "}
              {formatMoney(priceOrder)}
            </p>
            <p className="m-0">
              {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
              {formatMoney(feeService)}
            </p>
            {tipCollaborator > 0 && (
              <p className="m-0">
                {`${i18n.t("tips", { lng: lang })}`}:{" "}
                {formatMoney(tipCollaborator)}
              </p>
            )}
            {eventPromotion.map((item, index) => {
              return (
                <p style={{ color: "red", margin: 0 }} key={index}>
                  {item?.title?.[lang]}: {"-"}
                  {formatMoney(item?.discount)}
                </p>
              );
            })}
            {discount > 0 && (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p style={{ color: "red", margin: 0 }}>
                  {itemPromotion?.title?.[lang]}:{" "}
                </p>
                <p style={{ color: "red", margin: 0 }}>
                  {" "}
                  {formatMoney(-discount)}
                </p>
              </div>
            )}
          </div>
        )}
        {priceOrder && (
          <div onClick={onGetBill}>
            <Popover
              placement="rightTop"
              content={
                <div className="div-bill" ref={ref}>
                  <div className="div-total">
                    <p className="text-bill">Thông tin báo giá</p>
                    <p className="m-0">Dịch vụ: {nameService}</p>
                    <p className="m-0">Địa điểm: {address}</p>
                    <p className="m-0">
                      {`${i18n.t("provisional", { lng: lang })}`}:{" "}
                      {formatMoney(priceOrder)}
                    </p>
                    <p className="m-0">
                      {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
                      {formatMoney(feeService)}
                    </p>
                    {tipCollaborator > 0 && (
                      <p className="m-0">
                        {`${i18n.t("tips", { lng: lang })}`}:{" "}
                        {formatMoney(tipCollaborator)}
                      </p>
                    )}
                    {eventPromotion.map((item, index) => {
                      return (
                        <p
                          style={{ color: "red", marginLeft: 5, margin: 0 }}
                          key={index}
                        >
                          {`- ${item?.title?.[lang]}: - ${formatMoney(
                            item?.discount
                          )}`}
                        </p>
                      );
                    })}
                    {discount > 0 && (
                      <div>
                        <p style={{ color: "red", marginLeft: 5, margin: 0 }}>
                          - {itemPromotion?.title?.[lang]}:{" "}
                        </p>
                        <p style={{ color: "red", margin: 0 }}>
                          {" "}
                          {formatMoney(-discount)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="price-total">
                    <p className="title-price">Tổng tiền thanh toán </p>
                    <p className="text-money-total">
                      {formatMoney(
                        priceOrder +
                          feeService -
                          discount -
                          eventFeePromotion +
                          tipCollaborator
                      )}
                    </p>
                  </div>
                </div>
              }
              trigger="click"
            >
              <Button
                style={{ height: 20, marginTop: 20, padding: 0, width: 20 }}
              >
                <i className="uil uil-receipt"></i>
              </Button>
            </Popover>
          </div>
        )}

        <div className="div-footer mt-3">
          <p className="text-price">
            {`${i18n.t("price", { lng: lang })}`}:{" "}
            {priceOrder > 0
              ? formatMoney(
                  priceOrder +
                    feeService -
                    discount -
                    eventFeePromotion +
                    tipCollaborator
                )
              : formatMoney(0)}
          </p>
          <Button style={{ width: "auto" }} onClick={onCreateOrder}>{`${i18n.t(
            "post",
            {
              lng: lang,
            }
          )}`}</Button>
        </div>
        {isLoading && <LoadingPagination />}
      </div>
    </>
  );
};

export default CleaningHourly;
