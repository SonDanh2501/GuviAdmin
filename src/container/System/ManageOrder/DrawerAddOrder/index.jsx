import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, List, Row } from "antd";
import "./index.scss";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import {
  getExtendOptionalServiceApi,
  getOptionalServiceByIdApi,
  getServiceApi,
} from "../../../../api/service";
import moment from "moment";
const AddOrder = () => {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState({});
  const [extraService, setExtraService] = useState("");
  const [dateWork, setDateWork] = useState("");
  const [timeWork, setTimeWork] = useState("");
  const [extendService, setExtendService] = useState([]);
  const [mutipleSelected, setMutipleSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getExtendOptionalServiceApi()
      .then((res) => {
        console.log(res);
        setExtendService(res?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const dateFormat = "YYYY-MM-DD";

  const onChange = (date, dateString) => {
    setDateWork(dateString);
  };

  const onChangeTime = (value) => {
    setTimeWork(value);
  };

  const onChangeTimeService = (value) => {
    setTime(value);
  };

  const onChooseMultiple = useCallback(
    (title) => {
      if (mutipleSelected.includes(title)) {
        setMutipleSelected((prev) => prev.filter((p) => p !== title));
      } else {
        setMutipleSelected((prev) => [...prev, title]);
      }
    },
    [mutipleSelected]
  );

  const onChangeExtraService = (value) => {
    if (value === extraService) {
      setExtraService("");
    } else {
      setExtraService(value);
    }
  };

  const timeW = dateWork + "T" + timeWork + ".000Z";

  const timeNow = Number(new Date().toTimeString().slice(0, 2)) + 3;

  const dayNow = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Button className="btn-add-order" onClick={showDrawer}>
        Tạo dịch vụ
      </Button>
      <Drawer
        title="Thêm order"
        placement="right"
        onClose={onClose}
        width={500}
        open={open}
      >
        <div>
          <CustomTextInput
            label="Nhập địa chỉ"
            type="text"
            placeholder="Vui lòng nhập địa chỉ"
            onChange={(e) => setAddress(e.target.value)}
          />
          <Row>
            <CustomTextInput
              label="Nhập kinh độ"
              type="text"
              placeholder="Vui lòng nhập kinh độ"
              onChange={(e) => setLat(e.target.value)}
            />
            <CustomTextInput
              classNameForm="input-long"
              label="Nhập vĩ độ"
              type="text"
              placeholder="Vui lòng nhập vĩ độ"
              onChange={(e) => setLong(e.target.value)}
            />
          </Row>
          <div className="div-add-service">
            <a className="label">Thời lượng</a>
            <div className="div-service">
              {extendService.slice(0, 3).map((item) => {
                return (
                  <div
                    className={
                      item?._id === time?._id
                        ? "select-service"
                        : "select-service-default"
                    }
                    onClick={() => onChangeTimeService(item)}
                  >
                    <a
                      className={
                        item?._id === time?._id
                          ? "text-service"
                          : "text-service-default"
                      }
                    >
                      {item?.title?.vi}
                    </a>
                    <a
                      className={
                        item?._id === time?._id
                          ? "text-service"
                          : "text-service-default"
                      }
                    >
                      {item?.description?.vi.slice(
                        0,
                        item?.description?.vi.indexOf("2")
                      )}
                    </a>
                    <a
                      className={
                        item?._id === time?._id
                          ? "text-service"
                          : "text-service-default"
                      }
                    >
                      {item?.description?.vi.slice(
                        item?.description?.vi.indexOf(" ")
                      )}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="div-add-service">
            <a className="label">Dịch vụ thêm</a>
            <div className="div-service">
              {extendService.slice(3, 6).map((item) => {
                return (
                  <div
                    className={
                      item?._id === extraService
                        ? "select-service"
                        : "select-service-default"
                    }
                    onClick={() => onChooseMultiple(item?._id)}
                  >
                    <a
                      className={
                        mutipleSelected.includes(item?._id)
                          ? "text-service"
                          : "text-service-default"
                      }
                    >
                      {item?.title?.vi}
                    </a>
                    <a
                      className={
                        mutipleSelected.includes(item?._id)
                          ? "text-service"
                          : "text-service-default"
                      }
                    >
                      {item?.description?.vi}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="form-picker">
            <a className="label">Ngày làm</a>
            <DatePicker format={dateFormat} onChange={onChange} />
          </div>
          <div className="form-picker-hours">
            <a className="label-hours">Giờ làm</a>
            {/* <DatePicker format={dateFormat} onChange={onChange} /> */}
            <div className="div-hours">
              {DATA_TIME_TOTAL.map((item) => {
                const timeChosse = item?.title?.slice(0, 2);
                return (
                  <Button
                    className={
                      timeWork === item.time
                        ? "select-time"
                        : "select-time-default"
                    }
                    onClick={() => onChangeTime(item.time)}
                    disabled={
                      dateWork === dayNow
                        ? timeNow >= timeChosse
                          ? true
                          : false
                        : false
                    }
                  >
                    {item.title}
                  </Button>
                );
              })}
            </div>
          </div>
          <CustomTextInput
            label="Ghi chú"
            type="textarea"
            placeholder="Vui lòng nhập ghi chú"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Drawer>
    </>
  );
};
export default AddOrder;
