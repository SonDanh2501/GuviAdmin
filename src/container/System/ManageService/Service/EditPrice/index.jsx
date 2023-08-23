import { useLocation } from "react-router-dom";
import "./styles.scss";
import { useEffect, useState } from "react";
import InputCustom from "../../../../../components/textInputCustom";
import { useSelector } from "react-redux";
import { getProvince } from "../../../../../redux/selectors/service";
import { Button, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { errorNotify } from "../../../../../helper/toast";
import { editExtendOptionApi } from "../../../../../api/service";
import LoadingPagination from "../../../../../components/paginationLoading";

const EditPrice = () => {
  const { state } = useLocation();
  const { id, data_price } = state || {};
  const [dataDistrict, setDataDistrict] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      district: [],
      city: 0,
      value: 0,
      type_increase: "",
      price_option_rush_day: [
        {
          rush_days: [],
          start_time: "00:00",
          end_time: "00:30",
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
  const dateFormat = "YYYY-MM-DD";
  const province = useSelector(getProvince);

  useEffect(() => {
    setData(data_price);
  }, [data_price]);

  data_price?.forEach((item) => {
    province?.forEach((itemProvince) => {
      if (item?.city === itemProvince?.code) {
        itemProvince?.districts?.forEach((district) => {
          districtOptions?.push({
            value: district?.code,
            label: district?.name,
          });
          return;
        });
      }
    });
  });

  province?.map((item) => {
    return cityOptions.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    return districtOptions?.push({
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
            start_time: "00:00",
            end_time: "00:30",
            time_zone_apply: 7,
            type_increase: "",
            value: 0,
          },
        ],
        price_option_holiday: [
          {
            time_start: moment().toISOString(),
            time_end: moment().toISOString(),
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
    data[index].value = Number(value);
    setData(newArr);
  };

  const deletePriceArea = (index) => {
    data.splice(index, 1);
    setData([...data]);
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
    data[index].price_option_rush_day[indexRush].value = Number(value);
    setData(newArr);
  };

  const changeStartTimePriceRushDay = (value, index, indexRush) => {
    const newArr = [...data];
    data[index].price_option_rush_day[indexRush].start_time =
      value + ":00.000Z";
    setData(newArr);
  };

  const changeEndTimePriceRushDay = (value, index, indexRush) => {
    const newArr = [...data];
    data[index].price_option_rush_day[indexRush].end_time = value + ":00.000Z";
    setData(newArr);
  };

  const addPriceRushDay = (index) => {
    const arr = [...data];
    data[index].price_option_rush_day.push({
      rush_days: [],
      start_time: "",
      end_time: "",
      time_zone_apply: 7,
      type_increase: "",
      value: 0,
    });

    setData(arr);
  };

  const deletePriceRushDay = (index, indexRush) => {
    data[index].price_option_rush_day.splice(indexRush, 1);
    setData([...data]);
  };

  //priceHoliday

  const addPriceHoliday = (index) => {
    const arr = [...data];
    data[index].price_option_holiday.push({
      time_start: "",
      time_end: "",
      type_increase: "",
      value: 0,
    });
    setData(arr);
  };

  const deletePriceHoliday = (index, indexHoliday) => {
    data[index].price_option_holiday.splice(indexHoliday, 1);
    setData([...data]);
  };

  const changeStartTimePriceHoliday = (value, index, indexHoliday) => {
    const arr = [...data];
    data[index].price_option_holiday[indexHoliday].time_start = value;
    setData(arr);
  };

  const changeEndTimePriceHoliday = (value, index, indexHoliday) => {
    const arr = [...data];
    data[index].price_option_holiday[indexHoliday].time_end = value;
    setData(arr);
  };

  const changeTypeIncreasePriceHoliday = (value, index, indexRush) => {
    const newArr = [...data];
    data[index].price_option_holiday[indexRush].type_increase = value;
    setData(newArr);
  };
  const changeValuePriceHoliday = (value, index, indexRush) => {
    const newArr = [...data];
    data[index].price_option_holiday[indexRush].value = Number(value);
    setData(newArr);
  };

  const onEditExtend = () => {
    setIsLoading(true);
    editExtendOptionApi(id, {
      price_option_area: data,
    })
      .then((res) => {
        setIsLoading(false);
        setData(res?.price_option_area);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h6>Chỉnh sửa giá</h6>
      <Button onClick={onEditExtend}>Cập nhật</Button>

      <div>
        {data?.map((item, index) => {
          return (
            <div key={index}>
              <div className="div-list-edit-price">
                <InputCustom
                  select={true}
                  title="Tỉnh/Thành phố"
                  className="select-province"
                  value={item?.city}
                  options={cityOptions}
                  onChange={(value, label) => {
                    changeCityPriceArea(value, label?.district, index);
                  }}
                />
                <InputCustom
                  select={true}
                  value={item?.district}
                  title="Quận/huyện"
                  className="select-province"
                  options={districtOptions.filter((item, index) => {
                    return (
                      index ===
                      districtOptions.findIndex((obj) => {
                        return item?.value === obj.value;
                      })
                    );
                  })}
                  mode="multiple"
                  onChange={(e) => changeDistrictPriceArea(e, index)}
                />
                <InputCustom
                  title="Giá trị"
                  className="select-province"
                  type="number"
                  value={item?.value}
                  onChange={(e) => changeValuePriceArea(e.target.value, index)}
                />
                <InputCustom
                  title="Loại"
                  select={true}
                  value={item?.type_increase}
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
                        <div key={indexRush} className="div-price">
                          <InputCustom
                            select={true}
                            value={itemRusd?.rush_days}
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
                            value={itemRusd?.type_increase}
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
                            value={itemRusd?.value}
                            onChange={(e) =>
                              changeValurPriceRushDay(
                                e.target.value,
                                index,
                                indexRush
                              )
                            }
                          />
                          <div
                            style={{
                              flexDirection: "column",
                              display: "flex",
                              marginTop: 4,
                            }}
                          >
                            <p style={{ fontSize: 12, margin: 0 }}>
                              Giờ bắt đầu
                            </p>
                            <TimePicker
                              className="select-date"
                              value={dayjs(
                                itemRusd?.start_time?.slice(0, 5),
                                hourFormat
                              )}
                              format={hourFormat}
                              onChange={(time, timeString) => {
                                changeStartTimePriceRushDay(
                                  timeString,
                                  index,
                                  indexRush
                                );
                              }}
                            />
                          </div>
                          <div
                            style={{
                              flexDirection: "column",
                              display: "flex",
                              marginTop: 4,
                            }}
                          >
                            <p style={{ fontSize: 12, margin: 0 }}>
                              Giờ kết thúc
                            </p>
                            <TimePicker
                              className="select-date"
                              format={hourFormat}
                              value={dayjs(
                                itemRusd?.end_time?.slice(0, 5),
                                hourFormat
                              )}
                              onChange={(time, timeString) => {
                                changeEndTimePriceRushDay(
                                  timeString,
                                  index,
                                  indexRush
                                );
                              }}
                            />
                          </div>
                          {indexRush !== 0 && (
                            <Button
                              style={{ marginTop: 5, width: "20%" }}
                              onClick={() =>
                                deletePriceRushDay(index, indexRush)
                              }
                            >
                              Xoá
                            </Button>
                          )}
                        </div>
                      );
                    })}
                    <Button
                      style={{
                        width: "15%",
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => addPriceRushDay(index)}
                    >
                      Thêm
                    </Button>
                  </div>
                  <div className="div-price-rush-day">
                    <h6>Giá ngày lễ</h6>
                    {item?.price_option_holiday?.map(
                      (itemHoliday, indexHoliday) => {
                        return (
                          <div key={indexHoliday} className="div-price">
                            <div
                              style={{
                                flexDirection: "column",
                                display: "flex",
                                marginTop: 4,
                              }}
                            >
                              <p style={{ fontSize: 12, margin: 0 }}>
                                Ngày bắt đầu
                              </p>
                              <DatePicker
                                format={dateFormat}
                                value={dayjs(
                                  itemHoliday?.time_start?.slice(0, 11),
                                  dateFormat
                                )}
                                onChange={(date, dateString) =>
                                  changeStartTimePriceHoliday(
                                    moment(moment(dateString).toISOString())
                                      .add(7, "hours")
                                      .toISOString(),
                                    index,
                                    indexHoliday
                                  )
                                }
                              />
                            </div>
                            <div
                              style={{
                                flexDirection: "column",
                                display: "flex",
                                marginTop: 4,
                              }}
                            >
                              <p style={{ fontSize: 12, margin: 0 }}>
                                Ngày kết thúc
                              </p>
                              <DatePicker
                                format={dateFormat}
                                value={dayjs(
                                  itemHoliday?.time_end?.slice(0, 11),
                                  dateFormat
                                )}
                                onChange={(date, dateString) =>
                                  changeEndTimePriceHoliday(
                                    moment(moment(dateString).toISOString())
                                      .add(7, "hours")
                                      .toISOString(),
                                    index,
                                    indexHoliday
                                  )
                                }
                              />
                            </div>
                            <InputCustom
                              title="Loại"
                              select={true}
                              className="select-date"
                              value={itemHoliday?.type_increase}
                              onChange={(e) =>
                                changeTypeIncreasePriceHoliday(
                                  e,
                                  index,
                                  indexHoliday
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
                              value={itemHoliday?.value}
                              onChange={(e) =>
                                changeValuePriceHoliday(
                                  e.target.value,
                                  index,
                                  indexHoliday
                                )
                              }
                            />
                            {indexHoliday !== 0 && (
                              <Button
                                style={{ marginTop: 5, width: "20%" }}
                                onClick={() =>
                                  deletePriceHoliday(index, indexHoliday)
                                }
                              >
                                Xoá
                              </Button>
                            )}
                          </div>
                        );
                      }
                    )}
                    <Button
                      style={{
                        width: "15%",
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => addPriceHoliday(index)}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
              {index !== 0 && (
                <Button
                  style={{ width: "auto", marginTop: 5 }}
                  onClick={() => deletePriceArea(index)}
                >
                  Xoá
                </Button>
              )}
            </div>
          );
        })}
        <Button style={{ width: "auto", marginTop: 10 }} onClick={addPriceArea}>
          Thêm
        </Button>
      </div>

      {isLoading && <LoadingPagination />}
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
