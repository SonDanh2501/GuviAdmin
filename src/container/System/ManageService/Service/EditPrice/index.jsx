import { useLocation } from "react-router-dom";
import "./styles.scss";
import { useEffect, useState } from "react";
import InputCustom from "../../../../../components/textInputCustom";
import { useSelector } from "react-redux";
import { getProvince } from "../../../../../redux/selectors/service";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { errorNotify } from "../../../../../helper/toast";
import { editExtendOptionApi } from "../../../../../api/service";
import LoadingPagination from "../../../../../components/paginationLoading";
import { PlusOutlined } from "@ant-design/icons";

const EditPrice = () => {
  const { state } = useLocation();
  const { id, data_price } = state || {};
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
          time_zone_apply: 0,
          price_type_increase: "",
          rush_days: [],
        },
      ],
    },
  ]);
  const province = useSelector(getProvince);
  const cityOption = [];
  const districtOption = [];
  const hourFormat = "HH:mm";
  const dateFormat = "YYYY-MM-DD";

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
            price_type_increase: "",
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

  const onChangeCity = (value, index) => {
    const arr = [...data];
    data[index].area_lv_1 = value;
    setData(arr);
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

  const onEditExtend = () => {
    setIsLoading(true);
    editExtendOptionApi(id, {
      area_fee: data,
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
                      onChange={(e) => onChangeCity(e, index)}
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
                    onChange={(e) => onChangePrice(e.tartget.value, index)}
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
                    />
                  </div>
                </div>
                <div className="div-district">
                  <div className="div-list-district-price">
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
                              />
                            </div>
                            <InputCustom
                              title="Phí dịch vụ"
                              value={district?.price}
                              inputMoney={true}
                              style={{ width: "auto" }}
                            />
                            <div className="div-input">
                              <Checkbox checked={district?.is_platform_fee}>
                                Phí dịch vụ
                              </Checkbox>
                              <Input
                                value={district.platform_fee}
                                style={{ width: "50%" }}
                              />
                            </div>
                            <div className="div-input">
                              <p className="label-input">Hoạt động</p>
                              <Switch
                                checked={district.is_active}
                                size="small"
                                style={{ width: 20, marginTop: 5 }}
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
