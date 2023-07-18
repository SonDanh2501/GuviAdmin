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
import { memo, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import "./styles.scss";
import { errorNotify } from "../../../../../../../helper/toast";
import {
  createOptionServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../../../../api/service";
import resizeFile from "../../../../../../../helper/resizer";
import { postFile } from "../../../../../../../api/file";
dayjs.extend(customParseFormat);

const CreateOptional = (props) => {
  const { setIsLoading, setData, idService } = props;
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
            message: err,
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
        time_end: "",
        time_start: "",
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

  const createOptionalService = useCallback(() => {
    setIsLoading(true);
    createOptionServiceApi({
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
      id_service: idService,
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        getOptionalServiceByServiceApi(idService)
          .then((res) => {
            setData(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    type,
    screen,
    position,
    platformFee,
    thumbnail,
    priceHoliday,
    isPriceHoliday,
    isPriceRushDay,
    priceRushDay,
    isPriceRushHour,
    priceRushHour,
  ]);

  return (
    <>
      <Button className="btn-create-option-serivice" onClick={showDrawer}>
        Thêm Optional
      </Button>
      <Drawer
        title="Tạo mới optional service"
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
        headerStyle={{ height: 50 }}
      >
        <Row>
          <Col span={8}>
            <div>
              <a>Tiêu đề</a>
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
              <a>Mô tả</a>
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
              <a>Type</a>
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
              <a>Phí dịch vụ</a>
              <Input
                placeholder="Nhập phí dịch vụ"
                type="number"
                min={0}
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <a>Vị trí</a>
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
              <a>Số trang</a>

              <Input
                placeholder="Vui lòng nhập nội dung"
                style={{ width: "100%" }}
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <a className="title-input-extend">Thumnail</a>
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
                        <a>Thời gian bắt đầu</a>
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
                        <a>Thời gian kết thúc</a>
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
                        <a>Hình thức tăng giá</a>
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
                        <a>Giá trị</a>
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
                        <a>Thứ trong tuần</a>
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
                        <a>Hình thức tăng giá</a>
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
                        <a>Giá trị</a>
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
                        <a>Giờ bắt đầu</a>
                        <TimePicker
                          style={{ width: "100%", marginTop: 5 }}
                          defaultOpenValue={dayjs("00:00", hourFormat)}
                          format={hourFormat}
                          onChange={(time, timeString) =>
                            onChangeRushHourTimeStart(timeString, index)
                          }
                        />
                        <a>Giờ kết thúc</a>
                        <TimePicker
                          style={{ width: "100%", marginTop: 5 }}
                          defaultOpenValue={dayjs("00:00", hourFormat)}
                          format={hourFormat}
                          onChange={(time, timeString) =>
                            onChangeRushHourTimeEnd(timeString, index)
                          }
                        />
                        <a>Hình thức tăng giá</a>
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
                        <a>Giá trị</a>
                        <Input
                          style={{ marginTop: 5 }}
                          value={item?.value}
                          type="number"
                          onChange={(e) =>
                            onChangeRushHourValue(e.target.value, index)
                          }
                        />

                        <Button
                          style={{ marginTop: 5, marginBottom: 5 }}
                          onClick={() => onDeletePriceRushHour(index)}
                        >
                          Xoá
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    onClick={addRushHour}
                    style={{ width: "auto", marginTop: 5 }}
                  >
                    Thêm
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Button
          className="btn-edit-service-option"
          onClick={createOptionalService}
          style={{ width: "auto" }}
        >
          Thêm mới
        </Button>
      </Drawer>
    </>
  );
};

export default memo(CreateOptional);
