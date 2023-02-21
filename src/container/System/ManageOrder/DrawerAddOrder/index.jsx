import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, DatePicker, Drawer, Input, List, Row } from "antd";
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
import { loadingAction } from "../../../../redux/actions/loading";
import LoadingPagination from "../../../../components/paginationLoading";
const AddOrder = () => {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState([]);
  const [extraService, setExtraService] = useState("");
  const [dateWork, setDateWork] = useState("");
  const [timeWork, setTimeWork] = useState("");
  const [extendService, setExtendService] = useState([]);
  const [addService, setAddService] = useState([]);
  const [mutipleSelected, setMutipleSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
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
  };

  const onChangeTime = (value) => {
    setTimeWork(value);
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
    getOptionalServiceByServiceApi(e.target.value)
      .then((res) => {
        getExtendOptionalByOptionalServiceApi(res.data[0]?._id)
          .then((res) => setExtendService(res?.data))
          .catch((err) => {});
        getExtendOptionalByOptionalServiceApi(res.data[1]?._id)
          .then((res) => setAddService(res?.data))
          .catch((err) => {});
      })
      .catch((err) => console.log(err));

    setServiceApply(e.target.value);
    setPriceOrder();
  };

  const onChangeExtraService = (value) => {
    if (value === extraService) {
      setExtraService("");
    } else {
      setExtraService(value);
    }
  };

  const timeW = dateWork + "T" + timeWork + ".000Z";

  const timeNow = Number(new Date().toTimeString().slice(0, 2)) + 3;

  const dayNow = new Date().toISOString().slice(0, 10);

  const handleSearch = useCallback((value) => {
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
  }, []);

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
        });
    }

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
        });
    }
  }, [lat, long, address, timeWork, dateWork, mutipleSelected, time, id]);

  const checkPromotion = useCallback(
    (code) => {
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
        code_promotion: code,
      })
        .then((res) => {
          setIsLoading(false);
          setCodePromotion(code);
          setDiscount(res?.discount);
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

  const onCreateOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createOrderApi({
      id_customer: id,
      token: accessToken.toString(),
      type: "loop",
      type_address_work: "house",
      note_address: "",
      note: note,
      is_auto_order: false,
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
          <a className="label">Khách hàng</a>
          <Input
            placeholder="Tìm kiếm theo tên hoặc số điện thoại số điện thoại"
            value={name}
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            className="input"
          />

          {dataFilter.length > 0 && (
            <List type={"unstyled"} className="list-item">
              {dataFilter?.map((item, index) => {
                return (
                  <option
                    key={index}
                    value={item?._id}
                    onClick={(e) => {
                      setId(e.target.value);
                      setName(item?.full_name);
                      setDataFilter([]);
                    }}
                  >
                    {item?.full_name}
                  </option>
                );
              })}
            </List>
          )}
        </div>

        {id && (
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
              <CustomTextInput
                label="Nhập địa chỉ"
                type="text"
                placeholder="Vui lòng nhập địa chỉ"
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="div-latLong">
                <CustomTextInput
                  label="Kinh độ"
                  type="text"
                  placeholder="Vui lòng nhập kinh độ"
                  onChange={(e) => setLat(e.target.value)}
                />

                <CustomTextInput
                  label="Vĩ độ"
                  type="text"
                  placeholder="Vui lòng nhập vĩ độ"
                  onChange={(e) => setLong(e.target.value)}
                />
              </div>

              <div className="div-add-service">
                <a className="label">Thời lượng</a>
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
              </div>

              <div className="div-add-service">
                <a className="label">Dịch vụ thêm</a>
                <div className="div-service">
                  {addService.slice(0, 3).map((item) => {
                    return (
                      <div
                        className={
                          mutipleSelected.some(
                            (items) => items._id === item?._id
                          )
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
                <a className="label">Ngày làm</a>
                <DatePicker format={dateFormat} onChange={onChange} />
              </div>
              <div className="form-picker-hours">
                <a className="label-hours">Giờ làm</a>
                {/* <DatePicker format={dateFormat} onChange={onChange} /> */}
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
                      onClick={() => checkPromotion(item?.code)}
                    >
                      <a className="text-code">{item?.code}</a>
                      <a className="text-title-promotion">{item?.title?.vi}</a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className="div-total mt-3">
          <a>Tạm tính: {formatMoney(priceOrder)}</a>
          {eventPromotion.map((item, index) => {
            return (
              <a style={{ color: "red" }}>
                {item?.title.vi}: {"-"}
                {formatMoney(item?.discount)}
              </a>
            );
          })}
          <a>Phí dịch vụ: {formatMoney(feeService)}</a>
        </div>
        {priceOrder && (
          <div className="div-footer mt-5">
            <a className="text-price">
              Giá:
              {formatMoney(
                priceOrder + feeService - discount - eventFeePromotion
              )}
            </a>
            <Button onClick={onCreateOrder}>Đăng việc</Button>
          </div>
        )}

        {isLoading && <LoadingPagination />}
      </Drawer>
    </>
  );
};
export default AddOrder;
