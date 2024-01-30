import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  FloatButton,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { editExtendOptionApi } from "../../../../../api/service";
import LoadingPagination from "../../../../../components/paginationLoading";
import InputCustom from "../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../helper/toast";
import { getProvince } from "../../../../../redux/selectors/service";
import "./styles.scss";
import { getLanguageState } from "../../../../../redux/selectors/auth";
const { Option } = Select;

const EditPrice = () => {
  const { state } = useLocation();
  const { id, data_price, title } = state || {};
  const [dataDistrict, setDataDistrict] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      area_lv_1: 0,
      is_active: false,
      platform_fee: 0,
      price: 0,
      price_type_increase: "",
      area_lv_2: [
        {
          area_lv_2: [],
          is_active: false,
          is_platform_fee: false,
          platform_fee: 0,
          price: 0,
        },
      ],
      price_option_holiday: [
        {
          time_start: "",
          time_end: "",
          price: 0,
          price_type_increase: "",
        },
      ],
      price_option_rush_day: [
        {
          start_time: "00:00",
          end_time: "00:00",
          price: 0,
          price_type_increase: "",
          time_zone_apply: 7,
          rush_days: [],
        },
      ],
    },
  ]);
  const province = useSelector(getProvince);
  const lang = useSelector(getLanguageState);
  const cityOption = [];
  const districtOption = [];
  const hourFormat = "HH:mm";
  const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    setData(data_price);
  }, [data_price]);

  data_price?.forEach((item) => {
    province?.forEach((itemProvince) => {
      if (item?.area_lv_1 === itemProvince?.code) {
        itemProvince?.districts?.forEach((district) => {
          districtOption?.push({
            value: district?.code,
            label: district?.name,
          });
          return;
        });
      }
    });
  });

  province?.map((item) => {
    return cityOption.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    return districtOption?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onAddPriceArea = () => {
    setData([
      ...data,
      {
        area_lv_1: 0,
        is_active: false,
        platform_fee: 0,
        price: 0,
        price_type_increase: "",
        price_option_holiday: [
          {
            time_start: moment().toISOString(),
            time_end: moment().toISOString(),
            price: 0,
            price_type_increase: "",
          },
        ],
        price_option_rush_day: [
          {
            start_time: "00:00",
            end_time: "00:00",
            price: 0,
            price_type_increase: "",
            time_zone_apply: 0,
            rush_days: [],
          },
        ],
        area_lv_2: [
          {
            area_lv_2: [],
            is_active: false,
            is_platform_fee: false,
            platform_fee: 0,
            price: 0,
          },
        ],
      },
    ]);
  };

  const deletePriceArea = (index) => {
    data.splice(index, 1);
    setData([...data]);
  };

  const onChangeCity = (value, index, item) => {
    const arr = [...data];
    data[index].area_lv_1 = value;
    setData(arr);
    setDataDistrict(item?.districts);
  };

  const onChangeFee = (value, index) => {
    const arr = [...data];
    data[index].platform_fee = value;
    setData(arr);
  };

  const onChangePrice = (value, index) => {
    const arr = [...data];
    data[index].price = value;
    setData(arr);
  };

  const onChangeType = (value, index) => {
    const arr = [...data];
    data[index].price_type_increase = value;
    setData(arr);
  };

  const onChangeActivity = (value, index) => {
    const arr = [...data];
    data[index].onChangeActivity = value;
    setData(arr);
  };

  //area_lv_2
  const addAreaLevelTwo = (index) => {
    const arr = [...data];
    data[index].area_lv_2.push({
      area_lv_2: [],
      is_active: false,
      is_platform_fee: false,
      platform_fee: 0,
      price: 0,
    });

    setData(arr);
  };
  const deletePriceAreaLevelTwo = (index, indexDistrict) => {
    data[index].area_lv_2.splice(indexDistrict, 1);
    setData([...data]);
  };

  const onChangeDistrict = (value, index, indexDistrict) => {
    const arr = [...data];
    data[index].area_lv_2[indexDistrict].area_lv_2 = value;
    setData(arr);
  };

  const onChangeDistrictPrice = (value, index, indexDistrict) => {
    const arr = [...data];
    data[index].area_lv_2[indexDistrict].price = value;
    setData(arr);
  };

  const onChangePlatformFeeDistrict = (value, index, indexDistrict) => {
    const arr = [...data];
    data[index].area_lv_2[indexDistrict].platform_fee = value;
    setData(arr);
  };

  const onChangeIsFeeDistrict = (value, index, indexDistrict) => {
    const arr = [...data];
    data[index].area_lv_2[indexDistrict].is_platform_fee = value;
    setData(arr);
  };

  const onChangeActivityDistrict = (value, index, indexDistrict) => {
    const arr = [...data];
    data[index].area_lv_2[indexDistrict].is_active = value;
    setData(arr);
  };

  //priceHoliday
  const onAddPriceHoliday = (index) => {
    const arr = [...data];
    data[index].price_option_holiday.push({
      time_start: moment().toISOString(),
      time_end: moment().toISOString(),
      price: 0,
      price_type_increase: "",
    });
    setData(arr);
  };

  const onDeletePriceHoliday = (index, indexHoliday) => {
    data[index].price_option_holiday.splice(indexHoliday, 1);
    setData([...data]);
  };

  const onChangeTimeStartHoliday = (value, index, indexHoliday) => {
    const arr = [...data];
    data[index].price_option_holiday[indexHoliday].time_start = moment(
      value?.$d
    ).toISOString();
    setData(arr);
  };

  const onChangeTimeEndHoliday = (value, index, indexHoliday) => {
    const arr = [...data];
    data[index].price_option_holiday[indexHoliday].time_end = moment(
      value?.$d
    ).toISOString();
    setData(arr);
  };

  const onChangePriceHoliday = (value, index, indexHoliday) => {
    const arr = [...data];
    data[index].price_option_holiday[indexHoliday].price = value;
    setData(arr);
  };

  const onChangeTypeHoliday = (value, index, indexHoliday) => {
    const arr = [...data];
    data[index].price_option_holiday[indexHoliday].price_type_increase = value;
    setData(arr);
  };

  //rushday
  const onAddRushDayPrice = (index) => {
    const arr = [...data];
    data[index].price_option_rush_day.push({
      start_time: "00:00",
      end_time: "00:00",
      price: 0,
      price_type_increase: "",
      time_zone_apply: 7,
      rush_days: [],
    });
    setData(arr);
  };

  const onDeletePriceRush = (index, indexRush) => {
    data[index].price_option_rush_day.splice(indexRush, 1);
    setData([...data]);
  };
  const onChangeDayRush = (value, index, indexRush) => {
    const arr = [...data];
    data[index].price_option_rush_day[indexRush].rush_days = value;
    setData(arr);
  };

  const onChangeTimeStartRush = (value, index, indexRush) => {
    const arr = [...data];
    data[index].price_option_rush_day[indexRush].start_time =
      value + ":00.000Z";
    setData(arr);
  };
  const onChangeTimeEndRush = (value, index, indexRush) => {
    const arr = [...data];
    data[index].price_option_rush_day[indexRush].end_time = value + ":00.000Z";
    setData(arr);
  };

  const onChangePriceRush = (value, index, indexRush) => {
    const arr = [...data];
    data[index].price_option_rush_day[indexRush].price = value;
    setData(arr);
  };

  const onChangeTypeRush = (value, index, indexRush) => {
    const arr = [...data];
    data[index].price_option_rush_day[indexRush].price_type_increase = value;
    setData(arr);
  };

  const onEditExtend = () => {
    setIsLoading(true);
    editExtendOptionApi(id, {
      area_fee: data,
    })
      .then((res) => {
        setIsLoading(false);
        setData(res?.area_fee);
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        setIsLoading(false);
      });
  };
  return (
    <div className="div-container-edit-price">
      <div className="div-head-edit-price">
        <h6>Chỉnh sửa giá {title[lang]}</h6>
        <Button
          type="primary"
          className="btn-edit-price"
          onClick={onEditExtend}
        >
          Chỉnh sửa
        </Button>
      </div>

      <div className="div-list-price">
        {data?.map((item, index) => {
          return (
            <>
              <div key={index} className="div-list-item">
                <div className="div-item-city-price">
                  <div className="div-input">
                    <p className="label-input">Tỉnh/Thành phố</p>
                    <Select
                      options={cityOption}
                      style={{ width: "100%" }}
                      value={item?.area_lv_1}
                      onChange={(e, label) => onChangeCity(e, index, label)}
                    />
                  </div>
                  <InputCustom
                    title="Phí dịch vụ"
                    value={item?.platform_fee}
                    onChange={(e) => onChangeFee(e.target.value, index)}
                  />
                  <InputCustom
                    title="Giá trị"
                    value={item?.price}
                    inputMoney={true}
                    style={{ width: "auto" }}
                    onChange={(e) => onChangePrice(e, index)}
                  />
                  <div className="div-input">
                    <p className="label-input">Loại</p>
                    <Select
                      style={{ width: "100%" }}
                      value={item?.price_type_increase}
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
                      onChange={(e) => onChangeType(e, index)}
                    />
                  </div>
                  <div className="div-input">
                    <p className="label-input">Hoạt động</p>
                    <Switch
                      checked={item.is_active}
                      size="small"
                      style={{ width: 20, marginTop: 5 }}
                      onChange={(e) => onChangeActivity(e, index)}
                    />
                  </div>
                </div>
                <div className="div-day-price">
                  <div className="div-holiday-price">
                    <p className="m-0">Theo ngày lễ</p>
                    {item?.price_option_holiday?.map(
                      (itemHoliday, indexHoliday) => {
                        const timeStart = moment(itemHoliday?.time_start)
                          .utc()
                          .format(dateFormat);
                        const timeEnd = moment(itemHoliday?.time_end)
                          .utc()
                          .format(dateFormat);
                        return (
                          <>
                            <div
                              className="div-item-holiday-price"
                              key={indexHoliday}
                            >
                              <div className="div-chose-date">
                                <div className="div-date-pick">
                                  <p className="label-pick">Ngày bắt đầu</p>
                                  <DatePicker
                                    format={dateFormat}
                                    allowClear={false}
                                    value={dayjs(timeStart, dateFormat)}
                                    onChange={(date) =>
                                      onChangeTimeStartHoliday(
                                        date,
                                        index,
                                        indexHoliday
                                      )
                                    }
                                  />
                                </div>
                                <div className="div-date-pick">
                                  <p className="label-pick">Ngày kết thúc</p>
                                  <DatePicker
                                    format={dateFormat}
                                    allowClear={false}
                                    value={dayjs(timeEnd, dateFormat)}
                                    onChange={(date) =>
                                      onChangeTimeEndHoliday(
                                        date,
                                        index,
                                        indexHoliday
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="div-chose-row">
                                <div className="div-input-holiday ">
                                  <p className="label-input">Giá trị</p>
                                  {itemHoliday?.price_type_increase ===
                                  "amount_accumulate" ? (
                                    <InputNumber
                                      style={{ width: "95%" }}
                                      addonAfter="đ"
                                      defaultValue={itemHoliday?.price}
                                      min={0}
                                      formatter={(value) =>
                                        `${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ","
                                        )
                                      }
                                      onChange={(e) =>
                                        onChangePriceHoliday(
                                          e,
                                          index,
                                          indexHoliday
                                        )
                                      }
                                    />
                                  ) : (
                                    <InputNumber
                                      style={{ width: "95%" }}
                                      addonAfter="%"
                                      min={0}
                                      max={100}
                                      value={itemHoliday?.price}
                                      onChange={(e) =>
                                        onChangePriceHoliday(
                                          e,
                                          index,
                                          indexHoliday
                                        )
                                      }
                                    />
                                  )}
                                </div>
                                <div className="div-input-holiday ">
                                  <InputCustom
                                    title="Loại"
                                    select={true}
                                    value={itemHoliday?.price_type_increase}
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
                                    style={{ width: "100%" }}
                                    onChange={(e) =>
                                      onChangeTypeHoliday(
                                        e,
                                        index,
                                        indexHoliday
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <Button
                              className="btn-delete-price-holiday"
                              onClick={() =>
                                onDeletePriceHoliday(index, indexHoliday)
                              }
                            >
                              Xoá
                            </Button>
                          </>
                        );
                      }
                    )}
                    <Button
                      className="btn-add-price-holiday"
                      onClick={() => onAddPriceHoliday(index)}
                    >
                      Thêm giá ngày lễ
                    </Button>
                  </div>
                  <div className="div-rush-day-price">
                    <p className="m-0">Theo ngày trong tuần</p>
                    {item?.price_option_rush_day?.map((itemRush, indexRush) => {
                      return (
                        <>
                          <div
                            className="div-item-rush-day-price"
                            key={indexRush}
                          >
                            <InputCustom
                              title="Chọn thứ"
                              select={true}
                              options={dateOptions}
                              mode="multiple"
                              value={itemRush?.rush_days}
                              onChange={(e) =>
                                onChangeDayRush(e, index, indexRush)
                              }
                            />
                            <div className="div-chose-time">
                              <div className="div-input-time">
                                <p className="label-time">Thời gian bắt đầu</p>
                                <TimePicker
                                  defaultValue={dayjs(
                                    itemRush?.start_time.slice(0, 5),
                                    hourFormat
                                  )}
                                  format={hourFormat}
                                  style={{ width: "100%" }}
                                  allowClear={false}
                                  onChange={(time, timeString) =>
                                    onChangeTimeStartRush(
                                      timeString,
                                      index,
                                      indexRush
                                    )
                                  }
                                />
                              </div>
                              <div className="div-input-time">
                                <p className="label-time">Thời gian kết thúc</p>
                                <TimePicker
                                  defaultValue={dayjs(
                                    itemRush?.end_time.slice(0, 5),
                                    hourFormat
                                  )}
                                  format={hourFormat}
                                  style={{ width: "100%" }}
                                  allowClear={false}
                                  onChange={(time, timeString) =>
                                    onChangeTimeEndRush(
                                      timeString,
                                      index,
                                      indexRush
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="div-chose-row">
                              <div className="div-input-rush">
                                {/* <InputCustom
                                  title="Giá trị"
                                  value={itemRush?.price}
                                  inputMoney={true}
                                  style={{ width: "100%" }}
                                  onChange={(e) =>
                                    onChangePriceRush(e, index, indexRush)
                                  }
                                /> */}
                                <p className="label-input">Giá trị</p>
                                {itemRush?.price_type_increase ===
                                "amount_accumulate" ? (
                                  <InputNumber
                                    style={{ width: "95%" }}
                                    addonAfter="đ"
                                    value={itemRush?.price}
                                    min={0}
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    onChange={(e) =>
                                      onChangePriceRush(e, index, indexRush)
                                    }
                                  />
                                ) : (
                                  <InputNumber
                                    style={{ width: "95%" }}
                                    addonAfter="%"
                                    min={0}
                                    max={100}
                                    value={itemRush?.price}
                                    onChange={(e) =>
                                      onChangePriceRush(e, index, indexRush)
                                    }
                                  />
                                )}
                              </div>
                              <div className="div-input-rush">
                                <InputCustom
                                  title="Loại"
                                  value={itemRush?.price_type_increase}
                                  select={true}
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
                                  style={{ width: "100%" }}
                                  onChange={(e) =>
                                    onChangeTypeRush(e, index, indexRush)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            className="btn-delete-price-rush-day"
                            onClick={() => onDeletePriceRush(index, indexRush)}
                          >
                            Xoá
                          </Button>
                        </>
                      );
                    })}
                    <Button
                      className="btn-add-price-rush-day"
                      onClick={() => onAddRushDayPrice(index)}
                    >
                      Thêm giá ngày{" "}
                    </Button>
                  </div>
                </div>
                <div className="div-district">
                  <div className="div-list-district-price">
                    <p className="m-0">Theo quận/ huyện</p>
                    {item?.area_lv_2?.map((district, indexDistrict) => {
                      return (
                        <>
                          <div
                            key={indexDistrict}
                            className="div-item-district"
                          >
                            <div className="div-input">
                              <p className="label-input">Quận/Huyện</p>
                              <Select
                                options={districtOption}
                                value={district?.area_lv_2}
                                mode="multiple"
                                showSearch={true}
                                filterOption={(input, option) =>
                                  (option?.label ?? "").includes(input)
                                }
                                onChange={(e) =>
                                  onChangeDistrict(e, index, indexDistrict)
                                }
                              />
                            </div>
                            <InputCustom
                              title="Giá trị"
                              value={district?.price}
                              inputMoney={true}
                              style={{ width: "auto" }}
                              onChange={(e) =>
                                onChangeDistrictPrice(e, index, indexDistrict)
                              }
                            />
                            <div className="div-input">
                              <Checkbox
                                checked={district?.is_platform_fee}
                                onChange={(e) =>
                                  onChangeIsFeeDistrict(
                                    e.target.checked,
                                    index,
                                    indexDistrict
                                  )
                                }
                              >
                                Phí dịch vụ
                              </Checkbox>
                              <Input
                                value={district.platform_fee}
                                style={{ width: "50%" }}
                                onChange={(e) =>
                                  onChangePlatformFeeDistrict(
                                    e.target.value,
                                    index,
                                    indexDistrict
                                  )
                                }
                              />
                            </div>
                            <div className="div-input">
                              <p className="label-input">Hoạt động</p>
                              <Switch
                                checked={district.is_active}
                                size="small"
                                style={{ width: 20, marginTop: 5 }}
                                onChange={(e) =>
                                  onChangeActivityDistrict(
                                    e,
                                    index,
                                    indexDistrict
                                  )
                                }
                              />
                            </div>
                          </div>

                          <Button
                            size="small"
                            className="btn-delete-area-price"
                            onClick={() =>
                              deletePriceAreaLevelTwo(index, indexDistrict)
                            }
                          >
                            Xoá
                          </Button>
                        </>
                      );
                    })}
                  </div>
                  <Button
                    icon={<PlusOutlined />}
                    size="small"
                    className="btn-add-district-price-service"
                    onClick={() => addAreaLevelTwo(index)}
                  >
                    Thêm quận
                  </Button>
                </div>
              </div>
              {index !== 0 && (
                <Button
                  size="small"
                  className="btn-delete-area-price"
                  onClick={() => deletePriceArea(index)}
                >
                  Xoá
                </Button>
              )}
            </>
          );
        })}
      </div>
      <Button
        icon={<PlusOutlined />}
        size="small"
        className="btn-add-price-service"
        onClick={onAddPriceArea}
      >
        Thêm
      </Button>

      <FloatButton.BackTop visibilityHeight={0} />
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
