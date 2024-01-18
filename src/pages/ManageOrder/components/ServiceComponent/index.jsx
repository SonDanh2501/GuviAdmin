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

  const SelectHorizontalNoThumbnail = ({ optionalService }) => {
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
            <p>{extend.title.vi}</p>
            <p>{extend.description.vi}</p>
          </div>
        ))}
      </>
    );
  };

  const SingleSelectHorizontalThumbnail = ({ optionalService }) => {
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
            <p>{extend.title.vi}</p>
            <p>{extend.description.vi}</p>
          </div>
        ))}
      </>
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

  const MultiSelectHorizomtalThumbnail = ({ optionalService }) => {
    return (
      <>
        {optionalService.extend_optional.map((extend, index) => (
          <div
            key={index}
            className={`${extend.selected ? "item-selected" : ""} item`}
            onClick={() => {
              clickMultiSelectExtend(optionalService.type, extend);
            }}
          >
            <p>{extend.title.vi}</p>
            <p>{extend.description.vi}</p>
          </div>
        ))}
      </>
    );
  };

  const OptionToggleSwitch = ({ optionalService }) => {
    return (
      <>
        {optionalService.extend_optional.map((extend, index) => (
          <div key={index} className="div-flex-row">
            <p>{extend.title.vi}</p>
            <Switch
              checked={extend.selected}
              onChange={() => {
                toggleSwitchExtend(optionalService.type, extend);
              }}
            />
          </div>
        ))}
      </>
    );
  };

  const MultiSelectCountSofa = ({ optionalService }) => {
    return (
      <>
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
      </>
    );
  };

  return (
    <React.Fragment>
      {service !== null && (
        <>
          <div className="div-flex-row">
            <div className="optional-service div-flex-column">
              {service.optional_service.map((item, index) => (
                <div key={index} className="div-flex-column">
                  <p className="fw-500"> {item.title.vi}</p>
                  <div className={TYPE_VIEW_OPTIONAL_SERVICE[item.type]}>
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
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default ServiceComponent;
