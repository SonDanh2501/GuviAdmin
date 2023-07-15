import { useLocation } from "react-router-dom";
import "./styles.scss";
import { useState } from "react";
import InputCustom from "../../../../../components/textInputCustom";
import { useSelector } from "react-redux";
import { getProvince } from "../../../../../redux/selectors/service";
import { Button, TimePicker } from "antd";
import dayjs from "dayjs";

const EditPrice = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [dataDistrict, setDataDistrict] = useState([]);
  const [data, setData] = useState([
    {
      district: [],
      city: 0,
      value: 0,
      type_increase: "",
      price_option_rush_day: [
        {
          rush_days: [],
          start_time: "",
          end_time: "",
          time_zone_apply: 7,
          type_increase: "",
          value: 0,
        },
      ],
      price_option_holiday: [
        {
          time_start: "",
          time_end: "",
          type_increase: "",
          value: 0,
        },
      ],
    },
  ]);
  const cityOptions = [];
  const districtOptions = [];
  const hourFormat = "HH:mm";
  const province = useSelector(getProvince);

  province?.map((item) => {
    cityOptions.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    districtOptions?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const addPriceArea = () => {
    setData([
      ...data,
      {
        district: [],
        city: 0,
        value: 0,
        type_increase: "",
        price_option_rush_day: [
          {
            rush_days: [],
            start_time: "",
            end_time: "",
            time_zone_apply: 7,
            type_increase: "",
            value: 0,
          },
        ],
        price_option_holiday: [
          {
            time_start: "",
            time_end: "",
            type_increase: "",
            value: 0,
          },
        ],
      },
    ]);
  };

  const changeCityPriceArea = (value, district, index) => {
    setDataDistrict(district);
    const newArr = [...data];
    data[index].city = value;
    setData(newArr);
  };

  const changeDistrictPriceArea = (value, index) => {
    const newArr = [...data];
    data[index].district = value;
    setData(newArr);
  };

  const changeTypeIncreasePriceArea = (value, index) => {
    const newArr = [...data];
    data[index].type_increase = value;
    setData(newArr);
  };

  const changeValuePriceArea = (value, index) => {
    const newArr = [...data];
    data[index].value = value;
    setData(newArr);
  };

  //priceRushDay

  const changeDayPriceRushDay = (value, index, indexRush) => {
    const arr = [...data];
    data[index].price_option_rush_day[indexRush].rush_days = value;
    setData(arr);
  };

  const changeTypeIncreasePriceRushDay = (value, index, indexRush) => {
    const newArr = [...data];
    data[index].price_option_rush_day[indexRush].type_increase = value;
    setData(newArr);
  };

  const changeValurPriceRushDay = (value, index, indexRush) => {
    const newArr = [...data];
    data[index].price_option_rush_day[indexRush].value = value;
    setData(newArr);
  };

  return (
    <div>
      <h6>Chỉnh sửa giá</h6>

      <div>
        {data?.map((item, index) => {
          return (
            <>
              <div key={index} className="div-list-edit-price">
                <InputCustom
                  select={true}
                  title="Tỉnh/Thành phố"
                  className="select-province"
                  options={cityOptions}
                  onChange={(value, label) => {
                    changeCityPriceArea(value, label?.district, index);
                  }}
                />
                <InputCustom
                  select={true}
                  title="Quận/huyện"
                  className="select-province"
                  options={districtOptions}
                  mode="multiple"
                  onChange={(e) => changeDistrictPriceArea(e, index)}
                />
                <InputCustom
                  title="Giá trị"
                  className="select-province"
                  type="number"
                  onChange={(e) => changeValuePriceArea(e, index)}
                />
                <InputCustom
                  title="Loại"
                  select={true}
                  className="select-province"
                  onChange={(e) => changeTypeIncreasePriceArea(e, index)}
                  options={[
                    { value: "amount", label: "Thay đổi giá" },
                    {
                      value: "amount_by_root",
                      label: "Lấy theo giá gốc",
                    },
                    {
                      value: "percent_by_root",
                      label: "Phần trăm trên giá gốc",
                    },
                  ]}
                />
                <div className="div-rush-holiday-day">
                  <div className="div-price-rush-day">
                    <h6>Giá ngày cao điểm</h6>
                    {item?.price_option_rush_day?.map((itemRusd, indexRush) => {
                      return (
                        <div key={indexRush}>
                          <InputCustom
                            select={true}
                            title="Thứ trong tuần"
                            mode="multiple"
                            className="select-date"
                            options={dateOptions}
                            onChange={(e) =>
                              changeDayPriceRushDay(e, index, indexRush)
                            }
                          />
                          <InputCustom
                            title="Loại"
                            select={true}
                            className="select-date"
                            onChange={(e) =>
                              changeTypeIncreasePriceRushDay(
                                e,
                                index,
                                indexRush
                              )
                            }
                            options={[
                              {
                                value: "amount_accumulate",
                                label: "Tăng theo giá tiền",
                              },
                              {
                                value: "percent_accumulate",
                                label: "Tăng theo phần trăm",
                              },
                            ]}
                          />
                          <InputCustom
                            title="Giá trị"
                            type="number"
                            className="select-date"
                            onChange={(e) =>
                              changeValurPriceRushDay(e, index, indexRush)
                            }
                          />
                          <div
                            style={{
                              flexDirection: "column",
                              display: "flex",
                              marginTop: 4,
                            }}
                          >
                            <a style={{ fontSize: 12 }}>Giờ bắt đầu</a>
                            <TimePicker
                              className="select-date"
                              defaultOpenValue={dayjs("00:00", hourFormat)}
                              format={hourFormat}
                              onChange={(time, timeString) => {}}
                            />
                          </div>
                          <div
                            style={{
                              flexDirection: "column",
                              display: "flex",
                              marginTop: 4,
                            }}
                          >
                            <a style={{ fontSize: 12 }}>Giờ kết thúc</a>
                            <TimePicker
                              className="select-date"
                              defaultOpenValue={dayjs("00:00", hourFormat)}
                              format={hourFormat}
                              onChange={(time, timeString) => {}}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="div-price-rush-day">
                    <h6>Giá ngày lễ</h6>
                    {item?.price_option_rush_day?.map((itemRusd, indexRush) => {
                      return (
                        <div key={indexRush}>
                          {/* <InputCustom
                            title="Thứ trong tuần"
                            mode="multiple"
                            className="select-date"
                            options={dateOptions}
                          /> */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          );
        })}
        <Button style={{ width: "auto", marginTop: 10 }} onClick={addPriceArea}>
          Thêm
        </Button>
      </div>
    </div>
  );
};

export default EditPrice;

const dateOptions = [
  {
    value: 1,
    label: "Thứ Hai",
  },
  {
    value: 2,
    label: "Thứ Ba",
  },
  {
    value: 3,
    label: "Thứ Tư",
  },
  {
    value: 4,
    label: "Thứ Năm",
  },
  {
    value: 5,
    label: "Thứ Sáu",
  },
  {
    value: 6,
    label: "Thứ Bảy",
  },
  {
    value: 0,
    label: "Chủ Nhật",
  },
];
