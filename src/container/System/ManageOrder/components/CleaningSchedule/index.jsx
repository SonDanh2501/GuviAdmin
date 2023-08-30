import { Button, Drawer, Image, List, Popover } from "antd";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
} from "date-fns";
import { toPng } from "html-to-image";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchCollaboratorsCreateOrder } from "../../../../../api/collaborator";
import {
  DATA_DATE,
  DATA_MONTH,
  DATA_TIME,
  date,
} from "../../../../../api/fakeData";
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

const CleaningSchedule = (props) => {
  const {
    extendService,
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
  const [timeWork, setTimeWork] = useState("");
  const [errorTimeWork, setErrorTimeWork] = useState("");

  const [selectedDate, setSelectedDate] = useState([]);
  const [promotionCustomer, setPromotionCustomer] = useState([]);
  const [priceOrder, setPriceOrder] = useState();
  const [discount, setDiscount] = useState(0);
  const [codePromotion, setCodePromotion] = useState("");
  const [eventPromotion, setEventPromotion] = useState([]);
  const [eventFeePromotion, setEventFeePromotion] = useState(0);
  const [feeService, setFeeService] = useState(0);
  const [itemPromotion, setItemPromotion] = useState(0);
  const [places, setPlaces] = useState([]);
  const [chooseMonth, setChooseMonth] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [estimateMonth, setEstimateMonth] = useState(1);
  const [estimateDateWork, setEstimateDateWork] = useState(0);
  const [selectDay, setSelectDay] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [dataAddress, setDataAddress] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const lang = useSelector(getLanguageState);
  const inputRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

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

  const months = eachMonthOfInterval({
    start: new Date(),
    end: addMonths(new Date(), estimateMonth + 1),
  }).map((item) => {
    const allDays = eachDayOfInterval({
      start: item,
      end: endOfMonth(item),
    });
    return allDays;
  });

  useEffect(() => {
    months.forEach((month) => {
      month.forEach((day) => {
        selectedDate.includes(day.toString().slice(0, 3)) &&
          day > addDays(new Date(), -1) &&
          day < addDays(addDays(new Date(), 7), 30 * estimateMonth) &&
          !selectDay.includes(day.toString()) &&
          selectDay.push(day.toString());
        return;
      });
    });
    const timeout = setTimeout(() => {
      inputRef.current?.blur();
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [estimateMonth, selectedDate]);

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

  const optionSelectedDate = useCallback(
    (date) => {
      months.forEach((month) => {
        month.forEach((day) => {
          setSelectDay((prev) => prev.filter((p) => p !== day.toString()));
          return;
        });
      });
      if (selectedDate.includes(date?.value)) {
        setSelectedDate((prev) => prev.filter((p) => p !== date?.value));
        setEstimateDateWork(estimateDateWork - date?.estimate);
      } else {
        setSelectedDate((prev) => [...prev, date?.value]);
        setEstimateDateWork(estimateDateWork + date?.estimate);
      }
    },
    [estimateDateWork, months, selectedDate]
  );

  const onChooseMonth = (value) => {
    if (value !== estimateMonth) {
      selectDay.splice(0, selectDay.length);
    }
    setChooseMonth(value);
    setEstimateMonth(value);
  };

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

  const onSelectDay = useCallback(
    (title) => {
      if (selectDay.includes(title)) {
        if (selectDay.length > 3) {
          setSelectDay((prev) => prev.filter((p) => p !== title));
        }
      } else {
        setSelectDay((prev) => [...prev, title]);
      }
    },
    [selectDay]
  );

  var uploadDateFilter = selectDay.map(
    (item) => new Date(item.replace("00:00:00", timeWork))
  );

  let date_work_schedule = uploadDateFilter.map((item) => item.toISOString());

  useEffect(() => {
    if (
      lat &&
      long &&
      address &&
      timeWork &&
      time &&
      date_work_schedule.length > 0
    ) {
      getCalculateFeeApi({
        token: accessToken.toString(),
        type: "schedule",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: date_work_schedule,
        extend_optional: [time],
        payment_method: "point",
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
    }
  }, [
    lat,
    long,
    timeWork,
    time,
    note,
    selectDay,
    chooseMonth,
    estimateMonth,
    address,
  ]);

  useEffect(() => {
    if (
      lat &&
      long &&
      address &&
      timeWork &&
      time &&
      date_work_schedule.length > 0
    ) {
      getServiceFeeOrderApi({
        token: accessToken.toString(),
        type: "schedule",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: date_work_schedule,
        extend_optional: [time],
        payment_method: "point",
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
            message: err,
          });
        });
    }
    if (
      lat &&
      long &&
      address &&
      timeWork &&
      time &&
      id &&
      date_work_schedule.length > 0
    ) {
      setIsLoading(true);
      checkEventCodePromotionOrderApi(id, {
        token: accessToken.toString(),
        type: "schedule",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: date_work_schedule,
        extend_optional: [time],
        payment_method: "point",
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
    if (codePromotion) {
      checkCodePromotionOrderApi(id, {
        id_customer: id,
        token: accessToken.toString(),
        type: "schedule",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: date_work_schedule,
        extend_optional: [time],
        code_promotion: codePromotion,
        payment_method: "point",
      })
        .then((res) => {
          setIsLoading(false);
          setDiscount(res?.discount);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    }
  }, [
    lat,
    long,
    timeWork,
    time,
    id,
    selectDay,
    chooseMonth,
    estimateMonth,
    note,
    codePromotion,
    address,
  ]);

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
          type: "schedule",
          type_address_work: "house",
          note_address: "",
          note: note,
          is_auto_order: false,
          date_work_schedule: date_work_schedule,
          extend_optional: [time],
          code_promotion: item?.code,
          payment_method: "point",
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
    [id, date_work_schedule, time, codePromotion, accessToken, note]
  );

  const onCreateOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    if ((lat && long && address && timeWork && time && id) || idCollaborator) {
      if (idCollaborator) {
        createOrderApi({
          id_customer: id,
          token: accessToken.toString(),
          type: "loop",
          type_address_work: "house",
          note_address: "",
          note: note,
          is_auto_order: false,
          date_work_schedule: date_work_schedule,
          extend_optional: [time],
          code_promotion: codePromotion,
          payment_method: "point",
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
      } else {
        createOrderApi({
          id_customer: id,
          token: accessToken.toString(),
          type: "loop",
          type_address_work: "house",
          note_address: "",
          note: note,
          is_auto_order: false,
          date_work_schedule: date_work_schedule,
          extend_optional: [time],
          code_promotion: codePromotion,
          payment_method: "point",
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
      }
    } else if (!id) {
      setErrorNameCustomer("Vui lòng chọn khách hàng");
      dispatch(loadingAction.loadingRequest(false));
    } else if (!address && !lat && !long) {
      setErrorAddress("Vui lòng nhập đầy đủ địa chỉ");
      dispatch(loadingAction.loadingRequest(false));
    } else if (time.length === 0) {
      setErrorTime("Vui lòng chọn dịch vụ");
      dispatch(loadingAction.loadingRequest(false));
    } else if (!timeWork) {
      setErrorTimeWork("Vui lòng chọn giờ làm");
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
    date_work_schedule,
    time,
    codePromotion,
    note,
    idCollaborator,
    accessToken,
    dispatch,
    navigate,
    setErrorNameCustomer,
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
    }, 1000),
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
          <div className="list-item-place ">
            {places?.map((item, index) => {
              return (
                <p
                  key={index}
                  className="text-option-place"
                  onClick={(e) => {
                    setAddress(item?.description);
                    findPlace(item?.place_id);
                  }}
                >
                  {item?.description}
                </p>
              );
            })}
          </div>
        )}

        {address === "" && (
          <>
            {dataAddress.length > 0 && (
              <div className="mt-2">
                <p className="title-list-address m-0">{`${i18n.t(
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
          <p className="label m-0">{`${i18n.t("times", { lng: lang })}`} </p>
          <div className="div-service">
            {extendService.slice(0, 3).map((item) => {
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
                    {item?.description?.[lang].slice(
                      0,
                      item?.description?.[lang].indexOf("2")
                    )}
                  </p>
                  <p
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.description?.[lang].slice(
                      item?.description?.[lang].indexOf(" ")
                    )}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-error">{errorTime}</p>
        </div>

        <div className="div-select-date mt-2">
          <p className="label-date">Ngày làm (*)</p>
          <div className="div-date">
            {DATA_DATE?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    selectedDate.includes(item?.value)
                      ? "div-item-date"
                      : "div-item-date-default"
                  }
                  onClick={() => optionSelectedDate(item)}
                >
                  <p className="m-0">{item?.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-picker-hours">
          <p className="label-hours">
            {`${i18n.t("time_work", { lng: lang })}`} (*)
          </p>
          <div className="div-hours">
            {DATA_TIME.map((item) => {
              return (
                <Button
                  style={{ width: "auto" }}
                  className={
                    timeWork === item.time
                      ? "select-time"
                      : "select-time-default"
                  }
                  onClick={() => onChangeTime(item.time)}
                >
                  {item.title}
                </Button>
              );
            })}
          </div>
          <p className="text-error">{errorTimeWork}</p>
        </div>

        <div className="div-select-month">
          <p className="label-month">
            {`${i18n.t("subscription_duration", { lng: lang })}`} (*)
          </p>
          <div className="div-month">
            {DATA_MONTH?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    item?.estimate === chooseMonth
                      ? "div-item-month"
                      : "div-item-month-default"
                  }
                  onClick={() => onChooseMonth(item?.estimate)}
                >
                  <p className="m-0">
                    {item?.title} {`${i18n.t("month", { lng: lang })}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          className="btn-see-time-work"
          style={{ width: "auto" }}
          onClick={showDrawer}
          disabled={lat && long && address && timeWork && time ? false : true}
        >
          {`${i18n.t("see_schedule", { lng: lang })}`}
        </Button>

        <InputCustom
          title={`${i18n.t("note", { lng: lang })}`}
          textArea={true}
          placeholder={`${i18n.t("enter_note", { lng: lang })}`}
          onChange={(e) => setNote(e.target.value)}
          className="input-note"
        />

        <div>
          <InputCustom
            title={`${i18n.t("collaborator", { lng: lang })}`}
            placeholder={`${i18n.t("search", { lng: lang })}`}
            value={nameCollaborator}
            className="input-search-collaborator-order"
            onChange={(e) => {
              searchCollaborator(e.target.value);
              setNameCollaborator(e.target.value);
            }}
          />

          {dataCollaborator.length > 0 && (
            <List type={"unstyled"} className="list-item-add-order">
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
              {`${i18n.t("number_sessions", { lng: lang })}`}:{" "}
              {selectDay.length}
            </p>
            <p className="m-0">
              {`${i18n.t("provisional", { lng: lang })}`}:{" "}
              {formatMoney(priceOrder)}
            </p>
            <p className="m-0">
              {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
              {formatMoney(feeService)}
            </p>
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
                    <p className="text-bill m-0">Thông tin báo giá</p>
                    <p className="m-0">Dịch vụ: {nameService}</p>
                    <p className="m-0">Địa điểm: {address}</p>
                    <p className="m-0">
                      {`${i18n.t("number_sessions", { lng: lang })}`}:{" "}
                      {selectDay.length}
                    </p>
                    <p className="m-0">
                      {`${i18n.t("provisional", { lng: lang })}`}:{" "}
                      {formatMoney(priceOrder)}
                    </p>
                    <p className="m-0">
                      {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
                      {formatMoney(feeService)}
                    </p>

                    {eventPromotion.map((item, index) => {
                      return (
                        <p style={{ color: "red", marginLeft: 5, margin: 0 }}>
                          - {item?.title?.[lang]}: {"-"}
                          {formatMoney(item?.discount)}
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
                    <p className="title-price m-0">Tổng tiền thanh toán </p>
                    <p className="text-money-total m-0">
                      {formatMoney(
                        priceOrder + feeService - discount - eventFeePromotion
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
                <>
                  <i className="uil uil-receipt"></i>
                </>
              </Button>
            </Popover>
          </div>
        )}

        <div className="div-footer mt-5">
          <p className="text-price">
            {`${i18n.t("price", { lng: lang })}`}:{" "}
            {priceOrder > 0
              ? formatMoney(
                  priceOrder + feeService - discount - eventFeePromotion
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

        <div>
          <Drawer
            title={`${i18n.t("see_schedule", { lng: lang })}`}
            placement="right"
            onClose={onClose}
            width={420}
            open={open}
            headerStyle={{ height: 50 }}
          >
            <div>
              {months?.map((month, i) => {
                const theFirstDayInMonth = month[0].toString().split(" ")[0];
                const year = month[0].toString().split(/\s/);

                const formatMonthVN = (function (timess) {
                  var a = new Date(timess).toString().split(/\s/);

                  return {
                    Jan: i18n.t("January", { lng: lang }),
                    Feb: i18n.t("February", { lng: lang }),
                    Mar: i18n.t("March", { lng: lang }),
                    Apr: i18n.t("April", { lng: lang }),
                    May: i18n.t("May", { lng: lang }),
                    Jun: i18n.t("June", { lng: lang }),
                    Jul: i18n.t("July", { lng: lang }),
                    Aug: i18n.t("August", { lng: lang }),
                    Sep: i18n.t("September", { lng: lang }),
                    Oct: i18n.t("October", { lng: lang }),
                    Nov: i18n.t("November", { lng: lang }),
                    Dec: i18n.t("December", { lng: lang }),
                  }[a[1]];
                })(month[0]);

                return (
                  <div key={i} className="mt-2">
                    <p className="title-month">
                      {formatMonthVN} , {year[3]}
                    </p>
                    <div className="div-flex-date">
                      {date.map((item) => (
                        <div key={item.id} className="div-date">
                          <p className="text-date m-0">{item.title[lang]}</p>
                        </div>
                      ))}
                    </div>

                    <div className="div-descrip-time">
                      {theFirstDayInMonth === "Tue"
                        ? Tue.map((item) => (
                            <p key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Wed"
                        ? Wed.map((item) => (
                            <p key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Thu"
                        ? Thu.map((item) => (
                            <p key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Fri"
                        ? Fri.map((item) => (
                            <p key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Sat"
                        ? Sat.map((item) => (
                            <p key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Sun"
                        ? Sun.map((item) => (
                            <p key={item.id} className="div-date" />
                          ))
                        : null}

                      {month.map((day, index) => {
                        const words = day.toString().split(" ");

                        return (
                          <button
                            key={index}
                            disabled={
                              day < addDays(new Date(), -1) ? true : false
                            }
                            className={
                              day < addDays(new Date(), -1)
                                ? "div-date"
                                : selectDay.includes(day.toString())
                                ? "div-date-selected"
                                : "div-date"
                            }
                            onClick={() => onSelectDay(day.toString())}
                          >
                            <p
                              className={
                                day < addDays(new Date(), -1)
                                  ? "date-not-use"
                                  : selectDay.includes(day.toString())
                                  ? "text-date-selected"
                                  : "date-use"
                              }
                            >
                              {words[2]}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default CleaningSchedule;

const Tue = [
  {
    id: 1,
  },
];

const Wed = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];
const Thu = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
];
const Fri = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
];
const Sat = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
];

const Sun = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
];
