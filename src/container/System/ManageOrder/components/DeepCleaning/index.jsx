import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { Button, DatePicker, Input, InputNumber, List } from "antd";
import _debounce from "lodash/debounce";
import {
  getPlaceDetailApi,
  googlePlaceAutocomplete,
} from "../../../../../api/location";
import { getPromotionByCustomerApi } from "../../../../../api/service";
import {
  checkCodePromotionOrderApi,
  getAddressCustomerApi,
} from "../../../../../api/order";
import i18n from "../../../../../i18n";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { DATA_TIME_TOTAL } from "../../../../../api/fakeData";
import InputCustom from "../../../../../components/textInputCustom";
import { searchCollaboratorsCreateOrder } from "../../../../../api/collaborator";
import { errorNotify } from "../../../../../helper/toast";
import { formatMoney } from "../../../../../helper/formatMoney";

const DeepCleaning = (props) => {
  const { id, idService, extendService } = props;
  const [state, setState] = useState({
    address: "",
    lat: "",
    long: "",
    isLoading: false,
    places: [],
    promotionCustomer: [],
    dataAddress: [],
    time: [],
    dateWork: "",
    errorDateWork: "",
    timeWork: "",
    errorTimeWork: "",
    paymentMethod: "cash",
    note: "",
    tipCollaborator: 0,
    dataCollaborator: [],
    nameCollaborator: "",
    idCollaborator: "",
    errorCollaborator: "",
    codePromotion: "",
    discount: 0,
    itemPromotion: [],
    priceOrder: 0,
    eventPromotion: [],
    feeService: 0,
  });
  const lang = useSelector(getLanguageState);
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    if (id) {
      getAddressCustomerApi(id, 0, 20)
        .then((res) => {
          setState({ ...state, dataAddress: res?.data });
        })
        .catch((err) => {});
    } else if (id && idService) {
      getPromotionByCustomerApi(id, 0, 20, idService)
        .then((res) => setState({ ...state, promotionCustomer: res?.data }))
        .catch((err) => {});
    }
  }, [id, idService]);

  const handleSearchLocation = useCallback(
    _debounce((value) => {
      setState({ ...state, isLoading: true, address: value });
      googlePlaceAutocomplete(value)
        .then((res) => {
          if (res.predictions) {
            setState({
              ...state,
              places: res?.predictions,
              isLoading: false,
              address: value,
            });
          } else {
            setState({
              ...state,
              places: [],
              isLoading: false,
              address: value,
            });
          }
        })
        .catch((err) => {
          setState({ ...state, places: [], isLoading: false, address: value });
        });
    }, 1500),
    []
  );

  const findPlace = useCallback((id, description) => {
    setState({ ...state, isLoading: true, places: [], address: description });
    getPlaceDetailApi(id)
      .then((res) => {
        setState({
          ...state,
          isLoading: false,
          lat: res?.result?.geometry?.location?.lat,
          long: res?.result?.geometry?.location?.lng,
          address: description,
        });
      })
      .catch((e) => {
        setState({ ...state, isLoading: false, address: description });
      });
  }, []);

  var AES = require("crypto-js/aes");
  const temp = JSON.stringify({
    lat: state?.lat,
    lng: state?.long,
    address: state?.address,
  });
  var accessToken = AES.encrypt(temp, "guvico");

  const onChangeTimeService = (value) => {
    setState({ ...state, time: { count: value?.count, _id: value?._id } });
  };

  const onChangeDateWork = (date, dateString) => {
    setState({ ...state, dateWork: dateString, errorDateWork: "" });
  };

  const onChangeTime = (value) => {
    setState({ ...state, timeWork: value, errorTimeWork: "" });
  };
  const timeW = state?.dateWork + "T" + state?.timeWork + ".000Z";

  const searchCollaborator = useCallback(
    _debounce((value) => {
      if (value) {
        searchCollaboratorsCreateOrder(id, value)
          .then((res) => {
            if (value === "") {
              setState({
                ...state,
                dataCollaborator: [],
                nameCollaborator: value,
              });
            } else {
              setState({
                ...state,
                dataCollaborator: res.data,
                nameCollaborator: value,
              });
            }
          })
          .catch((err) => console.log(err));
      } else if (state.idCollaborator) {
        setState({ ...state, dataCollaborator: [], nameCollaborator: value });
      } else {
        setState({ ...state, dataCollaborator: [], nameCollaborator: value });
      }
      setState({
        ...state,
        dataCollaborator: [],
        nameCollaborator: value,
        idCollaborator: "",
      });
    }, 500),
    [id]
  );

  // useEffect(() => {
  //   if (
  //     lat &&
  //     long &&
  //     address &&
  //     timeWork &&
  //     dateWork &&
  //     mutipleSelected &&
  //     state.time
  //   ) {
  //     setIsLoading(true);
  //     getCalculateFeeApi({
  //       token: accessToken.toString(),
  //       type: "loop",
  //       type_address_work: "house",
  //       note_address: "",
  //       note: note,
  //       is_auto_order: false,
  //       date_work_schedule: [timeW],
  //       extend_optional: mutipleSelected.concat(time),
  //       payment_method: paymentMethod,
  //     })
  //       .then((res) => {
  //         setPriceOrder(res?.initial_fee);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         setIsLoading(false);
  //         errorNotify({
  //           message: err,
  //         });
  //       });

  //     getServiceFeeOrderApi({
  //       token: accessToken.toString(),
  //       type: "loop",
  //       type_address_work: "house",
  //       note_address: "",
  //       note: note,
  //       is_auto_order: false,
  //       date_work_schedule: [timeW],
  //       extend_optional: mutipleSelected.concat(time),
  //       payment_method: paymentMethod,
  //     })
  //       .then((res) => {
  //         const totalEventFee =
  //           res?.service_fee.length > 0
  //             ? res?.service_fee.map((el) => el.fee).reduce((a, b) => a + b)
  //             : 0;
  //         setFeeService(totalEventFee);
  //         setDataFeeService(res?.service_fee);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         setIsLoading(false);
  //         errorNotify({
  //           message: err,
  //         });
  //       });
  //   }

  //   if (
  //     state.lat &&
  //     state.long &&
  //     state.address &&
  //     state.timeWork &&
  //     state.dateWork &&
  //     time &&
  //     id
  //   ) {
  //     setIsLoading(true);
  //     checkEventCodePromotionOrderApi(id, {
  //       token: accessToken.toString(),
  //       type: "loop",
  //       type_address_work: "house",
  //       note_address: "",
  //       note: state.note,
  //       is_auto_order: false,
  //       date_work_schedule: [timeW],
  //       extend_optional: state.time,
  //       payment_method: state.paymentMethod,
  //     })
  //       .then((res) => {
  //         const totalEventFee =
  //           res?.event_promotion.length > 0
  //             ? res?.event_promotion
  //                 .map((el) => el.discount)
  //                 .reduce((a, b) => a + b)
  //             : 0;
  //         setEventFeePromotion(totalEventFee);
  //         setEventPromotion(res?.event_promotion);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         setIsLoading(false);
  //         errorNotify({
  //           message: err,
  //         });
  //       });
  //   }
  // }, [lat, long, timeWork, dateWork, mutipleSelected, time, id, paymentMethod]);

  const checkPromotion = useCallback(
    (item) => {
      setState({ ...state, isLoading: true });
      if (item?.code === state.codePromotion) {
        setState({
          ...state,
          codePromotion: "",
          isLoading: false,
          itemPromotion: [],
          discount: 0,
        });
      } else {
        checkCodePromotionOrderApi(id, {
          id_customer: id,
          token: accessToken.toString(),
          type: "loop",
          type_address_work: "house",
          note_address: "",
          note: state.note,
          is_auto_order: false,
          date_work_schedule: [timeW],
          extend_optional: state.time,
          code_promotion: item?.code,
          payment_method: state.paymentMethod,
        })
          .then((res) => {
            setState({
              ...state,
              codePromotion: item?.code,
              isLoading: false,
              itemPromotion: item,
              discount: res?.discount,
            });
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setState({ ...state, codePromotion: "", isLoading: false });
          });
      }
    },
    [id, state, timeW, accessToken]
  );

  return (
    <div>
      <div className="div-search-address">
        <a className="label-input">Địa điểm</a>
        <Input
          placeholder="Tìm kiếm địa chỉ"
          className="input-search-address"
          prefix={<i class="uil uil-search"></i>}
          value={state?.address}
          onChange={(e) => {
            setState({ ...state, address: e.target.value });
            handleSearchLocation(e.target.value);
          }}
        />
      </div>
      {state?.places.length > 0 && (
        <div className="list-item-place">
          {state?.places?.map((item, index) => {
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

      {state?.address === "" && (
        <>
          {state?.dataAddress.length > 0 && (
            <div className="mt-2">
              <a className="title-list-address">{`${i18n.t("address_default", {
                lng: lang,
              })}`}</a>
              <List type={"unstyled"} className="list-item-address-customer">
                {state?.dataAddress?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        state?.address === item?.address
                          ? "div-item-address-selected"
                          : "div-item-address"
                      }
                      onClick={() => {
                        setState({
                          ...state,
                          address: item?.address,
                          lat: item?.lat,
                          long: item?.lng,
                        });
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

      <div className="div-add-service mt-3">
        <a className="label-time">
          {`${i18n.t("times", { lng: lang })}`}{" "}
          <a style={{ color: "red", fontSize: 12 }}>(*)</a>
        </a>
        <div className="div-service">
          {extendService.map((item) => {
            return (
              <div
                className={
                  item?._id === state?.time?._id
                    ? "select-service"
                    : "select-service-default"
                }
                onClick={() => onChangeTimeService(item)}
              >
                <a
                  className={
                    item?._id === state?.time?._id
                      ? "text-service"
                      : "text-service-default"
                  }
                >
                  {item?.title?.[lang]}
                </a>
                <a
                  className={
                    item?._id === state?.time?._id
                      ? "text-service"
                      : "text-service-default"
                  }
                >
                  {item?.estimate !== 0.5 &&
                    item?.description?.[lang].slice(
                      item?.description?.[lang].indexOf("/") + 1
                    )}
                </a>
                <a
                  className={
                    item?._id === state?.time?._id
                      ? "text-service"
                      : "text-service-default"
                  }
                >
                  {item?.description?.[lang]?.slice(
                    0,
                    item?.description?.[lang]?.indexOf("/")
                  )}
                </a>
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
                  state?.timeWork === item.time
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
        {/* <a className="text-error">{errorTimeWork}</a> */}
      </div>

      <InputCustom
        title={`${i18n.t("payment_method", { lng: lang })}`}
        value={state.paymentMethod}
        onChange={(e) => setState({ ...state, paymentMethod: e })}
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
        onChange={(e) => setState({ ...state, note: e.target.value })}
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
          value={state.tipCollaborator}
          onChange={(e) => setState({ ...state, tipCollaborator: e })}
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
            error={state.errorCollaborator}
            onChange={(e) => {
              searchCollaborator(e.target.value);
              setState({ ...state, nameCollaborator: e.target.value });
            }}
            value={state.nameCollaborator}
            placeholder={`${i18n.t("search", { lng: lang })}`}
          />
        </div>

        {state.dataCollaborator.length > 0 && (
          <List type={"unstyled"} className="list-item-add-ctv-order">
            {state.dataCollaborator?.map((item, index) => {
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
                    setState({
                      ...state,
                      idCollaborator: item?._id,
                      nameCollaborator: item?.full_name,
                      dataCollaborator: [],
                    });
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
        {state?.promotionCustomer.map((item, index) => {
          return (
            <div
              key={index}
              className={
                state.codePromotion === item.code
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
      {state.priceOrder && (
        <div className="div-total mt-3">
          <a>
            {`${i18n.t("provisional", { lng: lang })}`}:{" "}
            {formatMoney(state.priceOrder)}
          </a>
          <a>
            {`${i18n.t("platform_fee", { lng: lang })}`}:{" "}
            {formatMoney(state.feeService)}
          </a>
          {state.tipCollaborator > 0 && (
            <a>
              {`${i18n.t("tips", { lng: lang })}`}:{" "}
              {formatMoney(state.tipCollaborator)}
            </a>
          )}
          {state.eventPromotion.map((item, index) => {
            return (
              <a style={{ color: "red" }}>
                {item?.title?.[lang]}: {"-"}
                {formatMoney(item?.discount)}
              </a>
            );
          })}
          {state.discount > 0 && (
            <div>
              <a style={{ color: "red" }}>
                {state.itemPromotion?.title?.[lang]}:{" "}
              </a>
              <a style={{ color: "red" }}> {formatMoney(-state.discount)}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeepCleaning;
