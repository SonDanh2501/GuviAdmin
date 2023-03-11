import { Button, Drawer, Input, List } from "antd";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
} from "date-fns";
import _debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  getServiceFeeOrderApi,
} from "../../../../../api/order";
import {
  getCalculateFeeApi,
  getPromotionByCustomerApi,
} from "../../../../../api/service";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import "./index.scss";

const CleaningSchedule = (props) => {
  const { extendService, id, name, setErrorNameCustomer } = props;
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
  const [errorExtendService, setErrorExtendService] = useState("");
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPromotionByCustomerApi(id)
      .then((res) => setPromotionCustomer(res.data))
      .catch((err) => console.log(err));
  }, [id]);

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
          day > addDays(new Date(), 7) &&
          day < addDays(addDays(new Date(), 7), 30 * estimateMonth) &&
          !selectDay.includes(day.toString()) &&
          selectDay.push(day.toString());
      });
    });
  }, [estimateMonth, selectedDate, selectDay]);

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
    [estimateDateWork, months, selectedDate]
  );

  const onChooseMonth = (value) => {
    if (value !== estimateMonth) {
      selectDay.splice(0, selectDay.length);
    }
    setChooseMonth(value);
    setEstimateMonth(value);
  };

  var uploadDateFilter = selectDay.map(
    (item) => new Date(item.replace("00:00:00", timeWork))
  );

  let date_work_schedule = uploadDateFilter.map((item) => item.toISOString());

  var AES = require("crypto-js/aes");
  const temp = JSON.stringify({
    lat: lat,
    lng: long,
    address: address,
  });
  var accessToken = AES.encrypt(temp, "guvico");

  const valueAddress = (value) => {
    setAddress(value);
  };

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
    }, 3000),
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
    if (lat && long && address && timeWork && time) {
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
  }, [lat, long, address, timeWork, time, note, selectDay]);

  useEffect(() => {
    if (lat && long && address && timeWork && time) {
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
  }, [lat, long, address, timeWork, time, note, selectDay]);

  useEffect(() => {
    if (lat && long && address && timeWork && time && id) {
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
  }, [lat, long, address, timeWork, time, id, selectDay]);

  const checkPromotion = useCallback(
    (item) => {
      setIsLoading(true);
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
    },
    [id, lat, long, address, timeWork, date_work_schedule, time]
  );

  const onCreateOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));

    if (lat && long && address && timeWork && time && id) {
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
  ]);

  const onSelectDay = useCallback(
    (title) => {
      if (selectDay.includes(title)) {
        if (selectDay.length > 4) {
          setSelectDay((prev) => prev.filter((p) => p !== title));
        }
      } else {
        setSelectDay((prev) => [...prev, title]);
      }
    },
    [selectDay]
  );

  return (
    <>
      <div>
        <div className="div-search-address">
          <a className="label-customer">
            Địa điểm <a style={{ color: "red" }}>(*)</a>
          </a>
          <Input
            placeholder="Vui lòng chọn địa chỉ"
            value={address}
            type="text"
            onChange={(e) => {
              valueAddress(e.target.value);
              handleSearchLocation(e.target.value);
            }}
            className="input-search"
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
        <a className="text-error">{errorAddress}</a>
        <div className="div-add-service mt-3">
          <a className="label">
            Thời lượng <a style={{ color: "red" }}>(*)</a>
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
                    {item?.title?.vi}
                  </a>
                  <a
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.description?.vi.slice(
                      0,
                      item?.description?.vi.indexOf("2")
                    )}
                  </a>
                  <a
                    className={
                      item?._id === time?._id
                        ? "text-service"
                        : "text-service-default"
                    }
                  >
                    {item?.description?.vi.slice(
                      item?.description?.vi.indexOf(" ")
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
          <a className="label-hours">Giờ làm (*)</a>
          <div className="div-hours">
            {DATA_TIME.map((item) => {
              return (
                <Button
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
          <a className="label-month">Gói tháng (*)</a>
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
                  <a>{item?.title}</a>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          className="btn-see-time-work"
          onClick={showDrawer}
          disabled={lat && long && address && timeWork && time ? false : true}
        >
          Xem lịch trình làm việc
        </Button>

        <CustomTextInput
          label="Ghi chú"
          type="textarea"
          classNameForm="input-note"
          placeholder="Vui lòng nhập ghi chú"
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="div-promotion">
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
                <a className="text-code">{item?.code}</a>
                <a className="text-title-promotion">{item?.title?.vi}</a>
              </div>
            );
          })}
        </div>
        {priceOrder && (
          <div className="div-total mt-3">
            <a>Tạm tính: {formatMoney(priceOrder)}</a>
            <a>Phí dịch vụ: {formatMoney(feeService)}</a>
            {eventPromotion.map((item, index) => {
              return (
                <a style={{ color: "red" }}>
                  {item?.title.vi}: {"-"}
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
            Giá:{" "}
            {priceOrder > 0
              ? formatMoney(
                  priceOrder + feeService - discount - eventFeePromotion
                )
              : formatMoney(0)}
          </a>
          <Button onClick={onCreateOrder}>Đăng việc</Button>
        </div>
        {isLoading && <LoadingPagination />}

        <div>
          <Drawer
            title="Xem lịch làm việc"
            placement="right"
            onClose={onClose}
            width={400}
            open={open}
          >
            <div>
              {months?.map((month, i) => {
                const theFirstDayInMonth = month[0].toString().split(" ")[0];
                const year = month[0].toString().split(/\s/);

                const formatMonthVN = (function (timess) {
                  var a = new Date(timess).toString().split(/\s/);

                  return {
                    Jan: "Tháng 1",
                    Feb: "Tháng 2",
                    Mar: "Tháng 3",
                    Apr: "Tháng 4",
                    May: "Tháng 5",
                    Jun: "Tháng 6",
                    Jul: "Tháng 7",
                    Aug: "Tháng 8",
                    Sep: "Tháng 9",
                    Oct: "Tháng 10",
                    Nov: "Tháng 11",
                    Dec: "Tháng 12",
                  }[a[1]];
                })(month[0]);

                return (
                  <div key={i}>
                    <a className="title-month">
                      {formatMonthVN} , {year[3]}
                    </a>
                    <div className="div-flex-date">
                      {date.map((item) => (
                        <div key={item.id} className="div-date">
                          <a className="text-date">{item.title}</a>
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
                          <div
                            key={index}
                            disabled={day < addDays(new Date(), 7)}
                            className={
                              day < addDays(new Date(), 7)
                                ? "div-date"
                                : selectDay.includes(day.toString())
                                ? "div-date-selected"
                                : "div-date"
                            }
                            onClick={() => onSelectDay(day.toString())}
                          >
                            <a
                              className={
                                day < addDays(new Date(), 7)
                                  ? "date-not-use"
                                  : selectDay.includes(day.toString())
                                  ? "text-date-selected"
                                  : "date-use"
                              }
                            >
                              {words[2]}
                            </a>
                          </div>
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
