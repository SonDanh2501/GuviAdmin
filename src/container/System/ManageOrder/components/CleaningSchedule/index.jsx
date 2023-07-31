import { Button, Drawer, Input, List } from "antd";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
} from "date-fns";
import _debounce from "lodash/debounce";
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
import { loadingAction } from "../../../../../redux/actions/loading";
import "./index.scss";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";

const CleaningSchedule = (props) => {
  const { extendService, id, name, setErrorNameCustomer, idService } = props;
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
  const [dataFeeService, setDataFeeService] = useState(0);
  const [itemPromotion, setItemPromotion] = useState(0);
  const [isAutoOrder, setIsAutoOrder] = useState(false);
  const [places, setPlaces] = useState([]);
  const [chooseMonth, setChooseMonth] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [estimateMonth, setEstimateMonth] = useState(1);
  const [estimateDateWork, setEstimateDateWork] = useState(0);
  const [selectDay, setSelectDay] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [errorCollaborator, setErrorCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [dataAddress, setDataAddress] = useState([]);
  const [open, setOpen] = useState(false);
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
    months.map((month) => {
      month.map((day) => {
        selectedDate.includes(day.toString().slice(0, 3)) &&
          day > addDays(new Date(), -1) &&
          day < addDays(addDays(new Date(), 7), 30 * estimateMonth) &&
          !selectDay.includes(day.toString()) &&
          selectDay.push(day.toString());
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
      months.map((month) => {
        month.map((day) => {
          setSelectDay((prev) => prev.filter((p) => p !== day.toString()));
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
    [estimateDateWork, months, selectedDate, chooseMonth, timeWork]
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
    selectDay.toString(),
    chooseMonth,
    estimateMonth,
    date_work_schedule,
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
  }, [
    lat,
    long,
    timeWork,
    time,
    id,
    selectDay.toString(),
    chooseMonth,
    estimateMonth,
    note,
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
    [
      id,
      lat,
      long,
      address,
      timeWork,
      date_work_schedule,
      time,
      chooseMonth,
      estimateMonth,
      codePromotion,
    ]
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
    chooseMonth,
    estimateMonth,
    idCollaborator,
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
    }, 1000),
    [id]
  );

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
                <a
                  key={index}
                  className="text-option-place"
                  onClick={(e) => {
                    setAddress(item?.description);
                    findPlace(item?.place_id);
                  }}
                >
                  {item?.description}
                </a>
              );
            })}
          </div>
        )}

        {address === "" && (
          <>
            {dataAddress.length > 0 && (
              <div className="mt-2">
                <a className="title-list-address">{`${i18n.t(
                  "address_default",
                  {
                    lng: lang,
                  }
                )}`}</a>
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
                          <a className="title-details-address">
                            {item?.address}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </List>
              </div>
            )}
          </>
        )}

        <a className="text-error">{errorAddress}</a>
        <div className="div-add-service mt-3">
          <a className="label">
            {`${i18n.t("times", { lng: lang })}`}{" "}
            <a style={{ color: "red" }}>(*)</a>
          </a>
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
                    {item?.description?.[lang].slice(
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
                    {item?.description?.[lang].slice(
                      item?.description?.[lang].indexOf(" ")
                    )}
                  </a>
                </div>
              );
            })}
          </div>
          <a className="text-error">{errorTime}</a>
        </div>

        <div className="div-select-date mt-2">
          <a className="label-date">Ngày làm (*)</a>
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
                  <a>{item?.date}</a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-picker-hours">
          <a className="label-hours">
            {`${i18n.t("time_work", { lng: lang })}`} (*)
          </a>
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
          <a className="text-error">{errorTimeWork}</a>
        </div>

        <div className="div-select-month">
          <a className="label-month">
            {`${i18n.t("subscription_duration", { lng: lang })}`} (*)
          </a>
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
                  <a>
                    {item?.title} {`${i18n.t("month", { lng: lang })}`}
                  </a>
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
              searchValue(e.target.value);
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
                      setErrorCollaborator("");
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
              {`${i18n.t("number_sessions", { lng: lang })}`}:{" "}
              {selectDay.length}
            </a>
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
                <a style={{ color: "red" }}>{itemPromotion?.title?.[lang]}: </a>
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
                    <a className="title-month">
                      {formatMonthVN} , {year[3]}
                    </a>
                    <div className="div-flex-date">
                      {date.map((item) => (
                        <div key={item.id} className="div-date">
                          <a className="text-date">{item.title[lang]}</a>
                        </div>
                      ))}
                    </div>

                    <div className="div-descrip-time">
                      {theFirstDayInMonth === "Tue"
                        ? Tue.map((item) => (
                            <a key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Wed"
                        ? Wed.map((item) => (
                            <a key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Thu"
                        ? Thu.map((item) => (
                            <a key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Fri"
                        ? Fri.map((item) => (
                            <a key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Sat"
                        ? Sat.map((item) => (
                            <a key={item.id} className="div-date" />
                          ))
                        : theFirstDayInMonth === "Sun"
                        ? Sun.map((item) => (
                            <a key={item.id} className="div-date" />
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
                            <a
                              className={
                                day < addDays(new Date(), -1)
                                  ? "date-not-use"
                                  : selectDay.includes(day.toString())
                                  ? "text-date-selected"
                                  : "date-use"
                              }
                            >
                              {words[2]}
                            </a>
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
