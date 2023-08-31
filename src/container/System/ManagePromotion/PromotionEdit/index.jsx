import {
  CloseOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  FloatButton,
  Image,
  Input,
  InputNumber,
  List,
  Popover,
  Radio,
  Select,
  Space,
  Switch,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import moment from "moment";
import "moment/locale/vi";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getGroupPromotion } from "../../../../api/configuration";
import { searchCustomersApi } from "../../../../api/customer";
import { DATA_PAYMENT, DATA_TIME_APPLY } from "../../../../api/fakeData";
import {
  activePromotion,
  deletePromotion,
  getGroupCustomerApi,
  getPromotionDetails,
  updatePromotion,
} from "../../../../api/promotion";
import backgroundImage from "../../../../assets/images/backgroundContent.png";
import descriptionImage from "../../../../assets/images/description.png";
import shortDescriptionImage from "../../../../assets/images/shortDescription.png";
import thumnailImage from "../../../../assets/images/thumnailContent.png";
import titleImage from "../../../../assets/images/title.png";
import TextEditor from "../../../../components/TextEditor";
import InputLanguage from "../../../../components/inputLanguage";
import ModalCustom from "../../../../components/modalCustom";
import LoadingPagination from "../../../../components/paginationLoading";
import InputCustom from "../../../../components/textInputCustom";
import UploadImage from "../../../../components/uploadImage";
import { errorNotify, successNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import { getProvince, getService } from "../../../../redux/selectors/service";
import "./styles.scss";
const { Option } = Select;

const EditPromotion = () => {
  const { state } = useLocation();
  const { id } = state;
  const [statePromo, setStatePromo] = useState({
    promoCode: "",
    isParrentPromotion: false,
    totalChildPromotion: 0,
    titleVN: "",
    titleEN: "",
    shortDescriptionVN: "",
    shortDescriptionEN: "",
    descriptionVN: "",
    descriptionEN: "",
    ratioTypeVoucher: 1,
    isCheckVoucher: true,
    isCheckProgram: false,
    serviceApply: [],
    namebrand: "",
    isApllyTime: 1,
    limitedDate: false,
    startDate: "",
    endDate: "",
    ratioTypeDateApply: 1,
    typeDateApply: "date_create",
    isApplyTimeUse: false,
    imgThumbnail: "",
    imgBackground: "",
    discountUnit: "amount",
    maximumDiscount: 0,
    reducedValue: 0,
    isMaximumDiscount: true,
    checkMininum: 1,
    minimumOrder: 0,
    isObjectCustomer: 1,
    isGroupCustomer: false,
    isCustomer: false,
    groupCustomer: [],
    name: "",
    data: [],
    listCustomers: [],
    listNameCustomers: [],
    dataGroupCustomer: [],
    ratioApplyArea: 1,
    isApplyArea: false,
    city: [],
    limitedQuantity: true,
    amount: 0,
    isUsePromo: true,
    usePromo: 0,
    ratioExchangePoint: 1,
    isExchangePoint: false,
    exchangePoint: 0,
    dateExchange: 0,
    isShowInApp: false,
    isSendNotification: false,
    isApplyPushNoti: 1,
    isDateSchedule: false,
    ratioPaymentMethod: 1,
    isPaymentMethod: false,
    paymentMethod: [],
    isCheckEndDate: true,
  });
  const [title, setTitle] = useState({
    vi: "",
  });
  const [shortDescription, setShortDescription] = useState({
    vi: "",
  });
  const [description, setDescription] = useState({
    vi: "",
  });
  const [ratioGroupPromotion, setRatioGroupPromotion] = useState(1);
  const [groupPromotion, setGroupPromotion] = useState([]);
  const [dataGroupPromotion, setDataGroupPromotion] = useState([]);
  const [timeApply, setTimeApply] = useState(DATA_APPLY_TIME);
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const ref1 = useRef(null);
  const options = [];
  const serviceOption = [];
  const cityOption = [];
  const groupPromotionOption = [];
  const dateFormat = "YYYY-MM-DD";
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const lang = useSelector(getLanguageState);
  const checkElement = useSelector(getElementState);
  const navigate = useNavigate();
  const selectAfter = (
    <Select
      disabled={isActive ? true : false}
      value={statePromo?.discountUnit === "amount" ? "VND" : "%"}
      style={{ width: "auto" }}
      onChange={(e) => {
        if (e === "VND") {
          setStatePromo({ ...statePromo, discountUnit: "amount" });
        } else {
          setStatePromo({ ...statePromo, discountUnit: "percent" });
        }
      }}
    >
      <Option value="VND">₫</Option>
      <Option value="%">%</Option>
    </Select>
  );

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res?.data))
      .catch((err) => {});

    getGroupPromotion(0, 100, "")
      .then((res) => {
        setDataGroupPromotion(res?.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    getPromotionDetails(id)
      .then((res) => {
        setStatePromo({
          ...statePromo,
          promoCode: res?.code,
          isParrentPromotion: res?.is_parrent_promotion,
          totalChildPromotion: res?.total_child_promotion,
          titleVN: res?.title?.vi,
          titleEN: res?.title?.en,
          shortDescriptionVN: res?.short_description?.vi,
          shortDescriptionEN: res?.short_description?.en,
          descriptionVN: res?.description?.vi,
          descriptionEN: res?.description?.en,
          ratioTypeVoucher: res?.brand === "guvi" ? 1 : 2,
          isCheckVoucher: res?.type_promotion === "code" ? true : false,
          isCheckProgram: res?.type_promotion === "event" ? true : false,
          serviceApply: res?.service_apply[0],
          namebrand: res?.brand,
          isApllyTime: res?.is_limit_date ? 2 : 1,
          limitedDate: res?.is_limit_date,
          startDate: res?.is_limit_date ? res?.limit_start_date : "",
          endDate: res?.is_limit_date ? res?.limit_end_date : "",
          ratioTypeDateApply: !res?.is_loop
            ? 1
            : res?.is_loop && res?.type_date_apply === "date_create"
            ? 2
            : 3,
          typeDateApply: res?.type_date_apply,
          isApplyTimeUse: res?.is_loop,
          imgThumbnail: res?.thumbnail,
          imgBackground: res?.image_background,
          discountUnit: res?.discount_unit,
          maximumDiscount: res?.discount_max_price,
          reducedValue: res?.discount_value,
          checkMininum: res?.price_min_order > 0 ? 2 : 1,
          minimumOrder: res?.price_min_order,
          isObjectCustomer: res?.is_id_customer
            ? 3
            : res?.is_id_group_customer
            ? 2
            : 1,
          isGroupCustomer: res?.is_id_group_customer,
          isCustomer: res?.is_id_customer,
          groupCustomer: res?.id_group_customer,
          listNameCustomers: res?.id_customer,
          ratioApplyArea: res?.is_apply_area ? 2 : 1,
          isApplyArea: res?.is_apply_area,
          city: res?.city,
          limitedQuantity: res?.is_limit_count,
          amount: res?.limit_count,
          isUsePromo: res?.is_limited_use,
          usePromo: res?.limited_use,
          ratioExchangePoint: res?.is_exchange_point ? 2 : 1,
          isExchangePoint: res?.is_exchange_point,
          exchangePoint: res?.exchange_point,
          dateExchange: res?.exp_date_exchange,
          isShowInApp: res?.is_show_in_app,
          isPaymentMethod: res?.is_payment_method,
          paymentMethod: res?.payment_method,
        });
        res?.id_customer?.map((item) => {
          return statePromo?.listCustomers.push(item?._id);
        });
        setRatioGroupPromotion(res?.id_group_promotion.length > 0 ? 2 : 1);
        setGroupPromotion(res?.id_group_promotion);
        setTimeApply(
          res?.day_loop?.length > 0 ? res?.day_loop : DATA_APPLY_TIME
        );

        setIsActive(res?.is_active);
        delete res?.title["_id"];
        setTitle(res?.title);
        delete res?.short_description["_id"];
        setShortDescription(res?.short_description);
        delete res?.description["_id"];
        setDescription(res?.description);
      })
      .catch((err) => console.log(err));
  }, [id]);

  dataGroupPromotion?.map((item) => {
    return groupPromotionOption?.push({
      value: item?._id,
      label: item?.name[lang],
    });
  });

  dataGroupCustomer.map((item) => {
    return options.push({
      label: item?.name,
      value: item?._id,
    });
  });

  province?.map((item) => {
    return cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  service.map((item) => {
    return serviceOption.push({
      label: item?.title?.[lang],
      value: item?._id,
    });
  });

  const searchCustomer = _debounce((value) => {
    if (value) {
      searchCustomersApi(value)
        .then((res) => {
          if (value === "") {
            setStatePromo({ ...statePromo, data: [], name: value });
          } else {
            setStatePromo({ ...statePromo, data: res.data, name: value });
          }
        })
        .catch((err) => console.log(err));
    } else {
      setStatePromo({ ...statePromo, data: [], name: value });
    }
  }, 500);

  const onChooseCustomer = (item) => {
    const newData = statePromo?.listCustomers.concat(item?._id);
    const newNameData = statePromo?.listNameCustomers.concat({
      _id: item?._id,
      full_name: item?.full_name,
      phone: item?.phone,
      id_view: item?.id_view,
    });
    setStatePromo({
      ...statePromo,
      listCustomers: newData,
      listNameCustomers: newNameData,
      name: "",
      data: [],
    });
  };

  const removeItemCustomer = (item) => {
    const newNameArray = statePromo?.listNameCustomers.filter(
      (i) => i?._id !== item?._id
    );
    const newArray = statePromo?.listCustomers.filter((i) => i !== item?._id);
    setStatePromo({
      ...statePromo,
      listCustomers: newArray,
      listNameCustomers: newNameArray,
    });
  };

  const shortDescriptionPrommo = (
    <div className="div-content-title">
      <p className="m-0">Mã khuyến mãi ở trang thanh toán</p>
      <Image
        preview={false}
        src={shortDescriptionImage}
        className="img-short"
      />
    </div>
  );

  const titlePrommo = (
    <div className="div-content-title">
      <p className="m-0">Mã khuyến mãi ở trang chủ</p>
      <Image preview={false} src={titleImage} className="img-title" />
    </div>
  );

  const desciptionPrommo = (
    <div className="div-content-title">
      <p className="m-0">Chi tiết mã khuyến mãi</p>
      <Image
        preview={false}
        src={descriptionImage}
        className="img-description"
      />
    </div>
  );

  const thumnailPrommo = (
    <div className="div-content-title">
      <p className="m-0">Chi tiết mã khuyến mãi</p>
      <Image preview={false} src={thumnailImage} className="img-description" />
    </div>
  );

  const backgroundPrommo = (
    <div className="div-content-title">
      <p className="m-0">Chi tiết mã khuyến mãi</p>
      <Image
        preview={false}
        src={backgroundImage}
        className="img-description"
      />
    </div>
  );

  const changeCheckApply = (value, index) => {
    const arr = [...timeApply];
    timeApply[index].is_check_loop = value;
    setTimeApply(arr);
  };

  const addTime = (index) => {
    const arr = [...timeApply];
    timeApply[index].time_loop.push({
      start_time_local: "00:00",
      end_time_local: "00:30",
    });
    setTimeApply(arr);
  };

  const deleteTime = (index, indexTime) => {
    timeApply[index].time_loop.splice(indexTime, 1);
    setTimeApply([...timeApply]);
  };

  const changeTimeStartApply = (value, index, indexTime) => {
    const arr = [...timeApply];
    timeApply[index].time_loop[indexTime].start_time_local = value;
    setTimeApply(arr);
  };
  const changeTimeEndApply = (value, index, indexTime) => {
    const arr = [...timeApply];
    timeApply[index].time_loop[indexTime].end_time_local = value;
    setTimeApply(arr);
  };

  const onActive = useCallback((id, is_active) => {
    setIsLoading(true);
    activePromotion(id, { is_active: is_active ? false : true })
      .then((res) => {
        setIsLoading(false);
        setIsActive(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, []);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deletePromotion(id)
        .then((res) => {
          navigate(-1);
          setIsLoading(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    },
    [navigate]
  );

  const onEditPromotion = useCallback(() => {
    setIsLoading(true);
    updatePromotion(id, {
      code: statePromo?.promoCode.toUpperCase(),
      is_parrent_promotion: statePromo?.isParrentPromotion,
      total_child_promotion: statePromo?.totalChildPromotion,
      title: title,
      short_description: shortDescription,
      description: description,
      type_discount:
        statePromo?.ratioTypeVoucher === 2 ? "partner_promotion" : "order",
      service_apply:
        statePromo?.serviceApply?.length > 0 ? [statePromo?.serviceApply] : [],
      brand: statePromo?.namebrand.toUpperCase(),
      is_limit_date: statePromo?.limitedDate,
      limit_start_date: statePromo?.limitedDate ? statePromo?.startDate : null,
      limit_end_date: statePromo?.limitedDate ? statePromo?.endDate : null,
      type_date_apply: statePromo?.typeDateApply,
      is_loop: statePromo?.isApplyTimeUse,
      day_loop: statePromo?.isApplyTimeUse ? timeApply : [],
      thumbnail: statePromo?.imgThumbnail,
      image_background: statePromo?.imgBackground,
      discount_unit: statePromo?.discountUnit,
      discount_max_price: statePromo?.maximumDiscount,
      discount_value: statePromo?.reducedValue,
      price_min_order: statePromo?.minimumOrder,
      is_id_group_customer: statePromo?.isGroupCustomer,
      id_group_customer: statePromo?.isGroupCustomer
        ? statePromo?.groupCustomer
        : [],
      is_id_customer: statePromo?.isCustomer,
      id_customer: statePromo?.isCustomer ? statePromo?.listCustomers : [],
      is_apply_area: statePromo?.isApplyArea,
      city: statePromo?.isApplyArea ? statePromo?.city : [],
      is_limit_count: statePromo?.limitedQuantity,
      is_limited_use: statePromo?.isUsePromo,
      limited_use: statePromo?.isUsePromo ? statePromo?.usePromo : 0,
      is_exchange_point: statePromo?.isExchangePoint,
      exchange_point: statePromo?.isExchangePoint
        ? statePromo?.exchangePoint
        : 0,
      exp_date_exchange: statePromo?.isExchangePoint
        ? statePromo?.dateExchange
        : 0,
      is_show_in_app: statePromo?.isShowInApp,
      is_payment_method: statePromo?.isPaymentMethod,
      payment_method: statePromo?.paymentMethod,
      limit_count: statePromo?.limitedQuantity ? statePromo?.amount : 0,
      type_promotion: statePromo?.isCheckProgram ? "event" : "code",
      is_delete: false,
      position: 0,
      district: [],
      timezone: "Asia/Ho_Chi_Minh",
      id_group_promotion: ratioGroupPromotion === 2 ? groupPromotion : [],
    })
      .then((res) => {
        setIsLoading(false);
        successNotify({
          message: "Chỉnh sửa thành công vui lòng kích hoạt mã để sử dụng",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [
    statePromo,
    timeApply,
    id,
    groupPromotion,
    ratioGroupPromotion,
    title,
    shortDescription,
    description,
  ]);

  return (
    <>
      <div className="div-head-add-promotion">
        <p className="m-0">Chỉnh sửa khuyến mãi</p>
        <div>
          {isActive ? (
            <Button
              className={"btn-stop-activation"}
              onClick={() => onActive(id, isActive)}
              style={{ width: "auto" }}
              ref={ref1}
            >
              Dừng kích hoạt
            </Button>
          ) : (
            <Button
              className={"btn-activation"}
              onClick={() => onActive(id, isActive)}
              style={{ width: "auto" }}
            >
              Kích hoạt
            </Button>
          )}

          {!isActive && checkElement?.includes("edit_promotion") && (
            <Button
              type="primary"
              onClick={onEditPromotion}
              style={{ width: "auto", marginLeft: 10 }}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
      <div className="div-container-create">
        <div className="div-body">
          <div className="div-input">
            <div className="div-parrent-promo">
              <div className="div-code-promo">
                <p className="label-promo">Mã khuyến mãi</p>
                <div>
                  <Input
                    placeholder={`${i18n.t("Nhập mã khuyến mãi", {
                      lng: lang,
                    })}`}
                    type="text"
                    value={statePromo?.promoCode.toUpperCase()}
                    onChange={(e) =>
                      setStatePromo({
                        ...statePromo,
                        promoCode: e.target.value,
                      })
                    }
                    style={{ marginTop: 5, width: "100%", height: 30 }}
                    disabled={isActive ? true : false}
                  />
                </div>
              </div>

              <div className="div-child-promo">
                <Checkbox
                  checked={statePromo?.isParrentPromotion}
                  onChange={(e) =>
                    setStatePromo({
                      ...statePromo,
                      isParrentPromotion: e.target.checked,
                    })
                  }
                  disabled={isActive ? true : false}
                >
                  Tạo nhiều mã tự động
                </Checkbox>
                {statePromo?.isParrentPromotion && (
                  <InputNumber
                    min={0}
                    value={statePromo?.totalChildPromotion}
                    onChange={(e) =>
                      setStatePromo({
                        ...statePromo,
                        totalChildPromotion: Number.parseInt(e),
                      })
                    }
                    style={{ width: "100%", marginTop: 2, height: 30 }}
                    disabled={isActive ? true : false}
                  />
                )}
              </div>
            </div>
            <p className="text-note">
              Khách hàng sẽ nhập hoặc chọn mã này lúc thanh toán
            </p>
          </div>
          <div className="div-input">
            <p className="title-input">Loại khuyến mãi</p>
            <Radio.Group
              value={statePromo?.ratioTypeVoucher}
              onChange={(e) =>
                setStatePromo({
                  ...statePromo,
                  ratioTypeVoucher: e.target.value,
                })
              }
              style={{
                marginTop: 10,
              }}
              disabled={isActive ? true : false}
            >
              <Space>
                <Radio value={1}>GUVI</Radio>
                <Radio value={2} style={{ marginLeft: 120 }}>
                  Đối tác
                </Radio>
              </Space>
            </Radio.Group>
            {statePromo?.ratioTypeVoucher === 1 && (
              <div className="div-voucher">
                <Checkbox
                  checked={statePromo?.isCheckVoucher}
                  onChange={(e) => {
                    setStatePromo({
                      ...statePromo,
                      isCheckVoucher: e.target.checked,
                      isCheckProgram: false,
                    });
                  }}
                  disabled={isActive ? true : false}
                >
                  Voucher
                </Checkbox>
                <Checkbox
                  checked={statePromo?.isCheckProgram}
                  onChange={(e) => {
                    setStatePromo({
                      ...statePromo,
                      isCheckVoucher: false,
                      isCheckProgram: e.target.checked,
                    });
                  }}
                  style={{ margin: 0, marginTop: 10 }}
                  disabled={isActive ? true : false}
                >
                  Chương trình khuyến mãi
                </Checkbox>
                <Select
                  onChange={(e) => {
                    setStatePromo({ ...statePromo, serviceApply: e });
                  }}
                  options={serviceOption}
                  allowClear={true}
                  placeholder="Chọn dịch vụ áp dụng"
                  style={{ marginTop: 10 }}
                  value={statePromo?.serviceApply}
                  disabled={isActive ? true : false}
                />
              </div>
            )}
            {statePromo?.ratioTypeVoucher === 2 && (
              <div className="ml-3">
                <InputCustom
                  title="Tên đối tác"
                  value={statePromo?.namebrand?.toUpperCase()}
                  onChange={(e) =>
                    setStatePromo({ ...statePromo, namebrand: e.target.value })
                  }
                  placeholder="Nhập tên đối tác"
                />
              </div>
            )}
          </div>
          <div className="div-input">
            <p className="title-input">Nhóm khuyến mãi</p>
            <Radio.Group
              value={ratioGroupPromotion}
              onChange={(e) => setRatioGroupPromotion(e.target.value)}
              style={{
                marginTop: 10,
              }}
              disabled={isActive ? true : false}
            >
              <Space direction="vertical">
                <Radio value={1}>Không áp dụng</Radio>
                <Radio value={2}>Khuyến mãi theo nhóm</Radio>
              </Space>
            </Radio.Group>
            {ratioGroupPromotion === 2 && (
              <Select
                style={{ marginTop: 10 }}
                mode="multiple"
                options={groupPromotionOption}
                onChange={(e) => setGroupPromotion(e)}
                value={groupPromotion}
              />
            )}
          </div>
          <div className="div-input">
            <div className="div-head-title">
              <p className="title-input">Tiêu đề </p>
              <Popover content={titlePrommo} trigger="click" placement="right">
                <QuestionCircleOutlined className="icon-question" />
              </Popover>
            </div>
            <InputLanguage
              state={title}
              setState={setTitle}
              className="input-language"
              disabled={isActive ? true : false}
            />
          </div>
          {statePromo?.isCheckVoucher && (
            <div className="div-input">
              <div className="div-head-title">
                <p className="title-input">
                  {`${i18n.t("describe", { lng: lang })}`}
                </p>

                <Popover
                  content={shortDescriptionPrommo}
                  trigger="click"
                  placement="right"
                >
                  <QuestionCircleOutlined className="icon-question" />
                </Popover>
              </div>
              <InputLanguage
                state={shortDescription}
                setState={setShortDescription}
                className="input-language"
                textArea={true}
                disabled={isActive ? true : false}
              />
            </div>
          )}
          {statePromo?.isCheckVoucher && (
            <div className="div-input">
              <div className="div-head-title">
                <p className="title-input">
                  {`${i18n.t("detailed_description", { lng: lang })}`}
                </p>
                <Popover
                  content={desciptionPrommo}
                  trigger="click"
                  placement="right"
                >
                  <QuestionCircleOutlined className="icon-question" />
                </Popover>
              </div>
              <div className="div-list-input-title">
                {Object.entries(description).map(([key, value]) => {
                  return (
                    <div key={key} className="div-item-list-input">
                      <div>
                        <p className="m-0">{`Tiếng ${
                          key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                        }`}</p>
                        <TextEditor
                          onChange={(e) =>
                            setDescription({
                              ...description,
                              [key]: e,
                            })
                          }
                          height={250}
                          value={value}
                          disabled={isActive ? true : false}
                        />
                      </div>
                      {key !== "vi" && (
                        <i
                          className="uil uil-times-circle"
                          onClick={() => {
                            delete description[key];
                            setDescription({ ...description });
                          }}
                        ></i>
                      )}
                    </div>
                  );
                })}
              </div>
              <Select
                size="small"
                style={{ width: "30%", marginTop: 10 }}
                options={language_muti}
                placeholder="Thêm ngôn ngữ"
                onChange={(e) => {
                  const language = (description[e] = "");
                  setDescription({ ...description, language });
                  delete description[language];
                  setDescription({ ...description });
                }}
              />
            </div>
          )}

          {(statePromo?.serviceApply?.length > 0 ||
            statePromo?.ratioTypeVoucher === 2) && (
            <>
              <div className="div-input">
                <p className="title-input">Thời gian hiệu lực</p>
                <Radio.Group
                  value={statePromo?.isApllyTime}
                  style={{ marginTop: 10 }}
                  onChange={(e) => {
                    setStatePromo({
                      ...statePromo,
                      isApllyTime: e.target.value,
                    });
                    if (e.target.value === 1) {
                      setStatePromo({
                        ...statePromo,
                        limitedDate: false,
                        isApllyTime: e.target.value,
                      });
                    } else {
                      setStatePromo({
                        ...statePromo,
                        limitedDate: true,
                        isApllyTime: e.target.value,
                      });
                    }
                  }}
                  disabled={isActive ? true : false}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Không giới hạn</Radio>
                    <Radio value={2}>Thời gian áp dụng</Radio>
                  </Space>
                </Radio.Group>
                {statePromo?.isApllyTime === 2 && (
                  <>
                    <div className="div-time-select">
                      <div className="div-time">
                        <p className="m-0">{`${i18n.t("start_date", {
                          lng: lang,
                        })}`}</p>
                        <DatePicker
                          onChange={(date, dateString) => {
                            setStatePromo({
                              ...statePromo,
                              startDate: moment(date?.$d)
                                .startOf("date")
                                .add(7, "hours")
                                .toISOString(),
                            });
                          }}
                          style={{ width: "90%", marginTop: 3 }}
                          locale={locale}
                          format={dateFormat}
                          value={
                            statePromo?.startDate
                              ? dayjs(
                                  statePromo?.startDate?.slice(0, 11),
                                  dateFormat
                                )
                              : ""
                          }
                          disabled={isActive ? true : false}
                        />
                      </div>
                      <div className="div-time">
                        <Checkbox
                          checked={statePromo?.isCheckEndDate}
                          onChange={(e) => {}}
                        >
                          Có thời gian kết thúc
                        </Checkbox>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setStatePromo({
                              ...statePromo,
                              endDate: moment(date?.$d)
                                .endOf("date")
                                .add(7, "hours")
                                .toISOString(),
                            })
                          }
                          style={{ width: "90%", marginTop: 2 }}
                          locale={locale}
                          format={dateFormat}
                          value={
                            statePromo?.endDate
                              ? dayjs(
                                  statePromo?.endDate?.slice(0, 11),
                                  dateFormat
                                )
                              : ""
                          }
                          disabled={isActive ? true : false}
                        />
                      </div>
                    </div>
                    <p className="title-input mt-2">
                      Thời gian áp dụng trong tuần
                    </p>

                    <Radio.Group
                      value={statePromo?.ratioTypeDateApply}
                      style={{ marginTop: 10, width: "100%" }}
                      onChange={(e) => {
                        if (e.target.value === 1) {
                          setStatePromo({
                            ...statePromo,
                            ratioTypeDateApply: e.target.value,
                            isApplyTimeUse: false,
                          });
                        } else if (e.target.value === 2) {
                          setStatePromo({
                            ...statePromo,
                            typeDateApply: "date_create",
                            isApplyTimeUse: true,
                            ratioTypeDateApply: e.target.value,
                          });
                        } else {
                          setStatePromo({
                            ...statePromo,
                            typeDateApply: "date_work",
                            isApplyTimeUse: true,
                            ratioTypeDateApply: e.target.value,
                          });
                        }
                      }}
                      disabled={isActive ? true : false}
                    >
                      <Space direction="vertical">
                        <Radio value={1}>Tất cả các ngày</Radio>
                        <Radio value={2}>Theo ngày tạo đơn</Radio>
                        <Radio value={3} disabled>
                          Theo ngày làm
                        </Radio>
                      </Space>
                    </Radio.Group>
                    {statePromo?.isApplyTimeUse && (
                      <div className="div-list-time-apply">
                        {timeApply?.map((item, index) => {
                          return (
                            <div key={index} className="div-item-time-apply">
                              <div className="div-item-right">
                                <Checkbox
                                  checked={item?.is_check_loop}
                                  onChange={(e) =>
                                    changeCheckApply(e.target.checked, index)
                                  }
                                  className="checkbox-date"
                                  disabled={isActive ? true : false}
                                >
                                  {item?.day_local === 1
                                    ? "Thứ Hai"
                                    : item?.day_local === 2
                                    ? "Thứ Ba"
                                    : item?.day_local === 3
                                    ? "Thứ Tư"
                                    : item?.day_local === 4
                                    ? "Thứ Năm"
                                    : item?.day_local === 5
                                    ? "Thứ Sáu"
                                    : item?.day_local === 6
                                    ? "Thứ Bảy"
                                    : "Chủ Nhật"}
                                </Checkbox>
                                {(!item?.is_check_loop ||
                                  (item?.time_loop?.length === 0 &&
                                    item.is_check_loop)) && (
                                  <p
                                    className={
                                      item?.is_check_loop
                                        ? "text-all"
                                        : "text-all-italic"
                                    }
                                  >
                                    Cả ngày
                                  </p>
                                )}

                                {item?.is_check_loop && (
                                  <div className="div-list-time">
                                    {item?.time_loop?.map((i, indexTime) => {
                                      return (
                                        <div
                                          key={indexTime}
                                          className="div-item-time"
                                        >
                                          <div className="div-select-time">
                                            <div className="div-row">
                                              <Select
                                                options={DATA_TIME_APPLY}
                                                style={{ width: 100 }}
                                                size="small"
                                                value={i?.start_time_local}
                                                onChange={(e) =>
                                                  changeTimeStartApply(
                                                    e,
                                                    index,
                                                    indexTime
                                                  )
                                                }
                                                disabled={
                                                  isActive ? true : false
                                                }
                                              />
                                              <p className="minus">-</p>

                                              <Select
                                                options={DATA_TIME_APPLY}
                                                style={{ width: 100 }}
                                                size="small"
                                                value={i?.end_time_local}
                                                onChange={(e) =>
                                                  changeTimeEndApply(
                                                    e,
                                                    index,
                                                    indexTime
                                                  )
                                                }
                                                disabled={
                                                  isActive ? true : false
                                                }
                                              />
                                              <CloseOutlined
                                                className="icon-remove"
                                                onClick={() =>
                                                  deleteTime(index, indexTime)
                                                }
                                                disabled={
                                                  isActive ? true : false
                                                }
                                              />
                                            </div>
                                            <p className="text-from-time">
                                              (
                                              {`từ ${i?.start_time_local.slice(
                                                0,
                                                5
                                              )} đến trước ${i?.end_time_local.slice(
                                                0,
                                                5
                                              )}`}
                                              )
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              {item?.is_check_loop && (
                                <>
                                  {item?.time_loop?.length > 0 ? (
                                    <PlusCircleFilled
                                      className="icon-add-time"
                                      onClick={() => addTime(index)}
                                      disabled={isActive ? true : false}
                                    />
                                  ) : (
                                    <Button
                                      className="choose-time"
                                      onClick={() => addTime(index)}
                                      disabled={isActive ? true : false}
                                    >
                                      Chọn giờ
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!statePromo?.isCheckProgram && (
                <div className="div-background-thumnail">
                  <p className="title-input">Hình ảnh khuyến mãi</p>
                  <div>
                    <UploadImage
                      title={"Ảnh khuyến mãi 160px * 170px"}
                      icon={
                        <Popover
                          content={thumnailPrommo}
                          trigger="click"
                          placement="right"
                        >
                          <QuestionCircleOutlined className="icon-question" />
                        </Popover>
                      }
                      image={statePromo?.imgThumbnail}
                      setImage={(prev) =>
                        setStatePromo({ ...statePromo, imgThumbnail: prev })
                      }
                      classImg="img-thumbnail-promotion"
                      classUpload="upload-thumbnail-promotion"
                      disabled={isActive ? true : false}
                    />

                    <UploadImage
                      title={"Ảnh bìa 414px * 200px"}
                      icon={
                        <Popover
                          content={backgroundPrommo}
                          trigger="click"
                          placement="right"
                        >
                          <QuestionCircleOutlined className="icon-question" />
                        </Popover>
                      }
                      image={statePromo?.imgBackground}
                      setImage={(prev) =>
                        setStatePromo({ ...statePromo, imgBackground: prev })
                      }
                      classImg="img-background-promotion"
                      classUpload="upload-background-promotion"
                      disabled={isActive ? true : false}
                    />
                  </div>
                </div>
              )}
              {statePromo?.ratioTypeVoucher === 1 && (
                <div className="div-input">
                  <p className="title-input">
                    {`${i18n.t("Giảm giá đơn hàng", { lng: lang })}`}
                  </p>
                  <div className="div-reduced-order">
                    <div className="div-body-reduced">
                      <p className="m-0">{`${i18n.t("Mức giảm", {
                        lng: lang,
                      })}`}</p>
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                        }
                        min={0}
                        max={statePromo?.discountUnit === "percent" && 100}
                        value={
                          statePromo?.discountUnit === "amount"
                            ? statePromo?.maximumDiscount
                            : statePromo?.reducedValue
                        }
                        onChange={(e) => {
                          if (statePromo?.discountUnit === "amount") {
                            setStatePromo({
                              ...statePromo,
                              maximumDiscount: e,
                            });
                          } else {
                            setStatePromo({ ...statePromo, reducedValue: e });
                          }
                        }}
                        style={{ width: "100%", marginTop: 5 }}
                        addonAfter={selectAfter}
                        disabled={isActive ? true : false}
                      />
                    </div>
                    {statePromo?.discountUnit === "percent" && (
                      <div className="div-body-reduced">
                        {/* <a>{`${i18n.t("discount_max", { lng: lang })}`}</a> */}
                        <Checkbox
                          checked={statePromo?.isMaximumDiscount}
                          onChange={(e) =>
                            setStatePromo({
                              ...statePromo,
                              isMaximumDiscount: e.target.checked,
                            })
                          }
                          disabled
                        >
                          Giới hạn số tiền giảm tối đa
                        </Checkbox>
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(
                              /(\d)(?=(\d\d\d)+(?!\d))/g,
                              "$1,"
                            )
                          }
                          min={0}
                          value={statePromo?.maximumDiscount}
                          onChange={(e) =>
                            setStatePromo({ ...statePromo, maximumDiscount: e })
                          }
                          addonAfter="đ"
                          style={{ width: "100%", marginTop: 4 }}
                          disabled={isActive ? true : false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {statePromo?.ratioTypeVoucher === 1 && (
                <div className="div-input">
                  <p className="title-input">
                    {`${i18n.t("Điều kiện tối thiểu", { lng: lang })}`}
                  </p>
                  <Radio.Group
                    style={{ marginTop: 10 }}
                    value={statePromo?.checkMininum}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setStatePromo({
                        ...statePromo,
                        checkMininum: e.target.value,
                      });
                      if (e.target.value === 1) {
                        setStatePromo({
                          ...statePromo,
                          minimumOrder: 0,
                          checkMininum: e.target.value,
                        });
                      } else {
                        setStatePromo({
                          ...statePromo,
                          checkMininum: e.target.value,
                          minimumOrder: 0,
                        });
                      }
                    }}
                    disabled={isActive ? true : false}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>Không yêu cầu</Radio>
                      <Radio value={2}>Giá trị đơn tối thiểu</Radio>
                    </Space>
                  </Radio.Group>
                  {statePromo?.checkMininum === 2 && (
                    <div className="div-minimum-order">
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                        }
                        min={0}
                        value={statePromo?.minimumOrder}
                        onChange={(e) =>
                          setStatePromo({ ...statePromo, minimumOrder: e })
                        }
                        addonAfter="đ"
                        style={{ width: "100%", marginTop: 4 }}
                        disabled={isActive ? true : false}
                      />
                      <p className="text-note">Áp dụng cho tất cả đơn hàng</p>
                    </div>
                  )}
                </div>
              )}
              <div className="div-input">
                <p className="title-input">
                  {`${i18n.t("Đối tượng khách hàng", { lng: lang })}`}
                </p>
                <Radio.Group
                  value={statePromo?.isObjectCustomer}
                  onChange={(e) => {
                    if (e.target.value === 2) {
                      setStatePromo({
                        ...statePromo,
                        isGroupCustomer: true,
                        isCustomer: false,
                        isObjectCustomer: e.target.value,
                      });
                    } else if (e.target.value === 3) {
                      setStatePromo({
                        ...statePromo,
                        isCustomer: true,
                        isGroupCustomer: false,
                        isObjectCustomer: e.target.value,
                      });
                    } else {
                      setStatePromo({
                        ...statePromo,
                        isObjectCustomer: e.target.value,
                        isCustomer: false,
                        isGroupCustomer: false,
                      });
                    }
                  }}
                  style={{ marginTop: 10 }}
                  disabled={isActive ? true : false}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Không giới hạn khách hàng</Radio>
                    <Radio value={2}>Nhóm khách hàng</Radio>
                    <Radio value={3}>Tuỳ chọn khách hàng</Radio>
                  </Space>
                </Radio.Group>
                <div>
                  {statePromo?.isObjectCustomer === 2 && (
                    <Select
                      mode="multiple"
                      allowClear
                      style={{
                        width: "100%",
                        marginTop: 10,
                      }}
                      placeholder="Please select"
                      onChange={(value) => {
                        setStatePromo({ ...statePromo, groupCustomer: value });
                      }}
                      value={statePromo?.groupCustomer}
                      options={options}
                      disabled={isActive ? true : false}
                    />
                  )}
                </div>
                <div>
                  {statePromo?.isObjectCustomer === 3 && (
                    <div>
                      <Input
                        placeholder={`${i18n.t("search", { lng: lang })}`}
                        value={statePromo?.name}
                        onChange={(e) => {
                          setStatePromo({
                            ...statePromo,
                            name: e.target.value,
                          });
                          searchCustomer(e.target.value);
                        }}
                        style={{ marginTop: 10 }}
                        disabled={isActive ? true : false}
                      />
                      {statePromo?.data?.length > 0 && (
                        <List className="list-item-kh">
                          {statePromo?.data?.map((item, index) => {
                            return (
                              <div
                                className="div-item"
                                key={index}
                                onClick={() => onChooseCustomer(item)}
                              >
                                <p className="text-name">
                                  {item?.full_name} - {item?.phone} -{" "}
                                  {item?.id_view}
                                </p>
                              </div>
                            );
                          })}
                        </List>
                      )}

                      {statePromo?.listNameCustomers?.length > 0 && (
                        <div className="div-list-customer">
                          <List type={"unstyled"}>
                            {statePromo?.listNameCustomers.map((item) => {
                              return (
                                <div className="div-item-customer">
                                  <p className="text-name-list">
                                    - {item?.full_name} . {item?.phone} .{" "}
                                    {item?.id_view}
                                  </p>
                                  <CloseOutlined
                                    className="icon-delete"
                                    size={70}
                                    onClick={() => removeItemCustomer(item)}
                                    disabled={isActive ? true : false}
                                  />
                                </div>
                              );
                            })}
                          </List>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="div-input">
                <p className="title-input">
                  {`${i18n.t("Khu vực áp dụng", { lng: lang })}`}
                </p>
                <Radio.Group
                  style={{ marginTop: 10 }}
                  value={statePromo?.ratioApplyArea}
                  onChange={(e) => {
                    if (e.target.value === 1) {
                      setStatePromo({
                        ...statePromo,
                        isApplyArea: false,
                        ratioApplyArea: e.target.value,
                      });
                    } else {
                      setStatePromo({
                        ...statePromo,
                        isApplyArea: true,
                        ratioApplyArea: e.target.value,
                      });
                    }
                  }}
                  disabled={isActive ? true : false}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Toàn quốc</Radio>
                    <Radio value={2}>Tuỳ chọn tỉnh/thành phố</Radio>
                  </Space>
                </Radio.Group>

                {statePromo?.ratioApplyArea === 2 && (
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", marginTop: 10 }}
                    onChange={(e) => {
                      setStatePromo({ ...statePromo, city: e });
                    }}
                    options={cityOption}
                    optionLabelProp="label"
                    value={statePromo?.city}
                    disabled={isActive ? true : false}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  />
                )}
              </div>
              <div className="div-input">
                <p className="title-input">Giới hạn sử dụng</p>
                <div className="div-column-limit">
                  <Checkbox
                    checked={statePromo?.limitedQuantity}
                    onChange={(e) =>
                      setStatePromo({
                        ...statePromo,
                        limitedQuantity: e.target.checked,
                      })
                    }
                    disabled={isActive ? true : false}
                  >
                    Giới hạn tổng số có thể sử dụng khuyến mãi
                  </Checkbox>
                  {statePromo?.limitedQuantity && (
                    <InputNumber
                      min={0}
                      value={statePromo?.amount}
                      onChange={(e) =>
                        setStatePromo({ ...statePromo, amount: e })
                      }
                      className="input-price"
                      disabled={isActive ? true : false}
                    />
                  )}
                </div>
                <div className="div-column-limit">
                  <Checkbox
                    checked={statePromo?.isUsePromo}
                    onChange={(e) =>
                      setStatePromo({
                        ...statePromo,
                        isUsePromo: e.target.checked,
                      })
                    }
                    disabled={isActive ? true : false}
                  >
                    Giới hạn số lần sử dụng cho mỗi khách hàng
                  </Checkbox>
                  {statePromo?.isUsePromo && (
                    <InputNumber
                      min={0}
                      value={statePromo?.usePromo}
                      onChange={(e) =>
                        setStatePromo({ ...statePromo, usePromo: e })
                      }
                      className="input-price"
                      disabled={isActive ? true : false}
                    />
                  )}
                </div>
              </div>
              {!statePromo?.isCheckProgram && (
                <div className="div-input">
                  <p className="title-input">Điểm G-point quy đổi</p>
                  <Radio.Group
                    value={statePromo?.ratioExchangePoint}
                    style={{ marginTop: 10 }}
                    onChange={(e) => {
                      if (e.target.value === 1) {
                        setStatePromo({
                          ...statePromo,
                          isExchangePoint: false,
                          ratioExchangePoint: e.target.value,
                        });
                      } else {
                        setStatePromo({
                          ...statePromo,
                          isExchangePoint: true,
                          ratioExchangePoint: e.target.value,
                        });
                      }
                    }}
                    disabled={isActive ? true : false}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>Không yêu cầu</Radio>
                      <Radio value={2}>Giá trị đổi khuyến mãi</Radio>
                    </Space>
                  </Radio.Group>
                  {statePromo?.ratioExchangePoint === 2 && (
                    <div className="div-exchange">
                      <InputNumber
                        min={0}
                        defaultValue={statePromo?.exchangePoint}
                        onChange={(e) =>
                          setStatePromo({ ...statePromo, exchangePoint: e })
                        }
                        style={{ width: "50%", marginTop: 10 }}
                        disabled={isActive ? true : false}
                      />
                      <p className="label-exchange">
                        Thời gian sử dụng sau khi đổi
                      </p>
                      <InputNumber
                        min={0}
                        defaultValue={statePromo?.dateExchange}
                        onChange={(e) =>
                          setStatePromo({ ...statePromo, dateExchange: e })
                        }
                        style={{ width: "50%", marginTop: 10 }}
                        disabled={isActive ? true : false}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="div-detail">
          <div className="div-input">
            <p className="title-input">Cài đặt</p>
            {((statePromo?.isCheckVoucher &&
              statePromo?.ratioTypeVoucher === 1) ||
              statePromo?.ratioTypeVoucher === 2) && (
              <div className="div-show-in-app">
                <Switch
                  checked={statePromo?.isShowInApp}
                  onChange={(e, permission) => {
                    setStatePromo({ ...statePromo, isShowInApp: e });
                  }}
                  size="small"
                  className={
                    statePromo?.isShowInApp ? "switch-select" : "switch"
                  }
                  disabled={isActive ? true : false}
                />
                <p className="label-display">Hiển thị trên App</p>
              </div>
            )}

            <p className="title-input mt-2">
              Phương thức thanh toán được áp dụng
            </p>
            <div className="div-exchange-point">
              <Radio.Group
                style={{ marginTop: 5, marginLeft: 5 }}
                onChange={(e) => {
                  if (e.target.value === 1) {
                    setStatePromo({
                      ...statePromo,
                      isPaymentMethod: false,
                      ratioPaymentMethod: e.target.value,
                    });
                  } else {
                    setStatePromo({
                      ...statePromo,
                      isPaymentMethod: true,
                      ratioPaymentMethod: e.target.value,
                    });
                  }
                }}
                value={statePromo?.ratioPaymentMethod}
                disabled={isActive ? true : false}
              >
                <Space direction="vertical">
                  <Radio value={1}>Tất cả loại thanh toán</Radio>
                  <Radio value={2}>Tuỳ chọn thanh toán</Radio>
                </Space>
              </Radio.Group>
              {statePromo?.ratioPaymentMethod === 2 && (
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                    marginTop: 10,
                  }}
                  placeholder="Chọn phương thức"
                  onChange={(e) =>
                    setStatePromo({ ...statePromo, paymentMethod: e })
                  }
                  options={DATA_PAYMENT}
                  disabled={isActive ? true : false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {checkElement?.includes("delete_promotion") && (
        <Button
          type="primary"
          danger
          style={{
            width: "auto",
            marginBottom: 50,
            marginTop: 20,
            marginLeft: "14%",
          }}
          onClick={() => setModalDelete(true)}
        >
          Xoá khuyến mãi
        </Button>
      )}

      <ModalCustom
        title="Xoá khuyến mãi"
        isOpen={modalDelete}
        handleOk={() => onDelete(id)}
        textOk={"Xoá"}
        handleCancel={() => setModalDelete(false)}
        body={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="m-0">Bạn có chắc muốn xoá mã khuyến mãi này?</p>
            <p style={{ color: "red", margin: 0 }}>{statePromo?.titleVN}</p>
          </div>
        }
      />
      <FloatButton.BackTop
        description="Lưu"
        shape="circle"
        style={{
          width: 50,
          height: 50,
        }}
      />
      {isLoading && <LoadingPagination />}
    </>
  );
};
export default EditPromotion;

const DATA_APPLY_TIME = [
  {
    day_local: 1,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 2,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 3,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 4,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 5,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 6,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 0,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
];

const language_muti = [
  { value: "en", label: "Tiếng Anh" },
  { value: "jp", label: "Tiếng Nhật" },
];
