import { Button, DatePicker, Drawer, Input, Select } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import "./styles.scss";
import {
  editOptionServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../../../api/service";
import { errorNotify } from "../../../../../../helper/toast";
dayjs.extend(customParseFormat);

const EditOptional = (props) => {
  const { data, setIsLoading, setData } = props;
  const [open, setOpen] = useState(false);
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [priceHoliday, setPriceHoliday] = useState([
    {
      time_end: "",
      time_start: "",
      type_increase: "",
      value: "",
    },
  ]);
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setPlatformFee(data?.platform_fee);
    setPriceHoliday(data?.price_option_holiday);
  }, [data]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
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
      thumbnail: data?.thumbnail,
      type: data?.type,
      screen: data?.screen,
      position: data?.position,
      platform_fee: data?.platform_fee,
      price_option_holiday: priceHoliday,
      price_option_rush_hour: data?.price_option_rush_hour,
      price_option_rush_day: data?.price_option_rush_day,
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        getOptionalServiceByServiceApi(data?._id)
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
  }, [data, titleVN, titleEN, descriptionVN, descriptionEN, priceHoliday]);

  return (
    <>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Chỉnh sửa optional service"
        placement="right"
        onClose={onClose}
        open={open}
      >
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
          <a>Giá cao điểm ngày lễ</a>
          {priceHoliday?.map((item, index) => {
            return (
              <div key={index} className="mt-2">
                <a>Thời gian bắt đầu</a>
                <DatePicker
                  style={{ width: "100%" }}
                  format={dateFormat}
                  value={dayjs(item?.time_start?.slice(0, 11), dateFormat)}
                  onChange={(date, dateString) =>
                    onChangePriceTimeStart(
                      moment(moment(dateString).toISOString())
                        .add(7, "hours")
                        .toISOString(),
                      index
                    )
                  }
                />
                <a>Thời gian kết đầu</a>
                <DatePicker
                  style={{ width: "100%", marginTop: 5 }}
                  value={dayjs(item?.time_end?.slice(0, 11), dateFormat)}
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
                    { value: "amount_accumulate", label: "Tăng theo giá tiền" },
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
                  onChange={(e) => onChangePriceValue(e, index)}
                />

                <Button
                  style={{ marginTop: 5, marginBottom: 5 }}
                  onClick={() => onDeletePriceHoliday(index)}
                >
                  Xoá
                </Button>
              </div>
            );
          })}
          <Button onClick={addPriceHoliday}>Thêm</Button>
        </div>

        <Button
          className="btn-edit-service-option"
          onClick={editOptionalService}
        >
          Chỉnh sửa
        </Button>
      </Drawer>
    </>
  );
};

export default memo(EditOptional);
