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
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import { memo, useCallback, useEffect, useState } from "react";
import { postFile } from "../../../../../../api/file";
import {
  editOptionServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../../../api/service";
import resizeFile from "../../../../../../helper/resizer";
import { errorNotify } from "../../../../../../helper/toast";
import "./styles.scss";
dayjs.extend(customParseFormat);

const EditOptional = (props) => {
  const { setIsLoading, setData, data, id } = props;
  const [open, setOpen] = useState(false);
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState("");
  const [screen, setScreen] = useState("");
  const [isPriceHoliday, setIsPriceHoliday] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
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

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setPlatformFee(data?.platform_fee);
    setScreen(data?.screen);
    setType(data?.type);
    setThumbnail(data?.thumbnail);
    setIsPriceHoliday(data?.price_option_holiday.length > 0 ? true : false);
    setPriceHoliday(data?.price_option_holiday);
    setIsPriceRushDay(data?.price_option_rush_day.length > 0 ? true : false);
    setPriceRushDay(data?.price_option_rush_day);
    setIsPriceRushHour(data?.price_option_rush_hour.length > 0 ? true : false);
    setPriceRushHour(data?.price_option_rush_hour);
  }, [data]);

  const editOptionalService = useCallback(() => {
    setIsLoading(true);
    editOptionServiceApi(data?._id, {
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: thumbnail,
      type: type,
      screen: screen,
      position: position,
      platform_fee: platformFee,
      price_option_holiday: isPriceHoliday ? priceHoliday : [],
      price_option_rush_hour: isPriceRushHour ? priceRushHour : [],
      price_option_rush_day: isPriceRushDay ? priceRushDay : [],
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        getOptionalServiceByServiceApi(id)
          .then((res) => {
            setData(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
        });
      });
  }, [
    data,
    titleVN,
    titleEN,
    platformFee,
    descriptionVN,
    descriptionEN,
    priceHoliday,
    isPriceHoliday,
    isPriceRushDay,
    priceRushDay,
    isPriceRushHour,
    priceRushHour,
    type,
    id,
    position,
    screen,
    thumbnail,
    setData,
    setIsLoading,
  ]);

  return (
    <>
      <p style={{ margin: 0 }} onClick={showDrawer}>
        Chỉnh sửa
      </p>
      <Drawer
        title="Chỉnh sửa optional service"
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
        headerStyle={{ height: 50 }}
      >
        <Row>
          <Col span={8}>
            <div>
              <p style={{ margin: 0 }}>Tiêu đề</p>
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
              <p style={{ margin: 0 }}>Mô tả</p>
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
            <div className="mt-2">
              <p style={{ margin: 0 }}>Type</p>
              <Input
                style={{ marginTop: 2 }}
                placeholder="Nhập type vd: select_horizontal_no_thumbnail"
                type="text"
                min={0}
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p style={{ margin: 0 }}>Phí dịch vụ</p>
              <Input
                placeholder="Nhập phí dịch vụ"
                type="number"
                min={0}
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p style={{ margin: 0 }}>Vị trí</p>
              <Input
                style={{ marginTop: 2 }}
                placeholder="Nhập vị trí"
                type="number"
                min={0}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p style={{ margin: 0 }}>Số trang</p>

              <Input
                placeholder="Vui lòng nhập nội dung"
                style={{ width: "100%" }}
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p style={{ margin: 0 }} className="title-input-extend">
                Thumnail
              </p>
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
              <Checkbox
                checked={isPriceHoliday}
                onChange={(e) => setIsPriceHoliday(e.target.checked)}
              >
                Giá cao điểm ngày lễ
              </Checkbox>
              {isPriceHoliday && (
                <div>
                  {priceHoliday?.map((item, index) => {
                    return (
                      <div key={index} className="div-price-holiday">
                        <p style={{ margin: 0 }}>Thời gian bắt đầu</p>
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
                          allowClear={false}
                        />
                        <p style={{ margin: 0 }}>Thời gian kết thúc</p>
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
                          allowClear={false}
                        />
                        <p style={{ margin: 0 }}>Hình thức tăng giá</p>
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
                        <p style={{ margin: 0 }}>Giá trị</p>
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
                            width: 60,
                          }}
                          onClick={() => onDeletePriceHoliday(index)}
                        >
                          Xoá
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    onClick={addPriceHoliday}
                    style={{ marginTop: 5, width: "auto" }}
                  >
                    Thêm
                  </Button>
                </div>
              )}
            </div>
          </Col>
          <Col span={7} style={{ marginLeft: 5 }}>
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
                        <p style={{ margin: 0 }}>Thứ trong tuần</p>
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
                        <p style={{ margin: 0 }}>Hình thức tăng giá</p>
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
                        <p style={{ margin: 0 }}>Giá trị</p>
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
                  <Button
                    onClick={addRushDay}
                    style={{ marginTop: 5, width: "auto" }}
                  >
                    Thêm
                  </Button>
                </div>
              )}
            </div>
          </Col>
          <Col span={7} style={{ marginLeft: 5 }}>
            <div>
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
                        <p style={{ margin: 0 }}>Giờ bắt đầu</p>
                        <TimePicker
                          style={{ width: "100%", marginTop: 5 }}
                          value={dayjs(
                            item?.time_start.slice(0, 5),
                            hourFormat
                          )}
                          format={hourFormat}
                          onChange={(time, timeString) =>
                            onChangeRushHourTimeStart(timeString, index)
                          }
                        />
                        <p style={{ margin: 0 }}>Giờ kết thúc</p>
                        <TimePicker
                          style={{ width: "100%", marginTop: 5 }}
                          value={dayjs(
                            item?.time_start.slice(0, 5),
                            hourFormat
                          )}
                          format={hourFormat}
                          onChange={(time, timeString) =>
                            onChangeRushHourTimeEnd(timeString, index)
                          }
                        />
                        <p style={{ margin: 0 }}>Hình thức tăng giá</p>
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
                        <p style={{ margin: 0 }}>Giá trị</p>
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
                  <Button style={{ width: "auto" }} onClick={addRushHour}>
                    Thêm
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Button
          className="btn-edit-service-option"
          onClick={editOptionalService}
          style={{ width: "auto" }}
        >
          Chỉnh sửa
        </Button>
      </Drawer>
    </>
  );
};

export default memo(EditOptional);
