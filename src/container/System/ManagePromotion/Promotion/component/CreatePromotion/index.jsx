import { useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import i18n from "../../../../../../i18n";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import CustomTextEditor from "../../../../../../components/customTextEdittor";
import UploadImage from "../../../../../../components/uploadImage";
import { Input, InputNumber, Select } from "antd";

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
  const [minimumOrder, setMinimumOrder] = useState();
  const [discountUnit, setDiscountUnit] = useState("amount");
  const lang = useSelector(getLanguageState);

  const selectAfter = (
    <Select defaultValue="VND" style={{ width: 60 }}>
      <Option value="VND">đ</Option>
      <Option value="USD">$</Option>
    </Select>
  );

  return (
    <div className="div-container-create">
      <div className="div-input-row">
        <div className="div-input">
          <a className="title-input">1. Tiêu đề</a>
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
            2. {`${i18n.t("describe", { lng: lang })}`}
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
      </div>
      <div className="div-input">
        <a className="title-input">
          3. {`${i18n.t("detailed_description", { lng: lang })}`}
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
        <a className="title-input">4. Thumbnail/Background</a>
        <div className="div-row">
          <UploadImage
            title={"Thumbnail 160px * 170px"}
            image={imgThumbnail}
            setImage={setImgThumbnail}
            classImg={"img-thumbnail"}
          />

          <UploadImage
            title={"Background 414px * 200px"}
            image={imgBackground}
            setImage={setImgBackground}
            classImg={"img-background"}
          />
        </div>
      </div>
      <div className="div-input-row">
        <div className="div-input">
          <a className="title-input">
            5. {`${i18n.t("promotion_code", { lng: lang })}`}
          </a>
          <Input
            placeholder={`${i18n.t("placeholder", { lng: lang })}`}
            type="text"
            value={promoCode.toUpperCase()}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>
        <div className="div-input">
          <a className="title-input">
            6. {`${i18n.t("minimum_order_price", { lng: lang })}`}
          </a>
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
            }
            min={0}
            value={minimumOrder}
            onChange={(e) => setMinimumOrder(e)}
            style={{ width: "100%" }}
            addonAfter={selectAfter}
          />
        </div>
      </div>
      <div className="div-input-row">
        <div className="div-input">
          <a className="title-input">
            7. {`${i18n.t("discount_form", { lng: lang })}`}
          </a>
          <div className="div-tab">
            {TAB_DISCOUNT?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setDiscountUnit(item?.value)}
                  className={
                    discountUnit === item?.value
                      ? "div-item-tab-select"
                      : "div-item-tab"
                  }
                >
                  <a className="text-tab">{`${i18n.t(item?.title, {
                    lng: lang,
                  })}`}</a>
                </div>
              );
            })}
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
