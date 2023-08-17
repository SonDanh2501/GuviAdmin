import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { Button, DatePicker, Input, InputNumber, List, Select } from "antd";
import _debounce from "lodash/debounce";
import {
  getPlaceDetailApi,
  googlePlaceAutocomplete,
} from "../../../../../api/location";
import {
  getCalculateFeeApi,
  getPromotionByCustomerApi,
} from "../../../../../api/service";
import {
  checkCodePromotionOrderApi,
  checkEventCodePromotionOrderApi,
  createOrderApi,
  getAddressCustomerApi,
  getServiceFeeOrderApi,
} from "../../../../../api/order";
import i18n from "../../../../../i18n";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { DATA_TIME_TOTAL } from "../../../../../api/fakeData";
import InputCustom from "../../../../../components/textInputCustom";
import { searchCollaboratorsCreateOrder } from "../../../../../api/collaborator";
import { errorNotify } from "../../../../../helper/toast";
import { formatMoney } from "../../../../../helper/formatMoney";
import { useNavigate } from "react-router-dom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";

const CleaningAC = (props) => {
  const { id, idService, extendService, setErrorNameCustomer } = props;
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState([]);
  const [selectService, setSelectService] = useState([]);
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
  const [tipCollaborator, setTipCollaborator] = useState(0);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    if (id) {
      getAddressCustomerApi(id, 0, 20)
        .then((res) => {
          setDataAddress(res?.data);
        })
        .catch((err) => {});
    } else if (id && idService) {
      getPromotionByCustomerApi(id, 0, 20, idService)
        .then((res) => setPromotionCustomer(res?.data))
        .catch((err) => {});
    }
  }, [id, idService]);

  const handleSearchLocation = useCallback(
    _debounce((value) => {
      setIsLoading(true);
      setAddress(value);
      googlePlaceAutocomplete(value)
        .then((res) => {
          if (res.predictions) {
            setPlaces(res?.predictions);
            setIsLoading(false);
          } else {
            setPlaces(res?.predictions);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setPlaces([]);
          setIsLoading(false);
        });
    }, 1500),
    []
  );

  const findPlace = useCallback((id, description) => {
    setIsLoading(description);
    setIsLoading(true);
    setPlaces([]);
    getPlaceDetailApi(id)
      .then((res) => {
        setLat(res?.result?.geometry?.location?.lat);
        setLong(res?.result?.geometry?.location?.lng);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, []);

  var AES = require("crypto-js/aes");
  const temp = JSON.stringify({
    lat: lat,
    lng: long,
    address: address,
  });
  var accessToken = AES.encrypt(temp, "guvico");

  // const onChangeTimeService = (value) => {
  //   setTime({ count: value?.count, _id: value?._id });
  // };

  const handleMinusCountService = (item) => {
    if (selectService.some((el) => el._id === item._id)) {
      selectService.map((obj) => {
        if (obj._id === item._id) {
          obj.count = obj.count - 1;
        }
        return obj;
      });

      setSelectService((prev) => [...prev]);

      function filterByID(x) {
        if (x.count !== 0) {
          return true;
        }
        return false;
      }
      setSelectService((prev) => prev.filter(filterByID));
    }
  };

  const handleAddCountService = (item) => {
    if (selectService.some((el) => el._id === item._id)) {
      selectService.map((obj) => {
        if (obj._id === item._id && obj.count < 10) {
          obj.count = obj.count + 1;
        }
        return obj;
      });

      setSelectService((prev) => [...prev]);
    } else {
      setSelectService((prev) => [...prev, { _id: item._id, count: 1 }]);
    }
  };

  const onChangeDateWork = (date, dateString) => {
    setDateWork(dateString);
    setErrorDateWork("");
  };

  const onChangeTime = (value) => {
    setTimeWork(value);
    setErrorTimeWork("");
  };
  const timeW = dateWork + "T" + timeWork + ".000Z";

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

  useEffect(() => {
    if (lat && long && address && timeWork && dateWork && selectService) {
      setIsLoading(true);
      getCalculateFeeApi({
        token: accessToken.toString(),
        type: "loop",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: [timeW],
        extend_optional: selectService,
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
        extend_optional: selectService,
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
            message: err,
          });
        });
    }

    if (lat && long && address && timeWork && dateWork && selectService && id) {
      setIsLoading(true);
      checkEventCodePromotionOrderApi(id, {
        token: accessToken.toString(),
        type: "loop",
        type_address_work: "house",
        note_address: "",
        note: note,
        is_auto_order: false,
        date_work_schedule: [timeW],
        extend_optional: selectService,
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
    address,
    selectService,
    id,
    paymentMethod,
  ]);

  const checkPromotion = useCallback(
    (item) => {
      setIsLoading(true);
      if (item?.code === codePromotion) {
        setCodePromotion("");
        setItemPromotion([]);
        setDiscount(0);
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
          extend_optional: selectService,
          code_promotion: item?.code,
          payment_method: paymentMethod,
        })
          .then((res) => {
            setCodePromotion(item?.code);
            setItemPromotion(item);
            setDiscount(res?.discount);
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
    [id, note, selectService, paymentMethod, timeW, accessToken]
  );

  const onCreateOrder = useCallback(() => {
    setIsLoading(true);
    if (
      (lat && long && address && timeWork && dateWork && selectService && id) ||
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
        extend_optional: selectService,
        code_promotion: codePromotion,
        payment_method: paymentMethod,
        id_collaborator: idCollaborator,
        tip_collaborator: tipCollaborator,
        time_zone: "Asia/Ho_Chi_Minh",
      })
        .then((res) => {
          navigate("/group-order/manage-order");
          window.location.reload();
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    } else if (!id) {
      setErrorNameCustomer("Vui lòng chọn khách hàng");
      setIsLoading(false);
    } else if (!address && !lat && !long) {
      setErrorAddress("Vui lòng nhập đầy đủ địa chỉ");
      setIsLoading(false);
    } else if (time.length === 0) {
      setErrorTime("Vui lòng chọn dịch vụ");
      setIsLoading(false);
    } else if (!dateWork) {
      setErrorDateWork("Vui lòng chọn ngày làm");
      setIsLoading(false);
    } else if (!timeWork) {
      setErrorTimeWork("Vui lòng chọn giờ làm");
      setIsLoading(false);
    } else if (!idCollaborator) {
      setErrorCollaborator("Vui lòng chọn CTV");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [
    id,
    lat,
    long,
    address,
    timeWork,
    dateWork,
    mutipleSelected,
    selectService,
    codePromotion,
    isAutoOrder,
    note,
    idCollaborator,
    paymentMethod,
    tipCollaborator,
  ]);

  return (
    <div>
      <div className="div-search-address">
        <a className="label-input">Địa điểm</a>
        <Input
          placeholder="Tìm kiếm địa chỉ"
          className="input-search-address"
          prefix={<i class="uil uil-search"></i>}
          value={address}
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
                <a
                  key={index}
                  onClick={(e) => {
                    findPlace(item?.place_id, item?.description);
                  }}
                  className="item-option-place"
                >
                  {item?.description}
                </a>
              </div>
            );
          })}
        </div>
      )}

      {address === "" && (
        <>
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
        </>
      )}

      <div className="div-add-service-ac mt-3">
        <a className="label-time">
          {`${i18n.t("Loại dịch vụ", { lng: lang })}`}{" "}
          <a style={{ color: "red", fontSize: 12 }}>(*)</a>
        </a>
        <div className="div-service-ac">
          {extendService.map((item, index) => {
            const selectServiceFilter = selectService.filter(
              (x) => item._id === x._id
            );

            return (
              <div className="div-item-service-ac" key={index}>
                <a className="text-title-ac">{item?.title[lang]}</a>
                <div className="div-count-service-ac">
                  <i
                    className="uil uil-minus-square-full"
                    style={{ fontSize: 18 }}
                    onClick={() => handleMinusCountService(item)}
                  ></i>

                  <a>
                    {selectServiceFilter[0]?.count
                      ? selectServiceFilter[0]?.count
                      : 0}
                  </a>
                  <div
                    onClick={() => handleAddCountService(item)}
                    className={
                      selectServiceFilter[0]?.count === 10
                        ? "div-icon-plus-disable"
                        : ""
                    }
                  >
                    <i
                      className="uil uil-plus-square"
                      style={{ fontSize: 18 }}
                    ></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-picker mt-2">
        <a className="label">
          {`${i18n.t("date_work", { lng: lang })}`}{" "}
          <a style={{ color: "red", fontSize: 14 }}>(*)</a>
        </a>
        <DatePicker
          format={dateFormat}
          onChange={onChangeDateWork}
          className="select-time"
        />
      </div>

      <div className="form-picker-hours">
        <a className="label-hours">
          {`${i18n.t("time_work", { lng: lang })}`} (*)
        </a>
        <div className="div-hours">
          {DATA_TIME_TOTAL.map((item) => {
            return (
              <Button
                style={{ width: "auto" }}
                className={
                  timeWork === item.time ? "select-time" : "select-time-default"
                }
                onClick={() => onChangeTime(item.time)}
              >
                {item.title}
              </Button>
            );
          })}
        </div>
        {/* <a className="text-error">{errorTimeWork}</a> */}
      </div>

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
        textArea={true}
      />
      <div className="div-money">
        <a className="label-tip">
          (*) {`${i18n.t("tip_collaborator", { lng: lang })}`}
        </a>
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
            {`${i18n.t("provisional", { lng: lang })}`}:{" "}
            {formatMoney(priceOrder)}
          </a>
          <a>
            {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
            {formatMoney(feeService)}
          </a>
          {tipCollaborator > 0 && (
            <a>
              {`${i18n.t("tips", { lng: lang })}`}:{" "}
              {formatMoney(tipCollaborator)}
            </a>
          )}
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
                priceOrder +
                  feeService -
                  discount -
                  eventFeePromotion +
                  tipCollaborator
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
    </div>
  );
};

export default CleaningAC;
