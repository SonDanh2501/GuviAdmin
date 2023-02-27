import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Input,
  List,
  Row,
  Switch,
} from "antd";
import "./index.scss";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import {
  getCalculateFeeApi,
  getExtendOptionalByOptionalServiceApi,
  getOptionalServiceByServiceApi,
  getPromotionByCustomerApi,
} from "../../../../api/service";
import { searchCustomers } from "../../../../api/customer";
import { errorNotify } from "../../../../helper/toast";
import { getService } from "../../../../redux/selectors/service";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../../../../helper/formatMoney";
import {
  checkCodePromotionOrderApi,
  checkEventCodePromotionOrderApi,
  createOrderApi,
  getServiceFeeOrderApi,
} from "../../../../api/order";
import _debounce from "lodash/debounce";
import { loadingAction } from "../../../../redux/actions/loading";
import LoadingPagination from "../../../../components/paginationLoading";
import {
  getPlaceDetailApi,
  googlePlaceAutocomplete,
} from "../../../../api/location";
import useDebounce from "../../../../helper/debounce";
const AddOrder = () => {
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
  const [extendService, setExtendService] = useState([]);
  const [errorExtendService, setErrorExtendService] = useState("");
  const [addService, setAddService] = useState([]);
  const [mutipleSelected, setMutipleSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [errorNameCustomer, setErrorNameCustomer] = useState("");
  const [id, setId] = useState("");
  const service = useSelector(getService);
  const [serviceApply, setServiceApply] = useState("");
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

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    getOptionalServiceByServiceApi(service[0]?._id)
      .then((res) => {
        getExtendOptionalByOptionalServiceApi(res.data[0]?._id)
          .then((res) => setExtendService(res?.data))
          .catch((err) => {});
        getExtendOptionalByOptionalServiceApi(res.data[1]?._id)
          .then((res) => setAddService(res?.data))
          .catch((err) => {});
      })
      .catch((err) => console.log(err));
    setServiceApply(service[0]?._id);
  }, [service]);

  useEffect(() => {
    getPromotionByCustomerApi(id)
      .then((res) => setPromotionCustomer(res.data))
      .catch((err) => console.log(err));
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

  const onChangeServiceApply = (e) => {
    setIsLoading(true);
    getOptionalServiceByServiceApi(e.target.value)
      .then((res) => {
        getExtendOptionalByOptionalServiceApi(res.data[0]?._id)
          .then((res) => {
            setExtendService(res?.data);
            setIsLoading(false);
          })
          .catch((err) => {});
        getExtendOptionalByOptionalServiceApi(res.data[1]?._id)
          .then((res) => {
            setAddService(res?.data);
            setIsLoading(false);
          })
          .catch((err) => {});
      })
      .catch((err) => console.log(err));

    setServiceApply(e.target.value);
    setPriceOrder();
  };

  const timeW = dateWork + "T" + timeWork + ".000Z";

  const timeNow = Number(new Date().toTimeString().slice(0, 2));

  const dayNow = new Date().toISOString().slice(0, 10);

  const valueSearch = (value) => {
    setName(value);
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomers(0, 10, "", value)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
          });
      } else if (id) {
        setDataFilter([]);
      } else {
        setDataFilter([]);
      }
      setId("");
    }, 500),
    []
  );

  var AES = require("crypto-js/aes");
  const temp = JSON.stringify({
    lat: lat,
    lng: long,
    address: address,
  });
  var accessToken = AES.encrypt(temp, "guvico");

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
        extend_optional: mutipleSelected.concat(time),
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
        extend_optional: mutipleSelected.concat(time),
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
  }, [lat, long, address, timeWork, dateWork, mutipleSelected, time, id]);

  const checkPromotion = useCallback(
    (item) => {
      setIsLoading(true);
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
    [id, lat, long, address, timeWork, dateWork, mutipleSelected, time]
  );

  const valueAddress = (value) => {
    setAddress(value);
  };

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
    }, 3000),
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

  const onCreateOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));

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
      })
        .then((res) => {
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
  ]);

  return (
    <>
      <Button className="btn-add-order" onClick={showDrawer}>
        Tạo dịch vụ
      </Button>
      <Drawer
        title="Thêm order"
        placement="right"
        onClose={onClose}
        width={600}
        open={open}
      >
        <div>
          <a className="label-customer">
            Khách hàng <a style={{ color: "red" }}>(*)</a>
          </a>
          <Input
            placeholder="Tìm kiếm theo tên hoặc số điện thoại số điện thoại"
            value={name}
            type="text"
            onChange={(e) => {
              valueSearch(e.target.value);
              handleSearch(e.target.value);
            }}
            className="input"
          />
          <a className="text-error">{errorNameCustomer}</a>

          {dataFilter.length > 0 && (
            <List type={"unstyled"} className="list-item">
              {dataFilter?.map((item, index) => {
                return (
                  <div
                    key={index}
                    value={item?._id}
                    onClick={(e) => {
                      setId(e.target.value);
                      setName(item?.full_name);
                      setDataFilter([]);
                      setErrorNameCustomer("");
                    }}
                  >
                    <a>
                      {item?.full_name} - {item?.phone} - {item?.id_view}
                    </a>
                  </div>
                );
              })}
            </List>
          )}
        </div>

        <div>
          <div className="mt-3">
            <CustomTextInput
              className="select-type-promo"
              name="select"
              type="select"
              value={serviceApply}
              onChange={onChangeServiceApply}
              body={service.map((item, index) => {
                return (
                  <option key={index} value={item?._id}>
                    {item?.title?.vi}
                  </option>
                );
              })}
            />
          </div>

          <div>
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
              className="input"
            />
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

            <div className="div-add-service mt-3">
              <a className="label">Dịch vụ thêm</a>
              <div className="div-service">
                {addService.slice(0, 3).map((item) => {
                  return (
                    <div
                      className={
                        mutipleSelected.some((items) => items._id === item?._id)
                          ? "select-service"
                          : "select-service-default"
                      }
                      onClick={() => onChooseMultiple(item?._id)}
                    >
                      <a
                        className={
                          mutipleSelected.some(
                            (items) => items._id === item?._id
                          )
                            ? "text-service"
                            : "text-service-default"
                        }
                      >
                        {item?.title?.vi}
                      </a>
                      <a
                        className={
                          mutipleSelected.some(
                            (items) => items._id === item?._id
                          )
                            ? "text-service"
                            : "text-service-default"
                        }
                      >
                        {item?.description?.vi}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-picker">
              <a className="label">
                Ngày làm <a style={{ color: "red" }}>(*)</a>
              </a>
              <DatePicker format={dateFormat} onChange={onChange} />
              <a className="text-error">{errorDateWork}</a>
            </div>
            <div className="form-picker-hours">
              <a className="label-hours">Giờ làm (*)</a>
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
                      disabled={
                        dateWork === dayNow
                          ? timeNow >= timeChosse
                            ? true
                            : false
                          : false
                      }
                    >
                      {item.title}
                    </Button>
                  );
                })}
              </div>
              <a className="text-error">{errorTimeWork}</a>
              <div className="div-auto-order">
                <a className="label-hours">Lặp lại hàng tuần</a>
                <Switch
                  defaultChecked={isAutoOrder}
                  style={{ width: 50, marginRight: 20 }}
                  onChange={() => setIsAutoOrder(!isAutoOrder)}
                />
              </div>
            </div>
            <CustomTextInput
              label="Ghi chú"
              type="textarea"
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
          </div>
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
      </Drawer>
    </>
  );
};
export default AddOrder;
