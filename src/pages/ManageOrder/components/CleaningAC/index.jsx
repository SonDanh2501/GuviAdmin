import { Button, DatePicker, Image, Input, InputNumber, List } from "antd";
import _debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./styles.scss";

const CleaningAC = (props) => {
  const { id, idService, extendService, setErrorNameCustomer } = props;
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [note, setNote] = useState("");
  const [selectService, setSelectService] = useState([]);
  const [dateWork, setDateWork] = useState("");
  const [timeWork, setTimeWork] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [promotionCustomer, setPromotionCustomer] = useState([]);
  const [priceOrder, setPriceOrder] = useState();
  const [discount, setDiscount] = useState(0);
  const [codePromotion, setCodePromotion] = useState("");
  const [eventPromotion, setEventPromotion] = useState([]);
  const [eventFeePromotion, setEventFeePromotion] = useState(0);
  const [feeService, setFeeService] = useState(0);
  const [itemPromotion, setItemPromotion] = useState(0);
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
  };

  const onChangeTime = (value) => {
    setTimeWork(value);
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
    [id, note, selectService, paymentMethod, timeW, accessToken, codePromotion]
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
        is_auto_order: "false",
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
    selectService,
    codePromotion,
    note,
    idCollaborator,
    paymentMethod,
    tipCollaborator,
    timeW,
    accessToken,
    navigate,
    setErrorNameCustomer,
  ]);

  return (
    <div>
      <div className="div-search-address">
        <p className="label-input">Địa điểm</p>
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
                <p
                  key={index}
                  onClick={(e) => {
                    setAddress(item?.description);
                    findPlace(item?.place_id, item?.description);
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
                        <p className="title-details-address">{item?.address}</p>
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
        <p className="label-time">
          {`${i18n.t("Loại dịch vụ", { lng: lang })}`}
        </p>
        <div className="div-service-ac">
          {extendService.map((item, index) => {
            const selectServiceFilter = selectService.filter(
              (x) => item._id === x._id
            );

            return (
              <div className="div-item-service-ac" key={index}>
                <p className="text-title-ac">{item?.title[lang]}</p>
                <div className="div-count-service-ac">
                  <i
                    className="uil uil-minus-square-full"
                    style={{ fontSize: 18 }}
                    onClick={() => handleMinusCountService(item)}
                  ></i>

                  <p className="m-0">
                    {selectServiceFilter[0]?.count
                      ? selectServiceFilter[0]?.count
                      : 0}
                  </p>
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
        <p className="label m-0">{`${i18n.t("date_work", { lng: lang })}`} </p>
        <DatePicker
          format={dateFormat}
          onChange={onChangeDateWork}
          className="select-time"
        />
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
                    <p className="text-name m-0">
                      {item?.full_name} - {item?.phone} - {item?.id_view}
                    </p>
                  </div>
                  {item?.is_favorite ? (
                    <i className="uil uil-heart icon-heart"></i>
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
              <p style={{ color: "red", margin: 0 }}>
                {item?.title?.[lang]}: {"-"}
                {formatMoney(item?.discount)}
              </p>
            );
          })}
          {discount > 0 && (
            <div>
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

      <div className="div-footer mt-5">
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
  );
};

export default CleaningAC;
