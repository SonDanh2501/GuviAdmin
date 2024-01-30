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
import _debounce from "lodash/debounce";
import moment from "moment";
import "moment/locale/vi";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchCustomersApi } from "../../../../api/customer";
import { DATA_PAYMENT, DATA_TIME_APPLY } from "../../../../api/fakeData";
import { createPushNotification } from "../../../../api/notification";
import {
  createPromotion,
  getGroupCustomerApi,
} from "../../../../api/promotion";
import backgroundImage from "../../../../assets/images/backgroundContent.png";
import descriptionImage from "../../../../assets/images/description.png";
import shortDescriptionImage from "../../../../assets/images/shortDescription.png";
import thumnailImage from "../../../../assets/images/thumnailContent.png";
import titleImage from "../../../../assets/images/title.png";
import TextEditor from "../../../../components/TextEditor";
import LoadingPagination from "../../../../components/paginationLoading";
import InputCustom from "../../../../components/textInputCustom";
import UploadImage from "../../../../components/uploadImage";
import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { getProvince, getService } from "../../../../redux/selectors/service";
import "./styles.scss";
import { getGroupPromotion } from "../../../../api/configuration";
import InputLanguage from "../../../../components/inputLanguage";
const { Option } = Select;

const CreatePromotion = () => {
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
    ratioPaymentMethod: 1,
    isPaymentMethod: false,
    paymentMethod: [],
    isCheckEndDate: true,
    isSendNotification: false,
    isApplyPushNoti: 1,
    isDateSchedule: false,
    titleNoti: "",
    descriptionNoti: "",
    dateSchedule: "",
    errorCode: "",
    errorTitle: "",
    errorShortDescription: "",
    errorDescription: "",
    errorService: "",
    errorNameBrand: "",
    errorThumnail: "",
    errorStartTime: "",
    errorEndTime: "",
    ratioGroupPromotion: 1,
    groupPromotion: [],
    dataGroupPromotion: [],
  });
  const [title, setTitle] = useState({
    vi: "",
    en: "",
  });
  const [shortDescription, setShortDescription] = useState({
    vi: "",
    en: "",
  });
  const [description, setDescription] = useState({
    vi: "",
    en: "",
  });
  const [timeApply, setTimeApply] = useState(DATA_APPLY_TIME);
  const [isLoading, setIsLoading] = useState(false);
  const options = [];
  const serviceOption = [];
  const cityOption = [];
  const groupPromotionOption = [];
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  const selectAfter = (
    <Select
      defaultValue="VND"
      style={{ width: 60 }}
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
      .then((res) =>
        setStatePromo({ ...statePromo, dataGroupCustomer: res?.data })
      )
      .catch((err) => {});

    getGroupPromotion(0, 100, "")
      .then((res) => {
        setStatePromo({ ...statePromo, dataGroupPromotion: res?.data });
      })
      .catch((err) => {});
  }, []);

  statePromo?.dataGroupPromotion?.map((item) => {
    return groupPromotionOption?.push({
      value: item?._id,
      label: item?.name[lang],
    });
  });

  statePromo?.dataGroupCustomer.map((item) => {
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
            setStatePromo({ ...statePromo, name: value, data: [] });
          } else {
            setStatePromo({ ...statePromo, name: value, data: res.data });
          }
        })
        .catch((err) => console.log(err));
    } else {
      setStatePromo({ ...statePromo, name: value, data: [] });
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
      name: "",
      data: [],
      listCustomers: newData,
      listNameCustomers: newNameData,
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

  const onCreatePromotion = useCallback(() => {
    setIsLoading(true);
    createPromotion({
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
      id_group_customer: statePromo?.groupCustomer,
      id_customer: statePromo?.listCustomers,
      is_apply_area: statePromo?.isApplyArea,
      city: statePromo?.city,
      is_limit_count: statePromo?.limitedQuantity,
      is_limited_use: statePromo?.isUsePromo,
      limited_use: statePromo?.isUsePromo ? statePromo?.usePromo : 0,
      is_exchange_point: statePromo?.isExchangePoint,
      exchange_point: statePromo?.exchangePoint,
      exp_date_exchange: statePromo?.dateExchange,
      is_show_in_app: statePromo?.isShowInApp,
      is_payment_method: statePromo?.isPaymentMethod,
      payment_method: statePromo?.paymentMethod,
      limit_count: statePromo?.limitedQuantity ? statePromo?.amount : 0,
      type_promotion: statePromo?.isCheckProgram ? "event" : "code",
      is_delete: false,
      position: 0,
      district: [],
      timezone: "Asia/Ho_Chi_Minh",
      id_group_promotion:
        statePromo.ratioGroupPromotion === 2 ? statePromo.groupPromotion : [],
    })
      .then((res) => {
        if (statePromo?.isSendNotification) {
          createPushNotification({
            title: statePromo?.titleNoti,
            body: statePromo?.descriptionNoti,
            is_date_schedule: statePromo?.isDateSchedule,
            date_schedule: moment(statePromo?.dateSchedule).toISOString(),
            is_id_customer: statePromo?.isCustomer,
            id_customer: statePromo?.listCustomers,
            is_id_group_customer: statePromo?.isGroupCustomer,
            id_group_customer: statePromo?.groupCustomer,
            image_url: statePromo?.imgBackground,
          })
            .then(() => {
              setIsLoading(false);
              navigate(-1);
            })
            .catch((err) => {
              setIsLoading(false);
              errorNotify({
                message: err?.message,
              });
            });
        } else {
          navigate(-1);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
        });
      });
  }, [statePromo, timeApply, title, shortDescription, description, navigate]);

  // const onCheck = () => {
  //   setStatePromo({
  //     ...statePromo,
  //     errorCode:
  //       statePromo?.promoCode == "" ? "Vui lòng nhập mã khuyến mãi" : " ",
  //     errorTitle:
  //       statePromo?.titleVN || statePromo?.titleEN == ""
  //         ? "Vui lòng nhập tiêu đề khuyến mãi"
  //         : " ",
  //     errorShortDescription:
  //       statePromo?.shortDescriptionVN || statePromo?.shortDescriptionEN == ""
  //         ? "Vui lòng nhập mô tả khuyến mãi"
  //         : " ",
  //     errorShortDescription:
  //       statePromo?.descriptionVN || statePromo?.descriptionEN == ""
  //         ? "Vui lòng nhập chi tiết khuyến mãi"
  //         : " ",
  //     errorService:
  //       statePromo?.serviceApply?.length > 0 ? "" : "Vui lòng chọn dịch vụ",
  //     errorNameBrand:
  //       statePromo?.namebrand == "" ? "Vui lòng nhập tên đối tác" : "",
  //     errorThumnail:
  //       statePromo?.imgThumbnail == "" ? "Vui lòng chọn hình khuyến mãi" : "",
  //     errorStartTime:
  //       statePromo?.isApllyTime === 1
  //         ? ""
  //         : statePromo?.startDate === ""
  //         ? "Vui lòng chọn thời gian bắt đầu"
  //         : "",
  //     errorEndTime:
  //       statePromo?.isApllyTime === 1
  //         ? ""
  //         : statePromo?.endDate === ""
  //         ? "Vui lòng chọn thời gian kết thúc"
  //         : "",
  //     errorAmount:
  //       statePromo?.maximumDiscount > 0
  //         ? ""
  //         : "Vui lòng nhập mức giảm khuyến mãi",
  //   });
  // };

  return (
    <>
      <div className="div-head-add-promotion">
        <p className="m-0">Tạo mới khuyến mãi</p>
        <div>
          <Button style={{ width: "auto" }} onClick={() => navigate(-1)}>
            Huỷ
          </Button>
          <Button
            style={{ width: "auto", marginLeft: 10 }}
            type="primary"
            onClick={onCreatePromotion}
          >
            Tạo mới
          </Button>
        </div>
      </div>
      <div className="div-container-create">
        <div className="div-body">
          <div className="div-input">
            <div className="div-parrent-promo">
              <div className="div-code-promo">
                <p className="label-promo">Mã khuyến mãi</p>
                <Input
                  placeholder={`${i18n.t("Nhập mã khuyến mãi", { lng: lang })}`}
                  type="text"
                  value={statePromo?.promoCode.toUpperCase()}
                  onChange={(e) =>
                    setStatePromo({
                      ...statePromo,
                      promoCode: e.target.value,
                      errorCode: "",
                    })
                  }
                  style={{ marginTop: 5, width: "100%", height: 30 }}
                />
                <p style={{ fontSize: 12, color: "#fb422e", margin: 0 }}>
                  {statePromo?.errorCode}
                </p>
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
                >
                  Chương trình khuyến mãi
                </Checkbox>
                <Select
                  onChange={(e) => {
                    setStatePromo({
                      ...statePromo,
                      serviceApply: e,
                      errorService: "",
                    });
                  }}
                  options={serviceOption}
                  allowClear={true}
                  placeholder="Chọn dịch vụ áp dụng"
                  style={{ marginTop: 10 }}
                  value={statePromo?.serviceApply}
                />
                <p style={{ fontSize: 12, color: "#fb422e", margin: 0 }}>
                  {statePromo?.errorService}
                </p>
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
                  error={statePromo?.errorNameBrand}
                />
              </div>
            )}
          </div>
          <div className="div-input">
            <p className="title-input">Nhóm khuyến mãi</p>
            <Radio.Group
              value={statePromo?.ratioGroupPromotion}
              onChange={(e) =>
                setStatePromo({
                  ...statePromo,
                  ratioGroupPromotion: e.target.value,
                })
              }
              style={{
                marginTop: 10,
              }}
            >
              <Space direction="vertical">
                <Radio value={1}>Không áp dụng</Radio>
                <Radio value={2}>Khuyến mãi theo nhóm</Radio>
              </Space>
            </Radio.Group>
            {statePromo?.ratioGroupPromotion === 2 && (
              <Select
                style={{ marginTop: 10 }}
                options={groupPromotionOption}
                mode="multiple"
                onChange={(e) =>
                  setStatePromo({ ...statePromo, groupPromotion: e })
                }
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
                          height={300}
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
              {/* <div>
                <a>{`${i18n.t("vietnamese", { lng: lang })}`}</a>
                <TextEditor
                  value={statePromo?.descriptionVN}
                  onChange={(e) =>
                    setStatePromo({ ...statePromo, descriptionVN: e })
                  }
                  height={300}
                />
              </div>
              <div className="mt-2">
                <a>{`${i18n.t("english", { lng: lang })}`}</a>
                <TextEditor
                  value={statePromo?.descriptionEN}
                  onChange={(e) =>
                    setStatePromo({ ...statePromo, descriptionEN: e })
                  }
                  height={300}
                />
              </div> */}
            </div>
          )}

          {(statePromo?.serviceApply.length > 0 ||
            statePromo?.ratioTypeVoucher === 2) && (
            <>
              <div className="div-input">
                <p className="title-input">Thời gian hiệu lực</p>
                <Radio.Group
                  defaultValue={statePromo?.isApllyTime}
                  style={{ marginTop: 10 }}
                  onChange={(e) => {
                    if (e.target.value === 1) {
                      setStatePromo({
                        ...statePromo,
                        isApllyTime: e.target.value,
                        limitedDate: false,
                      });
                    } else {
                      setStatePromo({
                        ...statePromo,
                        isApllyTime: e.target.value,
                        limitedDate: true,
                      });
                    }
                  }}
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
                        />
                        <p
                          style={{ fontSize: 12, color: "#fb422e", margin: 0 }}
                        >
                          {statePromo?.errorStartTime}
                        </p>
                      </div>
                      <div className="div-time">
                        <Checkbox
                          checked={statePromo?.isCheckEndDate}
                          onChange={(e) => {}}
                        >
                          Có thời gian kết thúc
                        </Checkbox>
                        <DatePicker
                          onChange={(date, dateString) => {
                            setStatePromo({
                              ...statePromo,
                              endDate: moment(date?.$d)
                                .endOf("date")
                                .add(7, "hours")
                                .toISOString(),
                            });
                          }}
                          style={{ width: "90%", marginTop: 2 }}
                          locale={locale}
                        />
                        <p
                          style={{ fontSize: 12, color: "#fb422e", margin: 0 }}
                        >
                          {statePromo?.errorEndTime}
                        </p>
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
                            ratioTypeDateApply: e.target.value,
                            isApplyTimeUse: true,
                            typeDateApply: "date_create",
                          });
                        } else {
                          setStatePromo({
                            ...statePromo,
                            ratioTypeDateApply: e.target.value,
                            isApplyTimeUse: true,
                            typeDateApply: "date_work",
                          });
                        }
                      }}
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
                                                value={i?.start_time_local}
                                                size="small"
                                                onChange={(e) =>
                                                  changeTimeStartApply(
                                                    e,
                                                    index,
                                                    indexTime
                                                  )
                                                }
                                              />
                                              <p className="minus m-0">-</p>

                                              <Select
                                                options={DATA_TIME_APPLY}
                                                value={i?.end_time_local}
                                                style={{ width: 100 }}
                                                size="small"
                                                onChange={(e) =>
                                                  changeTimeEndApply(
                                                    e,
                                                    index,
                                                    indexTime
                                                  )
                                                }
                                              />
                                              <CloseOutlined
                                                className="icon-remove"
                                                onClick={() =>
                                                  deleteTime(index, indexTime)
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
                                    />
                                  ) : (
                                    <p
                                      className="choose-time"
                                      onClick={() => addTime(index)}
                                    >
                                      Chọn giờ
                                    </p>
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
                        setStatePromo({
                          ...statePromo,
                          imgThumbnail: prev,
                          errorThumnail: "",
                        })
                      }
                      classImg="img-thumbnail-promotion"
                      classUpload="upload-thumbnail-promotion"
                    />
                    <p style={{ fontSize: 12, color: "#fb422e", margin: 0 }}>
                      {statePromo?.errorThumnail}
                    </p>

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
                      />
                      <p style={{ fontSize: 12, color: "#fb422e", margin: 0 }}>
                        {statePromo?.errorAmount}
                      </p>
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
                    defaultValue={statePromo?.checkMininum}
                    onChange={(e) => {
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
                          minimumOrder: 0,
                          checkMininum: e.target.value,
                        });
                      }
                    }}
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
                          `${value} ₫`.replace(
                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                            "$1,"
                          )
                        }
                        min={0}
                        value={statePromo?.minimumOrder}
                        onChange={(e) =>
                          setStatePromo({
                            ...statePromo,
                            minimumOrder: e,
                          })
                        }
                        className="input-price-minimum"
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
                  defaultValue={statePromo?.isObjectCustomer}
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
                        isCustomer: false,
                        isGroupCustomer: false,
                        isObjectCustomer: e.target.value,
                      });
                    }
                  }}
                  style={{ marginTop: 10 }}
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
                      options={options}
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
                      />
                      {statePromo?.data.length > 0 && (
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

                      {statePromo?.listNameCustomers.length > 0 && (
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
                  defaultValue={statePromo?.ratioApplyArea}
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
                    placeholder="Chọn tỉnh thành phố"
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
                    />
                  )}
                </div>
              </div>
              {!statePromo?.isCheckProgram && (
                <div className="div-input">
                  <p className="title-input">Điểm G-point quy đổi</p>
                  <Radio.Group
                    defaultValue={statePromo?.ratioExchangePoint}
                    style={{ marginTop: 10 }}
                    onChange={(e) => {
                      if (e.target.value === 1) {
                        setStatePromo({
                          ...statePromo,
                          ratioExchangePoint: e.target.value,
                          isExchangePoint: false,
                        });
                      } else {
                        setStatePromo({
                          ...statePromo,
                          ratioExchangePoint: e.target.value,
                          isExchangePoint: true,
                        });
                      }
                    }}
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
                />
                <p className="label-display">Hiển thị trên App</p>
              </div>
            )}
            <div className="div-push-noti">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Switch
                  checked={statePromo?.isSendNotification}
                  onChange={(e) =>
                    setStatePromo({ ...statePromo, isSendNotification: e })
                  }
                  size="small"
                  className={
                    statePromo?.isSendNotification ? "switch-select" : "switch"
                  }
                />
                <p className="title-input">Push notification</p>
              </div>
              {statePromo?.isSendNotification && (
                <div className="div-body-push">
                  <Radio.Group
                    defaultValue={statePromo?.isApplyPushNoti}
                    style={{ marginTop: 10 }}
                    onChange={(e) => {
                      if (e.target.value) {
                        setStatePromo({
                          ...statePromo,
                          isApplyPushNoti: e.target.value,
                          isDateSchedule: false,
                        });
                      } else {
                        setStatePromo({
                          ...statePromo,
                          isApplyPushNoti: e.target.value,
                          isDateSchedule: true,
                        });
                      }
                    }}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>Đẩy thông báo ngay lập tức</Radio>
                      <Radio value={2}>Đẩy thông báo theo thời gian</Radio>
                    </Space>
                  </Radio.Group>

                  <div>
                    <InputCustom
                      title={`${i18n.t("title", { lng: lang })}`}
                      type="text"
                      value={statePromo?.titleNoti}
                      onChange={(e) =>
                        setStatePromo({
                          ...statePromo,
                          titleNoti: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <InputCustom
                      title={`${i18n.t("describe", { lng: lang })}`}
                      textArea={true}
                      value={statePromo?.descriptionNoti}
                      onChange={(e) =>
                        setStatePromo({
                          ...statePromo,
                          descriptionNoti: e.target.value,
                        })
                      }
                      style={{ marginTop: 5, width: "100%" }}
                    />
                    {statePromo?.isApplyPushNoti === 2 && (
                      <Input
                        type="datetime-local"
                        value={statePromo?.dateSchedule}
                        onChange={(e) =>
                          setStatePromo({
                            ...statePromo,
                            dateSchedule: e.target.value,
                          })
                        }
                        style={{ width: "100%", marginTop: 5 }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
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
                      ratioPaymentMethod: e.target.value,
                      isPaymentMethod: false,
                    });
                  } else {
                    setStatePromo({
                      ...statePromo,
                      ratioPaymentMethod: e.target.value,
                      isPaymentMethod: true,
                    });
                  }
                }}
                defaultValue={statePromo?.ratioPaymentMethod}
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <FloatButton.BackTop
        description="Tạo"
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
export default CreatePromotion;
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
