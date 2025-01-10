import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Image,
  InputNumber,
  List,
  Popover,
  Switch,
  Checkbox,
} from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { TYPE_VIEW_OPTIONAL_SERVICE } from "../../../../@core/constant/service.constant.js";
import "./index.scss";
import { formatMoney } from "../../../../helper/formatMoney.js";
import laundryServiceImage from "../../../../assets/images/laundryService.svg";
import cookingServiceImage from "../../../../assets/images/cookingService.svg";
import vacuumingServiceImage from "../../../../assets/images/vacuumingService.svg";
import bringToolServiceImage from "../../../../assets/images/bringToolService.svg";
import icons from "../../../../utils/icons.js";

const { TbIroningFilled, PiCookingPotFill, FaToolbox, GiVacuumCleaner } = icons;
const ServiceComponent = (props) => {
  const { serviceData } = props;

  const [listOptionalService, setOptionalService] = useState([]);
  const [service, setService] = useState(null);
  useEffect(() => {
    if (serviceData !== null) {
      setService(serviceData);
    }
  }, [serviceData]);

  const toggleSwitchExtend = (typeOptionalService, item) => {
    let tempService = JSON.parse(JSON.stringify(service));
    for (let i = 0; i < tempService.optional_service.length; i++) {
      if (typeOptionalService === tempService.optional_service[i].type) {
        for (
          let y = 0;
          y < tempService.optional_service[i].extend_optional.length;
          y++
        ) {
          if (
            tempService.optional_service[i].extend_optional[y]._id === item._id
          ) {
            tempService.optional_service[i].extend_optional[y].selected =
              !tempService.optional_service[i].extend_optional[y].selected;
          }
        }
      }
    }
    setService(tempService);
    if (props.changeService) {
      props.changeService(tempService);
    }
  };

  const clickMultiSelectExtend = (typeOptionalService, item) => {
    let tempService = JSON.parse(JSON.stringify(service));
    for (let i = 0; i < tempService.optional_service.length; i++) {
      if (typeOptionalService === tempService.optional_service[i].type) {
        for (
          let y = 0;
          y < tempService.optional_service[i].extend_optional.length;
          y++
        ) {
          if (
            tempService.optional_service[i].extend_optional[y]._id === item._id
          ) {
            tempService.optional_service[i].extend_optional[y].selected =
              !tempService.optional_service[i].extend_optional[y].selected;
          }
        }
      }
    }
    setService(tempService);
    if (props.changeService) {
      props.changeService(tempService);
    }
  };

  const clickSelectExtend = (typeOptionalService, item) => {
    let tempService = JSON.parse(JSON.stringify(service));
    for (let i = 0; i < tempService.optional_service.length; i++) {
      if (typeOptionalService === tempService.optional_service[i].type) {
        for (
          let y = 0;
          y < tempService.optional_service[i].extend_optional.length;
          y++
        ) {
          if (
            tempService.optional_service[i].extend_optional[y]._id === item._id
          ) {
            tempService.optional_service[i].extend_optional[y].selected = true;
          } else {
            tempService.optional_service[i].extend_optional[y].selected = false;
          }
        }
      }
    }
    setService(tempService);
    if (props.changeService) {
      props.changeService(tempService);
    }
  };
  const counterNumber = (typeOptionalService, item, counter) => {
    let tempService = JSON.parse(JSON.stringify(service));
    for (let i = 0; i < tempService.optional_service.length; i++) {
      if (typeOptionalService === tempService.optional_service[i].type) {
        for (
          let y = 0;
          y < tempService.optional_service[i].extend_optional.length;
          y++
        ) {
          if (
            tempService.optional_service[i].extend_optional[y]._id === item._id
          ) {
            tempService.optional_service[i].extend_optional[y].count =
              counter === "+"
                ? ++tempService.optional_service[i].extend_optional[y].count
                : --tempService.optional_service[i].extend_optional[y].count;
          }
        }
      }
    }
    setService(tempService);
    if (props.changeService) {
      props.changeService(tempService);
    }
  };

  const onChangeCheckBoxExtend = (typeOptionalService, item) => {
    let tempService = JSON.parse(JSON.stringify(service));
    for (let i = 0; i < tempService.optional_service.length; i++) {
      if (typeOptionalService === tempService.optional_service[i].type) {
        for (
          let y = 0;
          y < tempService.optional_service[i].extend_optional.length;
          y++
        ) {
          if (
            tempService.optional_service[i].extend_optional[y]._id === item._id
          ) {
            tempService.optional_service[i].extend_optional[y].selected =
              !tempService.optional_service[i].extend_optional[y].selected;
            tempService.optional_service[i].extend_optional[y].count = 1;
          }
        }
      }
    }
    setService(tempService);
    if (props.changeService) {
      props.changeService(tempService);
    }
  };

  // Thời lượng
  const SelectHorizontalNoThumbnail = ({ optionalService }) => {
    return (
      <div className="select_horizontal_no_thumbnail">
        {sortingTimeWork(optionalService.extend_optional).map(
          (extend, index) => (
            <div
              key={index}
              className={`service-component__time--select ${
                extend.selected === true && "selected"
              }`}
              onClick={() => {
                clickSelectExtend(optionalService.type, extend);
              }}
            >
              <span className="service-component__time--select-label">
                {extend.title.vi}
              </span>
              <span className="service-component__time--select-sub-label">
                {extend.description.vi}
              </span>
            </div>
          )
        )}
      </div>
    );
  };

  // Loại hình kinh doanh
  const SingleSelectHorizontalThumbnail = ({ optionalService }) => {
    return (
      <div className="single_select_horizontal_thumbnail">
        {optionalService.extend_optional.map((extend, index) => (
          <div
            key={index}
            className={`service-component__time--select ${
              extend.selected === true && "selected"
            }`}
            onClick={() => {
              clickSelectExtend(optionalService.type, extend);
            }}
          >
            <span className="service-component__time--select-label">
              {extend.title.vi}
            </span>
            <span className="service-component__time--select-sub-label">
              {extend.description.vi}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const SelectHorizontalThumbnail = ({ optionalService }) => {
    return (
      <>
        {optionalService.extend_optional.map((extend, index) => (
          <div
            key={index}
            className={`${
              extend.selected === true ? "item-selected" : ""
            } item`}
            onClick={() => {
              clickSelectExtend(optionalService.type, extend);
            }}
          >
            <img src={extend.thumbnail} />
            <p>{extend.title.vi}</p>
            <p>{extend.description.vi}</p>
          </div>
        ))}
      </>
    );
  };

  // Dịch vụ thêm
  const MultiSelectHorizomtalThumbnail = ({ optionalService }) => {
    return (
      <div className="multi_select_horizontal_thumbnail">
        {optionalService.extend_optional.map((extend, index) => (
          <div
            key={index}
            className={`service-component__extra-service ${
              extend.selected === true && "selected"
            }`}
            onClick={() => {
              clickMultiSelectExtend(optionalService.type, extend);
            }}
          >
            {/* <img
              className="service-component__extra-service--image"
              src={
                index === 0
                  ? laundryServiceImage
                  : index === 1
                  ? cookingServiceImage
                  : index === 2
                  ? bringToolServiceImage
                  : index === 3
                  ? vacuumingServiceImage
                  : ""
              }
            ></img> */}
            <div className="service-component__extra-service--icon">
              {extend?.title.vi === "Ủi đồ" ? (
                <TbIroningFilled />
              ) : extend?.title.vi === "Nấu ăn" ? (
                <PiCookingPotFill />
              ) : extend?.title.vi === "Mang theo dụng cụ" ? (
                <FaToolbox />
              ) : extend?.title.vi === "Mang máy hút bụi" ? (
                <GiVacuumCleaner />
              ) : (
                ""
              )}
            </div>

            <span className="service-component__extra-service--label">
              {extend.title.vi === "Mang máy hút bụi"
                ? "Máy hút bụi"
                : extend.title.vi}
            </span>
            {extend.title.vi !== "Mang theo dụng cụ" && (
              <span className="service-component__extra-service--sub-label">
                {extend.description.vi}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Tùy chọn thêm (Ưu tiên người làm yêu thích, nhà có thú cưng, ...)
  const OptionToggleSwitch = ({ optionalService }) => {
    return (
      <div className="option_toggle_switch">
        {optionalService.extend_optional.map((extend, index) => (
          <div
            key={index}
            className={`service-component__switch ${
              index === optionalService.extend_optional.length - 1 &&
              "last-item"
            }`}
          >
            <span>{extend.title.vi}</span>
            <Switch
              size="small"
              checked={extend.selected}
              onChange={() => {
                toggleSwitchExtend(optionalService.type, extend);
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const MultiSelectCountSofa = ({ optionalService }) => {
    return (
      <div className="multi_select_count_sofa">
        {optionalService.extend_optional.map((extend, index) => (
          <div key={index} className={` item`}>
            <div className="container-title">
              {extend.kind !== "" && (
                <p className="extend-kind">
                  {extend.kind === "leather" && "(da)"}
                  {extend.kind === "fabric" && "(vải/nỉ)"}
                </p>
              )}
              <p>{extend.title.vi}</p>
              <div className="check-box">
                <Checkbox
                  checked={extend.selected}
                  onChange={() => {
                    onChangeCheckBoxExtend(optionalService.type, extend);
                  }}
                ></Checkbox>
              </div>
            </div>
            <p>{extend.description.vi}</p>
            {extend.selected === true ? (
              <>
                <div className="counter-optional">
                  <Button
                    onClick={() => {
                      counterNumber(optionalService.type, extend, "-");
                    }}
                  >
                    -
                  </Button>
                  <InputNumber
                    value={extend.count}
                    controls={false}
                    readOnly={true}
                  />
                  <Button
                    onClick={() => {
                      counterNumber(optionalService.type, extend, "+");
                    }}
                  >
                    +
                  </Button>
                </div>
              </>
            ) : (
              <div className="counter-optional"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /* ~~~ Other ~~~ */
  // Hàm sắp xếp lại thời lượng của ca làm (tăng dần)
  const sortingTimeWork = (array) => {
    return array?.sort((a, b) => a.estimate - b.estimate);
  };

  return (
    <React.Fragment>
      {service !== null && (
        <div className="service-component">
          <div className="service-component__container">
            {service.optional_service.map((item, index) => (
              <div key={index} className="service-component__container--child">
                <span className="service-component__container--child-label">
                  {item.title.vi}
                </span>
                {/* <div className={TYPE_VIEW_OPTIONAL_SERVICE[item.type]}> */}
                <div className="">
                  {item.type === "select_horizontal_no_thumbnail" ? (
                    <SelectHorizontalNoThumbnail optionalService={item} />
                  ) : item.type === "select_horizontal_thumbnail" ? (
                    <SelectHorizontalThumbnail optionalService={item} />
                  ) : item.type === "multi_select_horizontal_thumbnail" ? (
                    <MultiSelectHorizomtalThumbnail optionalService={item} />
                  ) : item.type === "option_toggle_switch" ? (
                    <OptionToggleSwitch optionalService={item} />
                  ) : item.type === "single_select_horizontal_thumbnail" ? (
                    <SingleSelectHorizontalThumbnail optionalService={item} />
                  ) : item.type === "multi_select_count_sofa" ? (
                    <MultiSelectCountSofa optionalService={item} />
                  ) : item.type === "multi_select_count_ac" ? (
                    <MultiSelectCountSofa optionalService={item} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ServiceComponent;
