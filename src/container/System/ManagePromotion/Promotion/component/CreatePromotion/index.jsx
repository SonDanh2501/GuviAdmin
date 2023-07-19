import { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import i18n from "../../../../../../i18n";
import _debounce from "lodash/debounce";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import CustomTextEditor from "../../../../../../components/customTextEdittor";
import UploadImage from "../../../../../../components/uploadImage";
import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  List,
  Radio,
  Select,
  Space,
} from "antd";
import { getGroupCustomerApi } from "../../../../../../api/promotion";
import { searchCustomersApi } from "../../../../../../api/customer";
import {
  getProvince,
  getService,
} from "../../../../../../redux/selectors/service";
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreatePromotion = () => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [shortDescriptionVN, setShortDescriptionVN] = useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgBackground, setImgBackground] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [minimumOrder, setMinimumOrder] = useState(0);
  const [checkMininum, setCheckMininum] = useState(1);
  const [discountUnit, setDiscountUnit] = useState("amount");
  const [maximumDiscount, setMaximumDiscount] = useState(0);
  const [isMaximumDiscount, setIsMaximumDiscount] = useState(true);
  const [reducedValue, setReducedValue] = useState(0);
  const [isGroupCustomer, setIsGroupCustomer] = useState(false);
  const [isObjectCustomer, setIsObjectCustomer] = useState(1);
  const [groupCustomer, setGroupCustomer] = useState([]);
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [serviceApply, setServiceApply] = useState("");
  const [limitedQuantity, setLimitedQuantity] = useState(true);
  const [amount, setAmount] = useState(0);
  const [isUsePromo, setIsUsePromo] = useState(true);
  const [usePromo, setUsePromo] = useState(0);
  const [limitedDate, setLimitedDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isApplyArea, setIsApplyArea] = useState(1);
  const [city, setCity] = useState([]);
  const options = [];
  const serviceOption = [];
  const cityOption = [];
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const lang = useSelector(getLanguageState);
  const selectAfter = (
    <Select
      defaultValue="VND"
      style={{ width: 60 }}
      onChange={(e) => {
        if (e === "VND") {
          setDiscountUnit("amount");
        } else {
          setDiscountUnit("percent");
        }
      }}
    >
      <Option value="VND">₫</Option>
      <Option value="%">%</Option>
    </Select>
  );

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => {});
  }, []);

  dataGroupCustomer.map((item) => {
    options.push({
      label: item?.name,
      value: item?._id,
    });
  });

  province?.map((item) => {
    cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  service.map((item) => {
    serviceOption.push({
      label: item?.title?.[lang],
      value: item?._id,
    });
  });

  const searchCustomer = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomersApi(value)
          .then((res) => {
            if (value === "") {
              setData([]);
            } else {
              setData(res.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        setData([]);
      }
    }, 500),
    []
  );

  const onChooseCustomer = (item) => {
    setName("");
    setData([]);
    const newData = listCustomers.concat(item?._id);
    const newNameData = listNameCustomers.concat({
      _id: item?._id,
      full_name: item?.full_name,
      phone: item?.phone,
      id_view: item?.id_view,
    });
    setListCustomers(newData);
    setListNameCustomers(newNameData);
  };

  const removeItemCustomer = (item) => {
    const newNameArray = listNameCustomers.filter((i) => i?._id !== item?._id);
    const newArray = listCustomers.filter((i) => i !== item?._id);
    setListNameCustomers(newNameArray);
    setListCustomers(newArray);
  };

  return (
    <div className="div-container-create">
      <div className="div-body">
        <div className="div-input">
          <a className="title-input">
            1. {`${i18n.t("promotion_code", { lng: lang })}`}
          </a>
          <Input
            placeholder={`${i18n.t("Nhập mã khuyến mãi", { lng: lang })}`}
            type="text"
            value={promoCode.toUpperCase()}
            onChange={(e) => setPromoCode(e.target.value)}
            style={{ marginTop: 5 }}
          />
          <a className="text-note">
            Khách hàng sẽ nhập hoặc chọn cái này lúc thanh toán
          </a>
        </div>
        <div className="div-input">
          <a className="title-input">2. Tiêu đề</a>
          <InputCustom
            title={`${i18n.t("vietnamese", { lng: lang })}`}
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <InputCustom
            title={`${i18n.t("english", { lng: lang })}`}
            value={titleEN}
            onChange={(e) => setTitleEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="div-input">
          <a className="title-input">
            3. {`${i18n.t("describe", { lng: lang })}`}
          </a>
          <InputCustom
            title={`${i18n.t("vietnamese", { lng: lang })}`}
            value={shortDescriptionVN}
            onChange={(e) => setShortDescriptionVN(e.target.value)}
            textArea={true}
          />
          <InputCustom
            title={`${i18n.t("english", { lng: lang })}`}
            value={shortDescriptionEN}
            onChange={(e) => setShortDescriptionEN(e.target.value)}
            style={{ marginTop: 5 }}
            textArea={true}
          />
        </div>
        <div className="div-input">
          <a className="title-input">
            4. {`${i18n.t("detailed_description", { lng: lang })}`}
          </a>
          <div>
            <a>{`${i18n.t("vietnamese", { lng: lang })}`}</a>
            <CustomTextEditor
              value={descriptionVN}
              onChangeValue={setDescriptionVN}
            />
          </div>
          <div className="mt-2">
            <a>{`${i18n.t("english", { lng: lang })}`}</a>
            <CustomTextEditor
              value={descriptionEN}
              onChangeValue={setDescriptionEN}
            />
          </div>
        </div>
        <div className="div-background-thumnail">
          <a className="title-input">5. Hỉnh ảnh khuyến mãi</a>
          <div className="div-row">
            <UploadImage
              title={"Ảnh khuyến mãi 160px * 170px"}
              image={imgThumbnail}
              setImage={setImgThumbnail}
              classImg={"img-thumbnail"}
            />

            <UploadImage
              title={"Ảnh bìa 414px * 200px"}
              image={imgBackground}
              setImage={setImgBackground}
              classImg={"img-background"}
            />
          </div>
        </div>
        <div className="div-input">
          <a className="title-input">
            6. {`${i18n.t("Giảm giá đơn hàng", { lng: lang })}`}
          </a>
          <div className="div-reduced">
            <div className="div-body-reduced">
              <a>{`${i18n.t("Mức giảm", { lng: lang })}`}</a>
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                }
                min={0}
                max={discountUnit === "percent" && 100}
                value={
                  discountUnit === "amount" ? maximumDiscount : reducedValue
                }
                onChange={(e) => {
                  if (discountUnit === "amount") {
                    setMaximumDiscount(e);
                  } else {
                    setReducedValue(e);
                  }
                }}
                style={{ width: "100%", marginTop: 5 }}
                addonAfter={selectAfter}
              />
            </div>
            {discountUnit === "percent" && (
              <div className="div-body-reduced">
                {/* <a>{`${i18n.t("discount_max", { lng: lang })}`}</a> */}
                <Checkbox
                  checked={isMaximumDiscount}
                  onChange={(e) => setIsMaximumDiscount(e.target.checked)}
                  disabled
                >
                  Giới hạn số tiền giảm tối đa
                </Checkbox>
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                  }
                  min={0}
                  value={maximumDiscount}
                  onChange={(e) => setMaximumDiscount(e)}
                  addonAfter="đ"
                  style={{ width: "100%", marginTop: 5 }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="div-input">
          <a className="title-input">
            7. {`${i18n.t("Điều kiện tối thiểu", { lng: lang })}`}
          </a>
          <Radio.Group
            style={{ marginTop: 10 }}
            defaultValue={checkMininum}
            onChange={(e) => {
              setCheckMininum(e.target.value);
              if (e.target.value === 1) {
                setMinimumOrder(0);
              }
            }}
          >
            <Space direction="vertical">
              <Radio value={1}>Không yêu cầu</Radio>
              <Radio value={2}>Giá trị đơn tối thiểu</Radio>
            </Space>
          </Radio.Group>
          {checkMininum === 2 && (
            <div className="div-minimum-order">
              <InputNumber
                formatter={(value) =>
                  `${value} ₫`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                }
                min={0}
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e)}
                className="input-price-minimum"
              />
              <a className="text-note">Áp dụng cho tất cả đơn hàng</a>
            </div>
          )}
        </div>
        <div className="div-input">
          <a className="title-input">
            8. {`${i18n.t("Đối tượng khách hàng", { lng: lang })}`}
          </a>
          <Radio.Group
            defaultValue={isObjectCustomer}
            onChange={(e) => setIsObjectCustomer(e.target.value)}
            style={{ marginTop: 10 }}
          >
            <Space direction="vertical">
              <Radio value={1}>Không giới hạn khách hàng</Radio>
              <Radio value={2}>Nhóm khách hàng</Radio>
              <Radio value={3}>Tuỳ chọn khách hàng</Radio>
            </Space>
          </Radio.Group>
          <div>
            {isObjectCustomer === 2 && (
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                  marginTop: 10,
                }}
                placeholder="Please select"
                onChange={(value) => setGroupCustomer(value)}
                options={options}
              />
            )}
          </div>
          <div>
            {isObjectCustomer === 3 && (
              <div>
                <Input
                  placeholder={`${i18n.t("search", { lng: lang })}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    searchCustomer(e.target.value);
                  }}
                  style={{ marginTop: 10 }}
                />
                {data.length > 0 && (
                  <List className="list-item-kh">
                    {data?.map((item, index) => {
                      return (
                        <div
                          className="div-item"
                          key={index}
                          onClick={() => onChooseCustomer(item)}
                        >
                          <a className="text-name">
                            {item?.full_name} - {item?.phone} - {item?.id_view}
                          </a>
                        </div>
                      );
                    })}
                  </List>
                )}
                {listNameCustomers.length > 0 && (
                  <div className="div-list-customer">
                    <List type={"unstyled"}>
                      {listNameCustomers.map((item) => {
                        return (
                          <div className="div-item-customer">
                            <a className="text-name-list">
                              - {item?.full_name} . {item?.phone} .{" "}
                              {item?.id_view}
                            </a>
                            {/* <i
                              class="uil uil-times-circle"
                              onClick={() => removeItemCustomer(item)}
                            ></i> */}
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
          <a className="title-input">
            9. {`${i18n.t("Khu vực áp dụng", { lng: lang })}`}
          </a>
          <Radio.Group
            style={{ marginTop: 10 }}
            defaultValue={isApplyArea}
            onChange={(e) => {
              setIsApplyArea(e.target.value);
            }}
          >
            <Space direction="vertical">
              <Radio value={1}>Toàn quốc</Radio>
              <Radio value={2}>Tuỳ chọn tỉnh/thành phố</Radio>
            </Space>
          </Radio.Group>

          {isApplyArea === 2 && (
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%", marginTop: 10 }}
              onChange={(e) => {
                setCity(e);
              }}
              options={cityOption}
              optionLabelProp="label"
            />
          )}
        </div>
        <div className="div-input">
          <a className="title-input">10. Giới hạn sử dụng</a>

          <div className="mt-2">
            <Checkbox
              checked={limitedQuantity}
              onChange={(e) => setLimitedQuantity(e.target.checked)}
            >
              Giới hạn tổng số có thể sử dụng khuyến mãi
            </Checkbox>
            {limitedQuantity && (
              <Input
                style={{ marginTop: 10 }}
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
          </div>
          <div className="mt-2">
            <Checkbox
              checked={isUsePromo}
              onChange={(e) => setIsUsePromo(e.target.checked)}
            >
              {`${i18n.t("promo_use_time", { lng: lang })}`}
            </Checkbox>
            {isUsePromo && (
              <Input
                style={{ marginTop: 10 }}
                min={0}
                type="number"
                value={usePromo}
                onChange={(e) => setUsePromo(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="div-input">
          <a className="title-input">
            8. {`${i18n.t("apply_service", { lng: lang })}`}
          </a>
          <Select
            style={{ width: "100%" }}
            onChange={(e) => {
              setServiceApply(e);
            }}
            options={serviceOption}
          />
        </div>

        <div className="div-input">
          <a className="title-input">
            11. {`${i18n.t("promotion_time", { lng: lang })}`}
          </a>
          <div>
            <Checkbox
              checked={limitedDate}
              onChange={(e) => setLimitedDate(e.target.checked)}
            >
              {`${i18n.t("limit_date", { lng: lang })}`}
            </Checkbox>
            {limitedDate && (
              <>
                <div>
                  <a>{`${i18n.t("start_date", { lng: lang })}`}</a>
                  <DatePicker
                    onChange={(date, dateString) => setStartDate(dateString)}
                    style={{ marginLeft: 5, width: "100%" }}
                  />
                </div>
                <div>
                  <a>{`${i18n.t("end_date", { lng: lang })}`}</a>
                  <DatePicker
                    onChange={(date, dateString) => setEndDate(dateString)}
                    style={{ marginLeft: 5, width: "100%" }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePromotion;

const TAB_DISCOUNT = [
  {
    value: "amount",
    title: "direct_discount",
  },
  {
    value: "percent",
    title: "percentage_discount",
  },
];
