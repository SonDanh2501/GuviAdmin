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
  InputNumber,
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
import ModalCustom from "../../../components/modalCustom/index.jsx";
import InfoBill from "../components/OrderComponents/InfoBill.jsx";
import DetailBill from "../components/OrderComponents/DetailBill.jsx";
import { errorNotify, successNotify } from "../../../helper/toast.js";
var AES = require("crypto-js/aes");
const { TextArea } = Input;

const CreateOrder = () => {
  const navigate = useNavigate();
  const service = useSelector(getService);
  const [selectService, setSelectService] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [listCustomer, setListCustomer] = useState([]);
  const [customer, setCustomer] = useState();
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
  const [listEventPromotion, setListEventPromotion] = useState([]);
  const [initialFee, setInitialFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [finalFee, setFinalFee] = useState(0);
  const [tipCollaborator, setTipCollaborator] = useState(0);
  const [netIncomeCollaborator, setNetIncomeCollaborator] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collaboratorFavourite, setCollaboratorFavourite] = useState([]);
  const [collaboratorBlock, setCollaboratorBlock] = useState([]);
  const [total, setTotal] = useState({
    totalFavourite: 0,
    totalRecently: 0,
    totalBlock: 0,
  });
  const [isShowCollaborator, setIsShowCollaborator] = useState(false);
  const [tempValueCollaborator, setTempValueCollaborator] = useState("");
  const [isChoicePaymentMethod, setIsChoicePaymentMethod] = useState(true);
  const [newAddress, setNewAddress] = useState(null);
  const [modal, setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tempValueAddress, setTempValueAddress] = useState("");
  const [isShowAddressDefault, setIsShowAddressDefault] = useState(true);
  const [isShowTipCollaborator, setIsShowTipCollaborator] = useState(false);
  const [infoBill, setInfoBill] = useState();
  const [isShowAddressSearch, setIsShowAddressSearch] = useState(true);
  useEffect(() => {
    if (service.length > 0) {
      setSelectService(service[1]._id);
    }
    OnResetFees();
    OnResetPromotion();
  }, [service]);
  const OnResetFees = () => {
    setInitialFee(0);
    setFinalFee(0);
    setInitialFee(0);
    setInfoBill(null);
    setTotalFee(0);
    setTotalDiscount(0);
    setPlatformFee(0);
    setNetIncomeCollaborator(0);
  };
  const OnResetPromotion = () => {
    setSelectCodePromotion(null);
    setResultCodePromotion(null);
    setListEventPromotion([]);
  };
  useEffect(() => {
    if (selectService !== null) {
      getDataOptionalService();
    }
    if (selectService) {
      const findService = service.filter((a) => a._id === selectService);
      if (findService.length > 0 && findService[0].type === "schedule") {
        setIsChoicePaymentMethod(false);
        setPaymentMethod(PAYMENT_METHOD[1].value);
        setIsShowTipCollaborator(false);
        setTipCollaborator(0);
      } else {
        setPaymentMethod(PAYMENT_METHOD[0].value);
        setIsChoicePaymentMethod(true);
        setIsShowTipCollaborator(true);
      }
    }
    OnResetFees();
    OnResetPromotion();
  }, [selectService]);

  useEffect(() => {
    if (customer !== null && customer !== "") {
      getDataListAddressDefault();
      getCollaboratorByCustomer();
      setIsShowCollaborator(true);
      setIsShowAddressDefault(true);
    }
  }, [customer]);
  useEffect(() => {
    listAddressDefault.map((item) => {
      if (item.is_default_address) {
        handleChangeAddress();
      }
    });
  }, [listAddressDefault]);

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
        tempPayload["code_promotion"] = selectCodePromotion.toString() || "";
      if (collaborator !== null) tempPayload["id_collaborator"] = collaborator;
      tempPayload["type_address_work"] = "house";
      tempPayload["note"] = note;
      tempPayload["tip_collaborator"] = tipCollaborator;
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
    note,
    tipCollaborator,
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
      // getCheckEventPromotion();
      // if (payloadOrder.code_promotion) {
      //   checkCodePromotion();
      // } else {
      //   setResultCodePromotion(null);
      // }
    }
  }, [payloadOrder]);

  useEffect(() => {
    let _total_discount = 0;
    listEventPromotion?.map((item) => {
      _total_discount += item?.discount;
    });
    _total_discount += resultCodePromotion?.discount | 0;
    setTotalDiscount(_total_discount);
  }, [listEventPromotion, resultCodePromotion, infoBill]);

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
    setListShowCodePromotion([]);
    OnResetPromotion();
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

  // const checkCodePromotion = async () => {
  //   const res = await checkCodePromotionOrderApi(customer, payloadOrder);
  //   setResultCodePromotion(res);
  // };

  // const getCheckEventPromotion = async () => {
  //   const res = await checkEventCodePromotionOrderApi(customer, payloadOrder);
  //   setListEventPromotion(res.event_promotion);
  // };

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
    setListAddressDefault(res.data);
  };
  const handleSearchAddress = useCallback(
    _debounce(async (newValue) => {
      const dataRes = [];
      setIsShowAddressSearch(true);
      if (newValue.trim() !== "") {
        const res = await googlePlaceAutocomplete(newValue);
        setIsShowAddressDefault(false);
        for (const item of res.predictions) {
          dataRes.push({
            place_id: item.place_id,
            _id: item.place_id,
            address: item.description,
          });
        }
        setListAddress(dataRes);
      }
    }, 1000),
    []
  );

  const handleChangeAddress = async (newValue) => {
    if (newValue?.place_id) {
      const res = await getPlaceDetailApi(newValue.place_id);
      const temp = JSON.stringify({
        lat: res.result.geometry.location.lat,
        lng: res.result.geometry.location.lng,
        address: res.result.formatted_address,
      });
      const accessToken = AES.encrypt(temp, "guvico");
      setAddressEncode(accessToken);
      setNewAddress(accessToken);
      setTempValueAddress(res.result.formatted_address);
      setIsShowAddressSearch(false); //
      setIsShowAddressDefault(false);
    } else {
      const address = listAddressDefault.filter(
        (item) => item._id === newValue
      )[0];
      if (address) {
        const tempAddres = JSON.stringify({
          lat: address.lat,
          lng: address.lng,
          address: address.address,
        });
        const accessToken = AES.encrypt(tempAddres, "guvico");
        setAddressEncode(accessToken);
        setNewAddress(null);
        setTempValueAddress(address.address);
        setIsShowAddressSearch(false);
        setIsShowAddressDefault(false);
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

  const calculateFeeGroupOrder = (payload) => {
    getCalculateFeeApi(payload)
      .then((res) => {
        // console.log("ress caculate ", res);
        setListEventPromotion(res?.event_promotion);
        setResultCodePromotion(res?.code_promotion);
        setTotalFee(res?.total_fee);
        setInitialFee(res?.initial_fee);
        setFinalFee(res?.final_fee);
        setTipCollaborator(res?.tip_collaborator);
        setInfoBill({
          info: res,
          date_work_schedule: res?.date_work_schedule,
        });
        // ------------------------- tính giá trị service fee--------------------------------------- //
        let _service_fee = 0;
        res?.service_fee?.map((item) => {
          _service_fee += item?.fee;
        });
        setServiceFee(_service_fee);
      })
      .catch((err) => {
        console.log("err ", err);
        if (err?.field === "code_promotion") {
          setSelectCodePromotion(null);
        }
        errorNotify({
          message: err?.message,
        });
      });
  };

  const createOrder = () => {
    setIsLoading(true);
    createOrderApi(payloadOrder)
      .then((res) => {
        setIsLoading(false);
        navigate("/group-order/manage-order");
        successNotify({
          message: "Tạo đơn hàng thành công",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
        });
      });
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
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const handleOnclearCollaborator = () => {
    tempValueCollaborator !== "" && setTempValueCollaborator("");
  };
  const onBonusTipCollaborator = (_amount) => {
    if (_amount === tipCollaborator) {
      setTipCollaborator(0);
    } else {
      setTipCollaborator(_amount);
    }
  };
  const handleChoosePromotion = (_code_promotion) => {
    if (selectCodePromotion !== _code_promotion) {
      setSelectCodePromotion(_code_promotion);
    } else {
      setSelectCodePromotion(null);
    }
  };
  const handleChangeAddressDefault = (checked) => {
    setIsShowAddressDefault(checked);
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
              <p className="fw-500">Khách hàng</p>
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
              <p className="fw-500">Địa chỉ</p>
              <TextArea
                placeholder="Nhập địa chỉ"
                autoSize={{
                  minRows: 1,
                  maxRows: 6,
                }}
                onChange={(e) => {
                  handleSearchAddress(e.target.value);
                  setTempValueAddress(e.target.value);
                }}
                value={tempValueAddress}
                style={{ fontSize: 12 }}
              />
              {isShowAddressSearch &&
                listAddress.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="item-address"
                      onClick={() => handleChangeAddress(item)}
                    >
                      <p>{item?.address}</p>
                    </div>
                  );
                })}
              {customer && newAddress && (
                <Button
                  className="button-address"
                  onClick={onAddAddressCustomer}
                >
                  Thêm địa chỉ mới cho KH
                </Button>
              )}
            </div>

            <>
              <div className="div-flex-row">
                <p className="fw-500">Địa chỉ mặc định</p>
                <Switch
                  size="small"
                  value={isShowAddressDefault}
                  onChange={handleChangeAddressDefault}
                  checked={isShowAddressDefault}
                />
              </div>

              {isShowAddressDefault &&
                listAddressDefault.map((item, index) => {
                  return (
                    <div
                      onClick={() => handleChangeAddress(item?._id)}
                      className="item-address"
                      key={index}
                    >
                      <p>{item?.address}</p>
                    </div>
                  );
                })}
            </>

            <div className="div-flex-column">
              <p className="fw-500">Dịch vụ</p>
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
                <p className="fw-500">Phương thức thanh toán</p>
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
                <p className="fw-500">Cộng tác viên</p>
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
                <p className="fw-500">Danh sách CTV yêu thích</p>
                <Switch
                  disabled={!customer}
                  checked={isShowCollaborator}
                  onChange={() => setIsShowCollaborator(!isShowCollaborator)}
                />
              </div>

              {isShowCollaborator && (
                <div className="container-collaborator-by-customer">
                  <div>
                    <p className="fw-500">CTV yêu thích</p>
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
                </div>
              )}
            </div>
            {/* -------------------- Chọn Cộng Tác Viên ------------------------ */}
            {isShowTipCollaborator && (
              <div>
                <h6>Tip cho ctv</h6>
                <InputNumber
                  placeholder="Nhập số tiền tip cho ctv"
                  min={0}
                  max={50000}
                  value={tipCollaborator}
                  defaultValue={0}
                  onChange={onBonusTipCollaborator}
                  formatter={(value) =>
                    `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\đ\s?|(,*)/g, "")}
                  style={{ width: 150, marginBottom: 15 }}
                />
                <div className="create-order_tip">
                  {arrTipCTV.map((item, index) => {
                    return (
                      <div
                        onClick={() => onBonusTipCollaborator(item.amount)}
                        key={index}
                        className={`item-tip-ctv ${
                          tipCollaborator === item.amount &&
                          "item-tip-ctv_selected"
                        } `}
                      >
                        <p>{formatMoney(item.amount | 0)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                    item?.code === selectCodePromotion
                      ? "item-selected"
                      : ""
                  } item`}
                  onClick={() => handleChoosePromotion(item?.code)}
                >
                  <p className="title">{item.code}</p>
                  <p>- {formatMoney(item.discount_max_price | 0)}</p>
                  <p>
                    {item?.discount_unit === "amount"
                      ? "Giảm trực tiếp"
                      : "Phần trăm"}
                  </p>
                </div>
              ))}
            </div>
            <h6>Chi tiết hoá đơn</h6>
            <InfoBill
              data={infoBill}
              titleService={serviceData?.title?.vi}
              title={"Thông tin dịch vụ đã chọn"}
            />
            <br />
            <DetailBill
              code_promotion={resultCodePromotion}
              event_promotion={listEventPromotion}
              tip_collaborator={tipCollaborator}
              service_fee={serviceFee}
              total_fee={totalFee}
              final_fee={finalFee}
              initial_fee={initialFee}
              platform_fee={platformFee}
              net_income_collaborator={netIncomeCollaborator}
              total_date_work={dateWorkSchedule.length}
              payment_method={paymentMethod === "cash" ? "Tiền mặt" : "G-pay"}
            />
          </div>
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
      {/* <ModalCustom
        title={errorMessage}
        isOpen={modal}
        handleCancel={() => setModal(false)}
        handleOk={() => setModal(false)}
        textOk="OK"
      /> */}
    </React.Fragment>
  );
};

export default CreateOrder;

const arrTipCTV = [
  { id: 0, amount: 2000 },
  { id: 1, amount: 5000 },
  { id: 2, amount: 10000 },
  { id: 3, amount: 20000 },
  { id: 4, amount: 50000 },
];
