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
  message,
  Tooltip,
  Modal,
} from "antd";
import circleLogoImage from "../../../assets/images/Logo.svg";
import logoNoBackGroundImage from "../../../assets/images/logoNoBackGround.svg";

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
import moment from "moment";
import icons from "../../../utils/icons.js";
import InputCustom from "../../../components/textInputCustom/index.jsx";
import InputTextCustom from "../../../components/inputCustom/index.jsx";
import _, { filter } from "lodash";
import { formatArray } from "../../../utils/contant.js";
import ButtonCustom from "../../../components/button/index.jsx";
import { loadingAction } from "../../../redux/actions/loading.js";

var AES = require("crypto-js/aes");
const { TextArea } = Input;

const {
  FaDog,
  IoHeart,
  IoAddCircleOutline,
  IoTime,
  IoCalendar,
  IoHome,
  MdChair,
  IoRestaurant,
  TbAirConditioning,
  IoHelpCircleOutline,
} = icons;

const CreateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const service = useSelector(getService);
  /* ~~~ Value ~~~ */
  const [selectService, setSelectService] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [listExtend, setListExtend] = useState([]);
  const [payloadOrder, setPayloadOrder] = useState(null);
  const [dateWorkSchedule, setDateWorkSchedule] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD[0].value);
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
  const [collaboratorFavourite, setCollaboratorFavourite] = useState([]);
  const [collaboratorBlock, setCollaboratorBlock] = useState([]);
  const [total, setTotal] = useState({
    totalFavourite: 0,
    totalRecently: 0,
    totalBlock: 0,
  });
  const [isChoicePaymentMethod, setIsChoicePaymentMethod] = useState(true);
  const [modal, setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoBill, setInfoBill] = useState();
  // SON Value
  const [collaborator, setCollaborator] = useState(null); // Giá trị thông tin id của đối tác
  const [tempValueCollaborator, setTempValueCollaborator] = useState(""); // Giá trị để hiển thị họ tên - mã đối tác - số điện thoại của đối tác (cần có cái này vì giá trị truyền lên api chỉ là id của đối tác)
  const [selectCustomerValue, setSelectCustomerValue] = useState(""); // Giá trị thông tin khách hàng lựa chọn
  const [selectAddressValueTemp, setSelectAddressValueTemp] = useState(""); // Giá trị thông tin địa chỉ của khách hàng để hiển thị
  const [newAddressValue, setNewAddressValue] = useState(null); // Giá trị thông tin địa chỉ của khách hàng để tạo địa chỉ mặc định
  const [valueAddrressEncode, setValueAddressEncode] = useState(null); // Giá trị thông tin địa chỉ của khách hàng nhưng sau khi encode
  const [valueNoteForCollaborator, setValueNoteForCollaborator] = useState(""); // Giá trị thông tin ghi chú cho đối tác (nếu có)
  const [valueSubtotalFee, setValueSubTotalFee] = useState(""); // Giá trị đơn hàng
  const [valueTax, setValueTax] = useState(""); // Giá trị thuế
  const [valueNetIncome, setValueNetIncome] = useState(""); // Giá trị thu nhập ròng
  /* ~~~ List ~~~ */
  const [listCustomer, setListCustomer] = useState([]); // Giá trị danh sách những khách hàng tìm kiếm
  const [listAddress, setListAddress] = useState([]); // Giá trị danh sách những địa chỉ đã tìm kiếm
  const [listAddressDefault, setListAddressDefault] = useState([]); // Giá trị danh sách những địa chỉ đã lưu của khách hàng
  const listMoneyTipForCollaborator = [
    { id: 0, amount: 2000 },
    { id: 1, amount: 5000 },
    { id: 2, amount: 10000 },
    { id: 3, amount: 20000 },
    { id: 4, amount: 50000 },
  ]; // Một vài giá trị tiền típ nhanh

  /* ~~~ Flag ~~~ */
  const [isShowCollaborator, setIsShowCollaborator] = useState(false); // Hiển thị danh sách những đối tác yêu thích
  const [isShowAddressDefault, setIsShowAddressDefault] = useState(true); // Hiển thị danh sách những địa chỉ mặc định của khách hàng
  const [isShowTipCollaborator, setIsShowTipCollaborator] = useState(false); // Hiển thị tiền tip cho đối tác
  const [isShowAddressSearch, setIsShowAddressSearch] = useState(true); // Hiển thị danh sách những địa chỉ đã tìm kiếm
  const [isDetailBill, setIsDetailBill] = useState(false); // Hiển thị chi tiết hóa đơn
  /* ~~~ Handle function ~~~ */
  // const getDataListCustomer = async (search) => {
  //   const res = await searchCustomersApi(search);
  //   setListCustomer(res.data);
  // };
  // const handleSearchCustomer = useCallback(
  //   _debounce((newValue) => {
  //     getDataListCustomer(newValue);
  //   }, 500),
  //   []
  // );
  // 1. Hàm tìm kiếm khách hàng
  const handleSearchCustomer = useCallback(
    _.debounce(async (value) => {
      if (value.trim() !== "") {
        const res = await searchCustomersApi(value);
        setListCustomer(res?.data);
      } else {
        setListCustomer([]);
      }
    }, 500),
    []
  );
  // 2. Hàm tìm kiếm địa chỉ
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
  // Hàm lấy danh sách địa chỉ mặc định (địa chỉ thường hay đặt của khách hàng)
  const handleGetListAddressDefault = async () => {
    try {
      const res = await getAddressCustomerApi(selectCustomerValue, 0, 50);
      setListAddressDefault(res.data);
    } catch (err) {
      errorNotify({
        message: err,
      });
    }
  };
  // Hàm chọn địa chỉ (lấy place_id: thuộc tính của phần tử trong listAddress khi tìm kiếm để encode ra và lưu lại)
  const handleChangeAddress = async (newValue) => {
    if (newValue?.place_id) {
      const res = await getPlaceDetailApi(newValue.place_id);
      const temp = JSON.stringify({
        lat: res.result.geometry.location.lat,
        lng: res.result.geometry.location.lng,
        address: res.result.formatted_address,
      });
      const accessToken = AES.encrypt(temp, "guvico");
      setValueAddressEncode(accessToken);
      setNewAddressValue(accessToken); // Lưu lại giá trị địa chỉ để nếu cần thêm địa chỉ mặc định cho khách hàng thì lấy giá trị này
      setSelectAddressValueTemp(res.result.formatted_address); // Code cũ
      setIsShowAddressSearch(false); //
      setIsShowAddressDefault(false);
    } else {
      // Trường hợp chọn địa chỉ mặc định sẵn có: tìm kiếm trong listAddressDefault để lọc ra
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
        setValueAddressEncode(accessToken);
        setNewAddressValue(null);
        setSelectAddressValueTemp(address.address);
        setIsShowAddressSearch(false);
        setIsShowAddressDefault(false);
      }
    }
  };
  // Hàm lấy danh sách những đối tác ưu thích của khách hàng
  const handleGetFavoriteCollaboratorByCustomer = async () => {
    try {
      const [responseFavoriteCollaborator, responseBlockCollaborator] =
        await Promise.all([
          getFavoriteAndBlockByCustomers(
            selectCustomerValue,
            COLLABORATOR_FAVORITE
          ),
          getFavoriteAndBlockByCustomers(
            selectCustomerValue,
            COLLABORATOR_BLOCK
          ),
        ]);
      setTotal((prev) => ({
        ...prev,
        totalFavourite:
          prev.totalFavourite || responseFavoriteCollaborator?.totalItem,
        totalBlock: prev.totalBlock || responseBlockCollaborator?.totalItem,
      }));
      setCollaboratorFavourite(responseFavoriteCollaborator?.data);
      setCollaboratorBlock(responseBlockCollaborator?.data);
    } catch (err) {
      errorNotify({
        message: err,
      });
    }
  };
  // Hàm thêm địa chỉ mặc định mới cho khách hàng
  const handleAddNewAddressCustomer = async () => {
    try {
      const data = {
        token: valueAddrressEncode.toString(),
        type_address_work: "house",
        note_address: "",
        address: "",
      };
      const res = await createAddressForCustomer(selectCustomerValue, data);
      setNewAddressValue(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  // Hàm tìm kiếm đối tác
  const handleSearchCollaborator = useCallback(
    _debounce(async (newValue) => {
      try {
        const res = await fetchCollaborators(
          "vi",
          0,
          50,
          "online",
          newValue,
          ""
        );
        setIsShowCollaborator(false);
        setListCollaborator(res?.data);
      } catch (err) {
        errorNotify({ message: err?.message || err });
      }
    }, 500),
    []
  );
  // Hàm tạo đơn
  const handleCreateOrder = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await createOrderApi(payloadOrder);
      dispatch(loadingAction.loadingRequest(false));
      navigate("/group-order/manage-order");
      successNotify({
        message: "Tạo đơn hàng thành công",
      });
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  // Hàm tính toán tiền của đơn hàng
  // const calculateFeeGroupOrder = async (payload) => {
  //   getCalculateFeeApi(payload)
  //     .then((res) => {
  //       // console.log("ress caculate ", res);
  // setListEventPromotion(res?.event_promotion);
  // setResultCodePromotion(res?.code_promotion);
  // setTotalFee(res?.total_fee);
  // setInitialFee(res?.initial_fee);
  // setFinalFee(res?.final_fee);
  // setTipCollaborator(res?.tip_collaborator);
  // setInfoBill({
  //   info: res,
  //   date_work_schedule: res?.date_work_schedule,
  // });
  // setValueSubTotalFee(res?.subtotal_fee);
  // setValueNetIncome(res?.net_income);
  // setValueTax(res?.value_added_tax);
  // // ------------------------- tính giá trị service fee--------------------------------------- //
  // let _service_fee = 0;
  // res?.service_fee?.map((item) => {
  //   _service_fee += item?.fee;
  // });
  // setServiceFee(_service_fee);
  // })
  //     .catch((err) => {
  //       console.log("err ", err);
        // if (err?.field === "code_promotion") {
        //   setSelectCodePromotion(null);
        // }
  //       errorNotify({
  //         message: err?.message,
  //       });
  //     });
  // };
  const calculateFeeGroupOrder = async (payload) => {
    try {
      const res = await getCalculateFeeApi(payload);
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
      setValueSubTotalFee(res?.subtotal_fee);
      setValueNetIncome(res?.net_income);
      setValueTax(res?.value_added_tax);
      let _service_fee = 0;
      res?.service_fee?.map((item) => {
        _service_fee += item?.fee;
      });
      setServiceFee(_service_fee);
    } catch (err) {
      errorMessage({
        message: err?.message || err,
      });
      if (err?.field === "code_promotion") {
        setSelectCodePromotion(null);
      }
    }
  };

  /* ~~~ Use effect ~~~ */
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
  // Fetch những giá trị của khách hàng: địa chỉ đã lưu, đối tác ưu thích
  useEffect(() => {
    if (
      selectCustomerValue !== null &&
      selectCustomerValue !== "" &&
      selectCustomerValue !== undefined
    ) {
      handleGetListAddressDefault();
      setIsShowAddressDefault(true);
      handleGetFavoriteCollaboratorByCustomer();
      setIsShowCollaborator(true);
    }
  }, [selectCustomerValue]);
  // useEffect(() => {
  //   listAddressDefault.map((item) => {
  //     if (item.is_default_address) {
  //       handleChangeAddress(item._id);
  //     }
  //   });
  // }, [listAddressDefault]);
  useEffect(() => {
    if (
      serviceData !== null &&
      valueAddrressEncode !== null &&
      listExtend.length > 0 &&
      selectCustomerValue !== null &&
      paymentMethod !== null
    ) {
      let tempPayload = {};
      tempPayload["type"] = serviceData.type;
      tempPayload["is_auto_order"] = serviceData.is_auto_order;
      tempPayload["token"] = valueAddrressEncode.toString();
      tempPayload["extend_optional"] = listExtend;
      tempPayload["id_customer"] = selectCustomerValue;
      tempPayload["date_work_schedule"] = dateWorkSchedule;
      tempPayload["payment_method"] = paymentMethod || PAYMENT_METHOD[0].value;
      if (selectCodePromotion !== null)
        tempPayload["code_promotion"] = selectCodePromotion.toString() || "";
      if (collaborator !== null) tempPayload["id_collaborator"] = collaborator;
      tempPayload["type_address_work"] = "house";
      tempPayload["note"] = valueNoteForCollaborator;
      tempPayload["tip_collaborator"] = tipCollaborator;
      setPayloadOrder(tempPayload);
    }
  }, [
    valueAddrressEncode,
    listExtend,
    selectCustomerValue,
    dateWorkSchedule,
    paymentMethod,
    selectCodePromotion,
    collaborator,
    serviceData,
    valueNoteForCollaborator,
    tipCollaborator,
  ]);
  useEffect(() => {
    if (
      serviceData !== null &&
      selectCustomerValue !== null &&
      dateWorkSchedule.length > 0 &&
      valueAddrressEncode !== null
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
  useEffect(() => {
    if (selectAddressValueTemp.trim() !== "") {
      if (isShowAddressDefault) {
        const findAddress = listAddressDefault.find(
          (el) => el._id === selectAddressValueTemp
        );
        handleChangeAddress(findAddress._id);
      } else {
        const findAddress = listAddress.find(
          (el) => el.place_id === selectAddressValueTemp
        );
        handleChangeAddress(findAddress);
      }
    }
  }, [selectAddressValueTemp]);
  useEffect(() => {
    if (service.length > 0) {
      setSelectService(service[1]._id);
    }
    OnResetFees();
    OnResetPromotion();
  }, [service]);
  /* ~~~ Other ~~~ */
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
      selectCustomerValue,
      0,
      50,
      serviceData._id
    );
    setListShowCodePromotion(res.data);
  };
  // const checkCodePromotion = async () => {
  //   const res = await checkCodePromotionOrderApi(selectCustomerValue, payloadOrder);
  //   setResultCodePromotion(res);
  // };

  // const getCheckEventPromotion = async () => {
  //   const res = await checkEventCodePromotionOrderApi(selectCustomerValue, payloadOrder);
  //   setListEventPromotion(res.event_promotion);
  // };
  const getDataExtendOptional = async (idOptional) => {
    const res = await getExtendOptionalByOptionalServiceApi(idOptional);
    return res;
  };

  const handleChangeCustomer = (newValue) => {
    setSelectCustomerValue(newValue);
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

  const chooseCollaborator = (collaborator) => {
    setListCollaborator([collaborator]);
    setCollaborator(collaborator._id);
    setTempValueCollaborator(
      `${collaborator.id_view} - ${collaborator.full_name} - ${collaborator.phone}`
    );
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
  // Hàm chọn/hủy chọn mã khuyến mãi
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

  /* ~~~ Main ~~~ */
  return (
    <div className="container-create-order">
      {/* Container bên trái */}
      <div className="container-create-order__info card-shadow">
        <div className="container-create-order__info--container">
          <div className="container-create-order__info--container-child">
            <span className="container-create-order__info--container-child-label">
              Thông tin khách hàng
            </span>
            <InputTextCustom
              type="select"
              value={selectCustomerValue}
              options={
                listCustomer
                  ? formatArray(listCustomer, "_id", [
                      "id_view",
                      "full_name",
                      "phone",
                    ])
                  : []
              }
              placeHolder="Khách hàng"
              searchField={true}
              onChange={handleSearchCustomer}
              setValueSelectedProps={setSelectCustomerValue}
            />
          </div>
          <div className="container-create-order__info--container-child">
            <span className="container-create-order__info--container-child-label">
              Thông tin địa chỉ
            </span>
            <InputTextCustom
              type="select"
              value={selectAddressValueTemp}
              options={
                isShowAddressDefault && listAddressDefault.length > 0
                  ? formatArray(listAddressDefault, "_id", ["address"])
                  : isShowAddressSearch && listAddress.length > 0
                  ? formatArray(listAddress, "place_id", ["address"])
                  : []
              }
              placeHolder="Địa chỉ"
              searchField={true}
              onChange={handleSearchAddress}
              // onChange={(e) => {
              //   handleSearchAddress(e.target.value);
              //   setSelectAddressValueTemp(e.target.value);
              // }}
              setValueSelectedProps={setSelectAddressValueTemp}
              related={listAddressDefault.length > 0 ? true : false}
              contentChild={
                <div className="container-create-order__content-child">
                  <div className="container-create-order__content-child--default-address">
                    <span>Địa chỉ mặc định</span>
                    <Switch
                      size="small"
                      value={isShowAddressDefault}
                      onChange={handleChangeAddressDefault}
                      checked={isShowAddressDefault}
                    />
                  </div>
                  {selectCustomerValue && newAddressValue && (
                    <div
                      onClick={() => handleAddNewAddressCustomer()}
                      className="container-create-order__content-child--add-address"
                    >
                      <div className="container-create-order__content-child--add-address-icon">
                        <IoAddCircleOutline />
                      </div>
                      <span>Thêm địa chỉ mới cho khách hàng</span>
                    </div>
                  )}
                </div>
              }
            />
          </div>
        </div>
        {/* Loại dịch vụ */}
        <div className="container-create-order__info--service">
          <span className="container-create-order__info--service-label">
            Loại dịch vụ
          </span>
          {/* <div className="container-create-order__info--service-container">
            {service.map((el, index) => (
              <div
                onClick={() => setSelectService(el?._id)}
                className={`container-create-order__info--service-container-child ${
                  el?._id === selectService && "selected"
                }`}
              >
                <div className="container-create-order__info--service-container-child-icon">
                  {el?.kind === "giup_viec_co_dinh" ? (
                    <IoCalendar />
                  ) : el?.kind === "giup_viec_theo_gio" ? (
                    <IoTime />
                  ) : el?.kind === "tong_ve_sinh" ? (
                    <IoHome />
                  ) : el?.kind === "phuc_vu_nha_hang" ? (
                    <IoRestaurant />
                  ) : el?.kind === "rem_tham_sofa" ? (
                    <MdChair />
                  ) : (
                    <TbAirConditioning />
                  )}
                </div>
                <span className="container-create-order__info--service-container-child-label">
                  {el?.title?.vi}
                </span>
              </div>
            ))}
          </div> */}
          <InputTextCustom
            type="select"
            value={selectService}
            placeHolder="Dịch vụ"
            options={formatArray(service, "_id", ["title"], ["vi"])}
            setValueSelectedProps={setSelectService}
          />
        </div>
        {/* Thời lượng, dịch vụ, thời lượng, ...*/}
        <ServiceComponent
          serviceData={serviceData}
          changeService={(value) => {
            changeService(value);
          }}
        />
        {/* Chọn ngày làm, lặp lại theo tuần, ... */}
        <DateWorkComponent
          serviceData={serviceData}
          changeTimeSchedule={setDateWorkSchedule}
          setPaymentMethod={setPaymentMethod}
          setIsChoicePaymentMethod={setIsChoicePaymentMethod}
        />
        {/* Container chọn phương thức thanh toán và cộng tấc viên */}
        <div className="container-create-order-flex">
          {/* Phương thức thanh toán */}
          <div className="container-create-order__info--paymemnt-method">
            <span className="container-create-order__info--paymemnt-method-label">
              Chọn phương thức thanh toán
            </span>
            <InputTextCustom
              type="select"
              value={paymentMethod}
              options={formatArray(PAYMENT_METHOD, "value", ["label"])}
              placeHolder="Phương thức thanh toán"
              disabled={!isChoicePaymentMethod}
              setValueSelectedProps={setPaymentMethod}
            />
          </div>
          {/* Chọn công tác viên */}
          <div className="container-create-order__info-select-collaborator">
            <div className="container-create-order__info-select-collaborator--label">
              <span className="container-create-order__info-select-collaborator--label-header">
                Chọn công tác viên
              </span>
              <div className="container-create-order__info-select-collaborator--label-favourite-collaborator">
                <span>{`( Đối tác yêu thích`}</span>
                <Switch
                  size="small"
                  disabled={!selectCustomerValue}
                  checked={isShowCollaborator}
                  onChange={() => setIsShowCollaborator(!isShowCollaborator)}
                />
                <span>{`)`}</span>
              </div>
            </div>
            <InputTextCustom
              type="select"
              value={collaborator}
              options={formatArray(listCollaborator, "_id", [
                "id_view",
                "full_name",
                "phone",
              ])}
              placeHolder="Công tác viên"
              searchField={true}
              onChange={handleSearchCollaborator}
              setValueSelectedProps={setCollaborator}
            />
          </div>
        </div>
        {/* Danh sách đối tác yêu thích */}
        {isShowCollaborator && (
          <div className="container-create-order__info--favorite-collaborator-list">
            {collaboratorFavourite.map((item, index) => {
              return (
                <ItemCollaborator
                  onClick={() => chooseCollaborator(item)}
                  key={index}
                  data={item}
                  selected={collaborator}
                />
              );
            })}
          </div>
        )}
        {/* Tiền típ */}
        <div className="container-create-order__info--tip">
          <div className="container-create-order__info--tip-header">
            <span className="container-create-order__info--tip-header-label">
              Tiền tip cho đối tác
            </span>
            <div className="container-create-order__info--tip-header-suggest">
              {listMoneyTipForCollaborator.map((item, index) => (
                <div
                  onClick={() => onBonusTipCollaborator(item.amount)}
                  key={index}
                  className={`container-create-order__info--tip-header-suggest-child ${
                    tipCollaborator === item.amount && "selected"
                  }`}
                >
                  <span>{formatMoney(item?.amount) || 0}</span>
                </div>
              ))}
            </div>
          </div>
          <InputTextCustom
            type="text"
            value={tipCollaborator}
            placeHolder="Tiền tip"
            isNumber={true}
            onChange={(e) => setTipCollaborator(e.target.value)}
          />
        </div>
        {/* Ghi chú */}
        <div className="container-create-order__info--note">
          <span>Ghi chú cho đối tác</span>
          <InputTextCustom
            type="textArea"
            value={valueNoteForCollaborator}
            placeHolder="Nhập ghi chú cho đối tác (nếu có)"
            onChange={(e) => setValueNoteForCollaborator(e.target.value)}
          />
          {/* <InputTextCustom
              type="textArea"
              value={valuePunishDescribe}
              placeHolder="Nội dung phạt"
              onChange={(e) => setValuePunishDescribe(e.target.value)}
            /> */}
        </div>
        {/* Voucher giảm giá */}
        <div className="container-create-order__info--voucher">
          <span className="container-create-order__info--voucher-label">
            Mã khuyến mãi
          </span>
          <div className="container-create-order__info--voucher-container">
            {listShowCodePromotion.map((item, index) => (
              <div
                key={index}
                className={`container-create-order__info--voucher-container-child ${
                  selectCodePromotion !== null &&
                  item?.code === selectCodePromotion &&
                  "selected"
                }`}
                onClick={() => handleChoosePromotion(item?.code)}
              >
                <span className="container-create-order__info--voucher-container-child-code">
                  {item.code}
                </span>
                <span className="container-create-order__info--voucher-container-child-money">
                  - {formatMoney(item.discount_max_price | 0)}
                </span>
                <span className="container-create-order__info--voucher-container-child-sub-label">
                  {item?.discount_unit === "amount"
                    ? "Giảm trực tiếp"
                    : "Phần trăm"}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Đăng việc */}
        <ButtonCustom
          label="Đăng việc"
          // fullScreen={true}
          onClick={() => handleCreateOrder()}
          disable={
            serviceData !== null &&
            selectCustomerValue !== null &&
            dateWorkSchedule.length > 0 &&
            valueAddrressEncode !== null
              ? false
              : true
          }
        />
      </div>
      {/* Container bên phải */}
      <div className="container-create-order__bill">
        {/* Chi tiết hóa đơn*/}
        <div className="container-create-order__bill--detail card-shadow">
          {/* Header */}
          <div className="container-create-order__bill--detail-header">
            <div className="container-create-order__bill--detail-header-tag">
              <span>Chi tiết hóa đơn</span>
            </div>
            <div className="container-create-order__bill--detail-header-options">
              {/* {listExtend.find(
                (el) => el._id === "63228cc0c091fbf906916376"
              ) && (
                <div className="container-create-order__bill--detail-header-options-note pet">
                  <span className="container-create-order__bill--detail-header-options-note-icon">
                    <FaDog />
                  </span>
                </div>
              )}
              {listExtend.find(
                (el) => el._id === "63228caac091fbf906916373"
              ) && (
                <div className="container-create-order__bill--detail-header-options-note favorite-collaborator ">
                  <span className="container-create-order__bill--detail-header-options-note-icon">
                    <IoHeart />
                  </span>
                </div>
              )} */}
            </div>
          </div>
          <div className="container-create-order__bill--detail-label">
            <span>{serviceData?.title?.vi}</span>
          </div>
          {/* Line */}
          <div className="container-create-order__bill--detail-line">
            <div className="container-create-order__bill--detail-line-circle left"></div>
            <div className="container-create-order__bill--detail-line-dashed"></div>
            <div className="container-create-order__bill--detail-line-circle right"></div>
          </div>
          {/* Content */}
          <div>
            <InfoBill
              data={infoBill}
              // titleService={serviceData?.title?.vi}
              title={"Thông tin dịch vụ đã chọn"}
            />
          </div>
        </div>
        {/* Thông tin bán hàng */}
        <div className="container-create-order__bill--price card-shadow">
          {/* Header */}
          <div className="container-create-order__bill--price-header">
            <div className="container-create-order__bill--price-header-tag">
              <div className="container-create-order__bill--price-header-tag-info">
                <span>Thông tin thanh toán</span>
              </div>
              {/* <div
                onClick={() => setIsDetailBill(!isDetailBill)}
                className="container-create-order__bill--price-header-tag-detail"
              >
                <Tooltip title="Chi tiết hóa đơn" trigger="hover">
                  <span>
                    <IoHelpCircleOutline />
                  </span>
                </Tooltip>
              </div> */}
            </div>
            <div className="container-create-order__bill--price-header-logo">
              <img src={logoNoBackGroundImage}></img>
            </div>
            <div className="container-create-order__bill--price-header-payment-method">
              <span className="container-create-order__bill--price-header-payment-method-option">
                Thanh toán bằng{" "}
                {paymentMethod === "cash" ? "Tiền mặt" : "G-pay"}
              </span>
              <span className="container-create-order__bill--price-header-payment-method-time">
                {moment(new Date()).format("DD MMMM, YYYY, HH:MM")}
              </span>
            </div>
          </div>
          {/* Line */}
          <div className="container-create-order__bill--price-line">
            <div className="container-create-order__bill--price-line-circle left"></div>
            <div className="container-create-order__bill--price-line-dashed"></div>
            <div className="container-create-order__bill--price-line-circle right"></div>
          </div>
          {/* Content */}
          <div>
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
              subtotal_fee={valueSubtotalFee}
              tax={valueTax}
              net_income={valueNetIncome}
              total_date_work={dateWorkSchedule.length}
              // payment_method={paymentMethod === "cash" ? "Tiền mặt" : "G-pay"}
              date_work_schedule={infoBill?.date_work_schedule}
              show_detail={isDetailBill}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
