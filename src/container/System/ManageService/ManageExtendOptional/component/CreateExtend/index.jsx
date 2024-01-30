import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Image,
  Input,
  Row,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { postFile } from "../../../../../../api/file";
import {
  createExtendOptionApi,
  getExtendByOptionalApi,
} from "../../../../../../api/service";
import LoadingPagination from "../../../../../../components/paginationLoading";
import resizeFile from "../../../../../../helper/resizer";
import { errorNotify } from "../../../../../../helper/toast";
import { getProvince } from "../../../../../../redux/selectors/service";
import "./styles.scss";

const CreateExtend = ({ idOption, setData }) => {
  const [open, setOpen] = useState(false);
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailActive, setThumbnailActive] = useState("");
  const [position, setPosition] = useState("");
  const [price, setPrice] = useState();
  const [estimate, setEstimate] = useState();
  const [isPlatformFee, setIsPlatformFee] = useState(false);
  const [platformFee, setPlatformFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInApp, setShowInApp] = useState(false);
  const [isPriceArea, setIsPriceArea] = useState(false);
  const [dataDistrict, setDataDistrict] = useState([]);
  const districtData = [];
  const cityData = [];
  const province = useSelector(getProvince);
  const [priceArea, setPriceArea] = useState([
    {
      district: [],
      city: "",
      value: "",
      type_increase: "",
    },
  ]);
  const [isPriceHoliday, setIsPriceHoliday] = useState(false);
  const [priceHoliday, setPriceHoliday] = useState([
    {
      time_end: moment().toISOString(),
      time_start: moment().toISOString(),
      type_increase: "",
      value: "",
    },
  ]);
  const [isPriceRushDay, setIsPriceRushDay] = useState(false);
  const [priceRushDay, setPriceRushDay] = useState([
    {
      rush_day: [],
      type_increase: "",
      value: "",
    },
  ]);
  const [isPriceRushHour, setIsPriceRushHour] = useState(false);
  const [priceRushHour, setPriceRushHour] = useState([
    {
      time_end: "",
      time_start: "",
      type_increase: "",
      value: "",
    },
  ]);

  const dateFormat = "YYYY-MM-DD";
  const hourFormat = "HH:mm";

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  province?.map((item) => {
    return cityData?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    return districtData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onChangeThumbnail = async (e) => {
    setIsLoading(true);
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setThumbnail(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file, extend);
      const formData = new FormData();
      formData.append("multi-files", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setThumbnail(res[0]);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
          });
        });
    } catch (err) {
      setIsLoading(false);
    }
  };

  const onChangeThumbnailActive = async (e) => {
    setIsLoading(true);
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setThumbnailActive(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file, extend);
      const formData = new FormData();
      formData.append("multi-files", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setThumbnailActive(res[0]);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);

          errorNotify({
            message: err?.message,
          });
        });
    } catch (err) {
      setIsLoading(false);
    }
  };
  //area
  const addPriceArea = useCallback(() => {
    setPriceArea([
      ...priceArea,
      {
        district: [],
        city: "",
        value: "",
        type_increase: "",
      },
    ]);
  }, [priceArea]);

  const deletePriceArea = useCallback(
    (index) => {
      priceArea?.splice(index, 1);
      setPriceArea([...priceArea]);
    },
    [priceArea]
  );

  const onChangeCity = useCallback(
    (value, label, index) => {
      const newArr = [...priceArea];
      setDataDistrict(label?.district);
      priceArea[index].city = value;
      setPriceArea(newArr);
    },
    [priceArea]
  );

  const onChangeDistrict = useCallback(
    (value, label, index) => {
      const newArr = [...priceArea];
      priceArea[index].district = value;
      setPriceArea(newArr);
    },
    [priceArea]
  );

  const onChangeValueArea = useCallback(
    (value, index) => {
      const newArr = [...priceArea];
      priceArea[index].value = value;
      setPriceArea(newArr);
    },
    [priceArea]
  );

  const onChangeTypeIncreaseArea = useCallback(
    (value, index) => {
      const newArr = [...priceArea];
      priceArea[index].type_increase = value;
      setPriceArea(newArr);
    },
    [priceArea]
  );

  //holiday
  const addPriceHoliday = () => {
    const start = moment().toISOString();
    setPriceHoliday([
      ...priceHoliday,
      {
        time_end: start,
        time_start: start,
        type_increase: "",
        value: "",
      },
    ]);
  };

  const onChangePriceTimeStart = (value, index) => {
    const newArr = [...priceHoliday];
    priceHoliday[index].time_start = value;
    setPriceHoliday(newArr);
  };

  const onChangePriceTimeEnd = (value, index) => {
    const newArr = [...priceHoliday];
    priceHoliday[index].time_end = value;
    setPriceHoliday(newArr);
  };

  const onChangePriceValue = (value, index) => {
    const newArr = [...priceHoliday];
    priceHoliday[index].value = value;
    setPriceHoliday(newArr);
  };

  const onChangePriceType = (value, index) => {
    const newArr = [...priceHoliday];
    priceHoliday[index].type_increase = value;
    setPriceHoliday(newArr);
  };

  const onDeletePriceHoliday = (index) => {
    priceHoliday.splice(index, 1);

    setPriceHoliday([...priceHoliday]);
  };

  //rush day
  const addRushDay = () => {
    setPriceRushDay([
      ...priceRushDay,
      {
        rush_day: [],
        type_increase: "",
        value: "",
      },
    ]);
  };

  const onChangePriceRushDay = (value, index) => {
    const newArr = [...priceRushDay];
    priceRushDay[index].rush_day = value;
    setPriceRushDay(newArr);
  };

  const onChangePriceRushDayType = (value, index) => {
    const newArr = [...priceRushDay];
    priceRushDay[index].type_increase = value;
    setPriceRushDay(newArr);
  };

  const onChangePriceRushDayValue = (value, index) => {
    const newArr = [...priceRushDay];
    priceRushDay[index].value = value;
    setPriceRushDay(newArr);
  };

  const onDeletePriceRushDay = (index) => {
    priceRushDay.splice(index, 1);

    setPriceRushDay([...priceRushDay]);
  };

  //rush hour
  const addRushHour = () => {
    setPriceRushHour([
      ...priceRushHour,
      {
        time_end: "00:00",
        time_start: "00:00",
        type_increase: "",
        value: "",
      },
    ]);
  };

  const onChangeRushHourTimeStart = (value, index) => {
    const newArr = [...priceRushHour];
    priceRushHour[index].time_start = value + ":00.000Z";
    setPriceRushHour(newArr);
  };
  const onChangeRushHourTimeEnd = (value, index) => {
    const newArr = [...priceRushHour];
    priceRushHour[index].time_end = value + ":00.000Z";
    setPriceRushHour(newArr);
  };
  const onChangeRushHourType = (value, index) => {
    const newArr = [...priceRushHour];
    priceRushHour[index].type_increase = value;
    setPriceRushHour(newArr);
  };
  const onChangeRushHourValue = (value, index) => {
    const newArr = [...priceRushHour];
    priceRushHour[index].value = value;
    setPriceRushHour(newArr);
  };
  const onDeletePriceRushHour = (index) => {
    priceRushHour.splice(index, 1);

    setPriceRushHour([...priceRushHour]);
  };

  const onCreateExtend = () => {
    setIsLoading(true);
    createExtendOptionApi({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: thumbnail,
      thumbnail_active: thumbnailActive,
      position: position,
      price: price,
      count: 1,
      note: "",
      is_price_option_area: isPriceArea,
      price_option_area: isPriceArea ? priceArea : [],
      is_price_option_rush_hour: isPriceRushHour,
      price_option_rush_hour: isPriceRushHour ? priceRushHour : [],
      is_price_option_holiday: isPriceHoliday,
      price_option_holiday: isPriceHoliday ? priceHoliday : [],
      is_price_option_rush_day: isPriceRushDay,
      price_option_rush_day: isPriceRushDay ? priceRushDay : [],
      status_default: false,
      checked: false,
      persional: 1,
      position_view: 0,
      is_show_in_app: showInApp,
      is_platform_fee: isPlatformFee,
      platform_fee: platformFee,
      id_optional_service: idOption,
      estimate: estimate,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getExtendByOptionalApi(idOption)
          .then((res) => {
            setData(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Button type="primary" onClick={showDrawer} className="btn-create-extend">
        Tạo extend
      </Button>

      <Drawer
        title="Tạo extend option"
        placement="right"
        onClose={onClose}
        open={open}
        width={1200}
        headerStyle={{ height: 50 }}
      >
        <Row>
          <Col span={7}>
            <div>
              <p className="title-input-extend">Tiêu đề</p>
              <Input
                placeholder="Nhập tiêu đề Tiếng Việt"
                value={titleVN}
                onChange={(e) => setTitleVN(e.target.value)}
              />
              <Input
                placeholder="Nhập tiêu đề Tiếng Anh"
                style={{ marginTop: 5 }}
                value={titleEN}
                onChange={(e) => setTitleEN(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p className="title-input-extend">Mô tả</p>
              <Input
                placeholder="Nhập mô tả Tiếng Việt"
                value={descriptionVN}
                onChange={(e) => setDescriptionVN(e.target.value)}
              />
              <Input
                placeholder="Nhập mô tả Tiếng Anh"
                style={{ marginTop: 5 }}
                value={descriptionEN}
                onChange={(e) => setDescriptionEN(e.target.value)}
              />
            </div>
            <div>
              <p className="title-input-extend">Vị trí</p>
              <Input
                placeholder="Nhập vị trí"
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div>
              <p className="title-input-extend">Giá</p>
              <Input
                placeholder="Nhập giá"
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p className="title-input-extend">Ước lượng thời gian</p>
              <Input
                placeholder="Nhập giá"
                type="number"
                onChange={(e) => setEstimate(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p className="title-input-extend">Thumnail</p>
              <Input
                id="exampleImage"
                name="image"
                type="file"
                accept={".jpg,.png,.jpeg"}
                className="input-group"
                onChange={onChangeThumbnail}
              />
              {thumbnail && <Image src={thumbnail} className="img-thumbnail" />}
            </div>
            <div className="mt-2">
              <p className="title-input-extend">Thumnail Active</p>
              <Input
                id="exampleImage"
                name="image"
                type="file"
                accept={".jpg,.png,.jpeg"}
                className="input-group"
                onChange={onChangeThumbnailActive}
              />
              {thumbnailActive && (
                <Image src={thumbnailActive} className="img-thumbnail" />
              )}
            </div>
            <div className="mt-2">
              <Checkbox
                checked={isPriceArea}
                onChange={(e) => setIsPriceArea(e.target.checked)}
              >
                Giá theo khu vực
              </Checkbox>
              {isPriceArea && (
                <div>
                  {priceArea?.map((item, index) => {
                    return (
                      <div className="div-item-price-area" key={index}>
                        <p className="m-0">Tỉnh/thành:</p>
                        <Select
                          style={{ width: "100%", marginTop: 2 }}
                          value={item?.city}
                          options={cityData}
                          onChange={(value, label) =>
                            onChangeCity(value, label, index)
                          }
                        />
                        <p className="m-0">Huyện/quận:</p>
                        <Select
                          mode="multiple"
                          style={{ width: "100%", marginTop: 2 }}
                          options={districtData}
                          onChange={(value, label) =>
                            onChangeDistrict(value, label, index)
                          }
                        />
                        <p className="m-0">Giá trị</p>
                        <Input
                          placeholder="Nhập giá trị"
                          type="number"
                          onChange={(e) =>
                            onChangeValueArea(e.target.value, index)
                          }
                        />
                        <p className="m-0">Loại</p>
                        <Select
                          style={{ width: "100%", marginTop: 2 }}
                          onChange={(e) => onChangeTypeIncreaseArea(e, index)}
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
                        <Button
                          onClick={() => deletePriceArea(index)}
                          style={{ marginTop: 5, width: "auto" }}
                        >
                          Xoá
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    onClick={addPriceArea}
                    style={{ marginTop: 5, width: "auto" }}
                  >
                    Thêm điều kiện
                  </Button>
                </div>
              )}
            </div>
          </Col>
          <Col span={7} className="ml-2">
            <div>
              <Checkbox
                checked={isPlatformFee}
                onChange={(e) => setIsPlatformFee(e.target.checked)}
              >
                Phí dịch vụ
              </Checkbox>
              {isPlatformFee && (
                <Input
                  placeholder="Phần trăm"
                  style={{ marginTop: 1 }}
                  onChange={(e) => setPlatformFee(e.target.value)}
                />
              )}
            </div>
            <div className="mt-2">
              <Checkbox
                checked={showInApp}
                onChange={(e) => setShowInApp(e.target.checked)}
              >
                Hiện thị trên ứng dụng
              </Checkbox>
            </div>

            <div className="mt-2">
              <Checkbox
                checked={isPriceHoliday}
                onChange={(e) => setIsPriceHoliday(e.target.checked)}
              >
                Giá theo ngày lễ
              </Checkbox>
              {isPriceHoliday && (
                <div>
                  {priceHoliday?.map((item, index) => {
                    return (
                      <div key={index} className="mt-2 div-item-holiday">
                        <p className="m-0">Thời gian bắt đầu</p>
                        <DatePicker
                          style={{ width: "100%" }}
                          format={dateFormat}
                          value={dayjs(
                            item?.time_start?.slice(0, 11),
                            dateFormat
                          )}
                          onChange={(date, dateString) =>
                            onChangePriceTimeStart(
                              moment(moment(dateString).toISOString())
                                .add(7, "hours")
                                .toISOString(),
                              index
                            )
                          }
                        />
                        <p className="m-0">Thời gian kết đầu</p>
                        <DatePicker
                          style={{ width: "100%", marginTop: 5 }}
                          value={dayjs(
                            item?.time_end?.slice(0, 11),
                            dateFormat
                          )}
                          onChange={(date, dateString) =>
                            onChangePriceTimeEnd(
                              moment(moment(dateString).toISOString())
                                .add(7, "hours")
                                .toISOString(),
                              index
                            )
                          }
                        />
                        <p className="m-0">Hình thức tăng giá</p>
                        <Select
                          style={{ width: "100%", marginTop: 5 }}
                          value={item?.type_increase}
                          onChange={(e) => onChangePriceType(e, index)}
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
                        <p className="m-0">Giá trị</p>
                        <Input
                          style={{ marginTop: 5 }}
                          value={item?.value}
                          type="number"
                          onChange={(e) =>
                            onChangePriceValue(e.target.value, index)
                          }
                        />

                        <Button
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            width: "auto",
                          }}
                          onClick={() => onDeletePriceHoliday(index)}
                        >
                          Xoá
                        </Button>
                      </div>
                    );
                  })}
                  <Button onClick={addPriceHoliday} style={{ width: "auto" }}>
                    Thêm
                  </Button>
                </div>
              )}
            </div>
          </Col>
          <Col span={7} className="ml-2">
            <div>
              <Checkbox
                checked={isPriceRushDay}
                onChange={(e) => setIsPriceRushDay(e.target.checked)}
              >
                Giá theo ngày cao điểm
              </Checkbox>
              {isPriceRushDay && (
                <div>
                  {priceRushDay?.map((item, index) => {
                    return (
                      <div key={index} className="mt-2 div-item-holiday">
                        <p className="m-0">Thứ trong tuần</p>
                        <Select
                          mode="multiple"
                          style={{ width: "100%", marginTop: 5 }}
                          value={item?.rush_day}
                          onChange={(e) => onChangePriceRushDay(e, index)}
                          options={[
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
                          ]}
                        />
                        <p className="m-0">Hình thức tăng giá</p>
                        <Select
                          style={{ width: "100%", marginTop: 5 }}
                          value={item?.type_increase}
                          onChange={(e) => onChangePriceRushDayType(e, index)}
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
                        <p className="m-0">Giá trị</p>
                        <Input
                          style={{ marginTop: 5 }}
                          value={item?.value}
                          type="number"
                          onChange={(e) =>
                            onChangePriceRushDayValue(e.target.value, index)
                          }
                        />

                        <Button
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            width: "auto",
                          }}
                          onClick={() => onDeletePriceRushDay(index)}
                        >
                          Xoá
                        </Button>
                      </div>
                    );
                  })}
                  <Button onClick={addRushDay} style={{ width: "auto" }}>
                    Thêm
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-2">
              <Checkbox
                checked={isPriceRushHour}
                onChange={(e) => setIsPriceRushHour(e.target.checked)}
              >
                Giá theo giờ cao điểm
              </Checkbox>
              {isPriceRushHour && (
                <div>
                  {priceRushHour?.map((item, index) => {
                    return (
                      <div key={index} className="mt-2 div-item-holiday">
                        <p className="m-0">Giờ bắt đầu</p>
                        <TimePicker
                          style={{ width: "100%", marginTop: 5 }}
                          defaultOpenValue={dayjs("00:00", hourFormat)}
                          format={hourFormat}
                          onChange={(time, timeString) =>
                            onChangeRushHourTimeStart(timeString, index)
                          }
                        />
                        <p className="m-0">Giờ kết thúc</p>
                        <TimePicker
                          style={{ width: "100%", marginTop: 5 }}
                          defaultOpenValue={dayjs("00:00", hourFormat)}
                          format={hourFormat}
                          onChange={(time, timeString) =>
                            onChangeRushHourTimeEnd(timeString, index)
                          }
                        />
                        <p className="m-0">Hình thức tăng giá</p>
                        <Select
                          style={{ width: "100%", marginTop: 5 }}
                          value={item?.type_increase}
                          onChange={(e) => onChangeRushHourType(e, index)}
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
                        <p className="m-0">Giá trị</p>
                        <Input
                          style={{ marginTop: 5 }}
                          value={item?.value}
                          type="number"
                          onChange={(e) =>
                            onChangeRushHourValue(e.target.value, index)
                          }
                        />

                        <Button
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            width: "auto",
                          }}
                          onClick={() => onDeletePriceRushHour(index)}
                        >
                          Xoá
                        </Button>
                      </div>
                    );
                  })}
                  <Button onClick={addRushHour} style={{ width: "auto" }}>
                    Thêm
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Button
          className="btn-create-extend"
          onClick={onCreateExtend}
          style={{ width: "auto" }}
        >
          {" "}
          Tạo
        </Button>
      </Drawer>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default CreateExtend;
