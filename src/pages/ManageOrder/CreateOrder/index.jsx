import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getService } from "../../../redux/selectors/service";
import {
  getExtendOptionalByOptionalServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../api/service";
import {
  createAddressForCustomer,
  getFavoriteAndBlockByCustomers,
  searchCustomersApi,
} from "../../../api/customer";
import {
  getAddressCustomerApi,
  createOrderApi,
  checkEventCodePromotionOrderApi,
  checkCodePromotionOrderApi,
  getServiceFeeOrderApi,
} from "../../../api/order";
import {
  googlePlaceAutocomplete,
  getPlaceDetailApi,
} from "../../../api/location";
import {
  getCalculateFeeApi,
  getPromotionByCustomerApi,
} from "../../../api/service";
import { fetchCollaborators } from "../../../api/collaborator";
import {
  Button,
  DatePicker,
  Dropdown,
  FloatButton,
  Input,
  Select,
  Space,
  Pagination,
  Switch,
} from "antd";
import { PAYMENT_METHOD } from "../../../@core/constant/service.constant.js";
import _debounce from "lodash/debounce";
import ServiceComponent from "../components/ServiceComponent";
import "./index.scss";
import DateWorkComponent from "../components/DateWorkComponent";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../../helper/formatMoney";
import LoadingPagination from "../../../components/paginationLoading";
import ItemCollaborator from "../../../components/collaborator/itemCollaborator/index.jsx";
import {
  COLLABORATOR_BLOCK,
  COLLABORATOR_FAVORITE,
} from "../../../constants/index.js";
var AES = require("crypto-js/aes");
const { TextArea } = Input;

const CreateOrder = () => {
  const navigate = useNavigate();
  const service = useSelector(getService);
  const [selectService, setSelectService] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [listCustomer, setListCustomer] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [listAddressDefault, setListAddressDefault] = useState([]);
  const [listAddress, setListAddress] = useState([]);
  const [addressEncode, setAddressEncode] = useState(null);
  const [listExtend, setListExtend] = useState([]);
  const [payloadOrder, setPayloadOrder] = useState(null);
  const [dateWorkSchedule, setDateWorkSchedule] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD[0].value);
  const [collaborator, setCollaborator] = useState(null);
  const [listCollaborator, setListCollaborator] = useState([]);
  const [listShowCodePromotion, setListShowCodePromotion] = useState([]);
  const [selectCodePromotion, setSelectCodePromotion] = useState(null);
  const [resultCodePromotion, setResultCodePromotion] = useState(null);
  const [discountCodePromotion, setDiscountCodePromotion] = useState(null);
  const [listEventPromotion, setListEventPromotion] = useState([]);
  const [initialFee, setInitialFee] = useState(0);
  const [finalFee, setFinalFee] = useState(0);
  const [serviceFee, setServiceFee] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collaboratorFavourite, setCollaboratorFavourite] = useState([]);
  const [collaboratorBlock, setCollaboratorBlock] = useState([]);
  const [collaboratorRecently, setCollaboratorRecently] = useState([]);
  const [total, setTotal] = useState({
    totalFavourite: 0,
    totalRecently: 0,
    totalBlock: 0,
  });
  const [isShowCollaborator, setIsShowCollaborator] = useState(false);
  const [tempValueCollaborator, setTempValueCollaborator] = useState("");
  const [isChoicePaymentMethod, setIsChoicePaymentMethod] = useState(true);
  const [newAddress, setNewAddress] = useState(null);
  useEffect(() => {
    if (service.length > 0) {
      setSelectService(service[1]._id);
    }
  }, [service]);

  useEffect(() => {
    if (selectService !== null) {
      getDataOptionalService();
    }
    if (selectService) {
      const findService = service.filter((a) => a._id === selectService);
      if (findService.length > 0 && findService[0].type === "schedule") {
        setIsChoicePaymentMethod(false);
        setPaymentMethod(PAYMENT_METHOD[1].value);
      } else {
        setPaymentMethod(PAYMENT_METHOD[0].value);
        setIsChoicePaymentMethod(true);
      }
    }
  }, [selectService]);

  useEffect(() => {
    if (customer !== null) {
      getDataListAddressDefault();
      getCollaboratorByCustomer();
      setIsShowCollaborator(true);
    }
  }, [customer]);
  useEffect(() => {
    if (
      serviceData !== null &&
      addressEncode !== null &&
      listExtend.length > 0 &&
      customer !== null &&
      paymentMethod !== null
    ) {
      let tempPayload = {};
      tempPayload["type"] = serviceData.type;
      tempPayload["is_auto_order"] = serviceData.is_auto_order;
      tempPayload["token"] = addressEncode.toString();
      tempPayload["extend_optional"] = listExtend;
      tempPayload["id_customer"] = customer;
      tempPayload["date_work_schedule"] = dateWorkSchedule;
      tempPayload["payment_method"] = paymentMethod || PAYMENT_METHOD[0].value;
      if (selectCodePromotion !== null)
        tempPayload["code_promotion"] =
          selectCodePromotion.code.toString() || "";
      if (collaborator !== null) tempPayload["id_collaborator"] = collaborator;
      tempPayload["type_address_work"] = "house";
      tempPayload["note"] = note;

      // if (is)
      setPayloadOrder(tempPayload);
    }
  }, [
    addressEncode,
    listExtend,
    customer,
    dateWorkSchedule,
    paymentMethod,
    selectCodePromotion,
    collaborator,
    serviceData,
    note
  ]);

  useEffect(() => {
    if (
      serviceData !== null &&
      customer !== null &&
      dateWorkSchedule.length > 0 &&
      addressEncode !== null
    ) {
      calculateFeeGroupOrder(payloadOrder);
      getDataCodePromotionAvaiable();
      getCheckEventPromotion();
      if (payloadOrder.code_promotion) checkCodePromotion();
    }
  }, [payloadOrder]);

  useEffect(() => {
    let finalFee = initialFee;
    if (serviceFee.length > 0) {
      for (const item of serviceFee) {
        finalFee += item.fee;
      }
    }

    if (listEventPromotion.length > 0) {
      for (const item of listEventPromotion) {
        finalFee -= item.discount;
      }
    }

    if (resultCodePromotion !== null) {
      finalFee -= resultCodePromotion.discount;
    }
    setFinalFee(finalFee);
  }, [listEventPromotion, resultCodePromotion, initialFee]);
  const getDataOptionalService = async () => {
    const res = await getOptionalServiceByServiceApi(selectService);
    const findService = service.filter((a) => a._id === selectService);
    let payloadService = findService[0];
    payloadService["optional_service"] = [];
    for (let i = 0; i < res.data.length; i++) {
      const resExtend = await getDataExtendOptional(res.data[i]._id);
      payloadService.optional_service.push(res.data[i]);
      resExtend.data.forEach(function (element) {
        element["selected"] =
          element.status_default && element.status_default === true
            ? true
            : false;
        element["count"] = 1;
      });
      payloadService.optional_service[i]["extend_optional"] = resExtend.data;
    }
    setServiceData(payloadService);
    setInitialFee(0);
    setFinalFee(0);
    setServiceFee([]);
    setListShowCodePromotion([]);
    setResultCodePromotion(null);
    setSelectCodePromotion(null);
    setListEventPromotion([]);
    setListExtend([]);
  };

  const getDataCodePromotionAvaiable = async () => {
    const res = await getPromotionByCustomerApi(
      customer,
      0,
      50,
      serviceData._id
    );
    setListShowCodePromotion(res.data);
  };

  const checkCodePromotion = async () => {
    const res = await checkCodePromotionOrderApi(customer, payloadOrder);
    setResultCodePromotion(res);
  };

  const getCheckEventPromotion = async () => {
    const res = await checkEventCodePromotionOrderApi(customer, payloadOrder);
    setListEventPromotion(res.event_promotion);
  };

  const getDataExtendOptional = async (idOptional) => {
    const res = await getExtendOptionalByOptionalServiceApi(idOptional);
    return res;
  };

  const getDataListCustomer = async (search) => {
    const res = await searchCustomersApi(search);
    setListCustomer(res.data);
  };

  const getDataListCollaborator = async (search) => {
    const res = await fetchCollaborators("vi", 0, 50, "online", search, "");
    setListCollaborator(res.data);
  };

  const getDataListAddressDefault = async () => {
    const res = await getAddressCustomerApi(customer, 0, 50);
    setListAddress(res.data);
    setListAddressDefault(res.data);
  };
  const handleSearchAddress = useCallback(
    _debounce(async (newValue) => {
      const dataRes = [];
      if (newValue.trim() !== "") {
        const res = await googlePlaceAutocomplete(newValue);
        for (const item of res.predictions) {
          dataRes.push({
            place_id: item.place_id,
            _id: item.place_id,
            address: item.description,
          });
        }
        setListAddress(dataRes);
      } else {
        setListAddress(listAddressDefault);
      }
    }, 1000),
    []
  );

  const handleChangeAddress = async (newValue) => {
    if (listAddress[0].place_id) {
      const res = await getPlaceDetailApi(newValue);
      const temp = JSON.stringify({
        lat: res.result.geometry.location.lat,
        lng: res.result.geometry.location.lng,
        address: res.result.formatted_address,
      });
      const accessToken = AES.encrypt(temp, "guvico");
      setAddressEncode(accessToken);
      setNewAddress(accessToken);
    } else {
      const address = listAddress.filter((item) => item._id === newValue)[0];
      if (address) {
        const tempAddres = JSON.stringify({
          lat: address.lat,
          lng: address.lng,
          address: address.address,
        });
        const accessToken = AES.encrypt(tempAddres, "guvico");
        setAddressEncode(accessToken);
        setNewAddress(null);
      }
    }
  };
  const handleSearchCustomer = useCallback(
    _debounce((newValue) => {
      getDataListCustomer(newValue);
    }, 500),
    []
  );

  const handleSearchCollaborator = useCallback(
    _debounce((newValue) => {
      getDataListCollaborator(newValue);
    }, 500),
    []
  );

  const handleChangeCustomer = (newValue) => {
    setCustomer(newValue);
  };

  const handleChangeService = (newValue) => {
    setSelectService(newValue);
  };

  const handleChangePaymentMethod = (newValue) => {
    setPaymentMethod(newValue);
  };

  const handleChangeCollaborator = (newValue) => {
    setCollaborator(newValue);
  };

  const onFocusSelectCollaborator = () => {
    isShowCollaborator && setIsShowCollaborator(false);
  };
  const handleFocusAddress = () => {
    setListAddress(listAddressDefault);
  };
  const changeService = (tempService) => {
    const temp = [];
    for (let i = 0; i < tempService.optional_service.length; i++) {
      for (
        let y = 0;
        y < tempService.optional_service[i].extend_optional.length;
        y++
      ) {
        if (
          tempService.optional_service[i].extend_optional[y].selected === true
        ) {
          temp.push({
            count: tempService.optional_service[i].extend_optional[y].count,
            _id: tempService.optional_service[i].extend_optional[y]._id,
          });
        }
      }
    }
    setListExtend(temp);
  };

  const calculateFeeGroupOrder = async (payload) => {
    const res = await getCalculateFeeApi(payload);
    const resServiceFee = await getServiceFeeOrderApi(payload);
    setInitialFee(res.initial_fee);
    setServiceFee(resServiceFee.service_fee);
  };

  const createOrder = () => {
    setIsLoading(true);
    createOrderApi(payloadOrder)
      .then((res) => {
        setIsLoading(false);
        navigate("/group-order/manage-order");
      })
      .catch();
  };

  const getCollaboratorByCustomer = () => {
    getFavoriteAndBlockByCustomers(customer, COLLABORATOR_FAVORITE)
      .then((res) => {
        setTotal((prev) => {
          prev.totalFavourite = prev.totalFavourite || res?.totalItem;
          return prev;
        });
        setCollaboratorFavourite(res?.data);
      })
      .catch((err) => {
        console.log("res  ", err);
      });
    getFavoriteAndBlockByCustomers(customer, COLLABORATOR_BLOCK)
      .then((res) => {
        setTotal((prev) => {
          prev.totalBlock = prev.totalBlock || res?.totalItem;
          return prev;
        });
        setCollaboratorBlock(res?.data);
      })
      .catch((err) => {
        console.log("res  ", err);
      });
  };
  const chooseCollaborator = (collaborator) => {
    setListCollaborator([collaborator]);
    setCollaborator(collaborator._id);
    setTempValueCollaborator(
      `${collaborator.id_view} - ${collaborator.full_name} - ${collaborator.phone}`
    );
  };
  const onAddAddressCustomer = () => {
    const data = {
      token: addressEncode.toString(),
      type_address_work: "house",
      note_address: "",
      address: "",
    };
    createAddressForCustomer(customer, data)
      .then((res) => {
        setNewAddress(false);
        console.log("res ", res);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const handleOnclearCollaborator = () => {
    tempValueCollaborator !== "" && setTempValueCollaborator("");
  };
  return (
    <React.Fragment>
      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">Tạo đơn</h4>
          </div>
          <div className="btn-action-header"></div>
        </div>

        <div className="div-flex-row">
          <div className="content-create-order">
            <div className="div-flex-column">
              <p>Khách hàng</p>
              <Select
                showSearch
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={handleSearchCustomer}
                onChange={handleChangeCustomer}
                options={listCustomer.map((d) => ({
                  value: d._id,
                  label: `${d.id_view} - ${d.full_name} - ${d.phone}`,
                }))}
                placeholder={"Nhập tên hoặc SĐT khách hàng"}
              />
            </div>

            <div className="div-flex-column">
              <p>Địa chỉ</p>
              <Select
                showSearch
                style={{ width: "100%" }}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={handleSearchAddress}
                onChange={handleChangeAddress}
                onFocus={handleFocusAddress}
                options={listAddress.map((d) => ({
                  value: d._id,
                  label: `${d.address}`,
                }))}
                placeholder={"Nhấn vào để chọn địa chỉ hoặc nhập địa chỉ mới"}
              />
              {customer && newAddress && (
                <Button onClick={onAddAddressCustomer}>
                  Thêm địa chỉ mới cho KH
                </Button>
              )}
            </div>

            <div className="div-flex-column">
              <p>Dịch vụ</p>
              <Select
                onChange={handleChangeService}
                value={selectService}
                options={service.map((d) => ({
                  value: d._id,
                  label: `${d.title.vi}`,
                }))}
              />
            </div>

            <div className="div-flex-column">
              <ServiceComponent
                serviceData={serviceData}
                changeService={(value) => {
                  changeService(value);
                }}
              ></ServiceComponent>

              <DateWorkComponent
                serviceData={serviceData}
                changeTimeSchedule={setDateWorkSchedule}
                setPaymentMethod={setPaymentMethod}
                setIsChoicePaymentMethod={setIsChoicePaymentMethod}
              />
              {/* -------------------- Phương thức thanh toán (nếu đơn hàng cố định thì không hiển thị mà mặc định là 'point') -------------------- */}
              <div className="div-flex-column">
                <p>Phương thức thanh toán</p>
                <Select
                  onChange={handleChangePaymentMethod}
                  value={paymentMethod}
                  options={PAYMENT_METHOD}
                  disabled={!isChoicePaymentMethod}
                />
              </div>
              {/* -------------------- Phương thức thanh toán -------------------- */}
              {/* -------------------- Chọn Cộng Tác Viên ------------------------ */}
              <div className="div-select-collaborator">
                <p>Cộng tác viên</p>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  defaultActiveFirstOption={false}
                  suffixIcon={null}
                  filterOption={false}
                  value={
                    tempValueCollaborator !== ""
                      ? tempValueCollaborator
                      : undefined
                  }
                  onSearch={handleSearchCollaborator}
                  onChange={handleChangeCollaborator}
                  onFocus={onFocusSelectCollaborator}
                  onClear={handleOnclearCollaborator}
                  allowClear={() => <div>xoa</div>}
                  options={listCollaborator.map((d) => ({
                    value: d._id,
                    label: `${d.id_view} - ${d.full_name} - ${d.phone}`,
                  }))}
                  placeholder={"Nhập tên hoặc SĐT CTV"}
                />
              </div>
              <div className="div-list-collaborator_toggle-switch">
                <p>Danh sách CTV yêu thích/hạn chế</p>
                <Switch
                  disabled={!customer}
                  checked={isShowCollaborator}
                  onChange={() => setIsShowCollaborator(!isShowCollaborator)}
                />
              </div>

              {isShowCollaborator && (
                <div className="container-collaborator-by-customer">
                  <div>
                    <p>CTV yêu thích</p>
                    {collaboratorFavourite.map((item, index) => {
                      return (
                        <ItemCollaborator
                          onClick={() => chooseCollaborator(item)}
                          key={index}
                          data={item}
                        />
                      );
                    })}
                  </div>
                  <div>
                    <p>CTV hạn chế</p>
                    {collaboratorBlock.map((item, index) => {
                      return (
                        <ItemCollaborator
                          onClick={() => chooseCollaborator(item)}
                          key={index}
                          data={item}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* -------------------- Chọn Cộng Tác Viên ------------------------ */}

            <div className="div-note-collaborator">
              <p>Ghi chú cho CTV</p>
              <TextArea
                allowClear
                rows={4}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                }}
                placeholder="Nhập ghi chú cho CTV (nếu có)"
              />
            </div>

            <div className="list-code-promotion-available">
              {listShowCodePromotion.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    selectCodePromotion !== null &&
                    item._id === selectCodePromotion._id
                      ? "item-selected"
                      : ""
                  } item`}
                  onClick={() => {
                    setSelectCodePromotion(item);
                  }}
                >
                  <p className="title">{item.code}</p>
                  <p className="short-description">{item.title.vi}</p>
                </div>
              ))}
            </div>

            <div className="div-flex-column fee-order">
              <div className="div-flex-row initial-fee">
                <p>Tạm tính:</p>
                <p>{formatMoney(initialFee)}</p>
              </div>

              {serviceFee.map((item, index) => (
                <div key={index} className="div-flex-row service-fee">
                  <p>{item.title.vi}:</p>
                  <p>{formatMoney(item.fee)}</p>
                </div>
              ))}

              {listEventPromotion.map((item, index) => (
                <div key={index} className="div-flex-row event-promotion">
                  <p>{item.title.vi}:</p>
                  <p>-{formatMoney(item.discount)}</p>
                </div>
              ))}

              {resultCodePromotion !== null ? (
                <>
                  <div className="div-flex-row event-promotion">
                    <p>{resultCodePromotion.title.vi}:</p>
                    <p>-{formatMoney(resultCodePromotion.discount || 0)}</p>
                  </div>
                </>
              ) : (
                <></>
              )}
              <hr />
              <div className="div-flex-row final-fee">
                <p>Giá:</p>
                <p>{formatMoney(finalFee)}</p>
              </div>
            </div>
          </div>

          <div className=""></div>
        </div>

        <div className="div-flex-row">
          <Button
            onClick={() => {
              createOrder();
            }}
          >
            Đăng việc
          </Button>
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </React.Fragment>
  );
};

export default CreateOrder;
