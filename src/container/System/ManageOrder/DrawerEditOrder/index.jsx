import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import {
  getExtendOptionalServiceApi,
  getOptionalServiceByIdApi,
  getServiceApi,
} from "../../../../api/service";
import moment from "moment";
import dayjs from "dayjs";
import { searchCollaborators } from "../../../../api/collaborator";
import { errorNotify } from "../../../../helper/toast";
import { getOrderDetailApi } from "../../../../api/order";
const EditOrder = ({ id }) => {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState();
  const [extraService, setExtraService] = useState("");
  const [dateWork, setDateWork] = useState("");
  const [timeWork, setTimeWork] = useState("");
  const [extendService, setExtendService] = useState([]);
  const [mutipleSelected, setMutipleSelected] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getOrderDetailApi(id)
      .then((res) => {
        setAddress(res?.address);
        setLat(res?.lat);
        setLong(res?.lng);
        setDateWork(res?.date_work.slice(0, 10));
        setTimeWork(res?.date_work.slice(11, 19));
        setNote(res?.note);
        setName(res?.id_collaborator?.full_name);
        setIdCollaborator(res?.id_collaborator?._id);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  }, [id]);

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

  const handleSearch = useCallback((value) => {
    setName(value);
    if (value) {
      searchCollaborators(0, 10, "all", value)
        .then((res) => {
          setDataFilter(res.data);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
        });
    } else {
      setDataFilter([]);
    }

    setIdCollaborator("");
  }, []);

  return (
    <>
      <a className="text-add" onClick={showDrawer}>
        Chỉnh sửa
      </a>
      <Drawer
        title="Chỉnh sửa dịch vụ"
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <CustomTextInput
            label="Nhập kinh độ"
            type="text"
            placeholder="Vui lòng nhập kinh độ"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <CustomTextInput
            label="Nhập vĩ độ"
            type="text"
            placeholder="Vui lòng nhập vĩ độ"
            value={long}
            onChange={(e) => setLong(e.target.value)}
          />
          {/* <div className="div-add-service">
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
          </div> */}
          <div className="form-picker">
            <a className="label">Ngày làm</a>
            <DatePicker
              format={dateFormat}
              onChange={onChange}
              defaultValue={dayjs(dateWork, dateFormat)}
            />
          </div>
          <div className="form-picker-hours">
            <a className="label-hours">Giờ làm</a>
            {/* <DatePicker format={dateFormat} onChange={onChange} /> */}
            <div className="div-hours">
              {DATA_TIME_TOTAL.map((item) => {
                return (
                  <a
                    className={
                      timeWork === item.time
                        ? "select-time"
                        : "select-time-default"
                    }
                    onClick={() => onChangeTime(item.time)}
                  >
                    {item.title}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <a className="label">Cộng tác viên</a>
            <Input
              placeholder="Tìm kiếm theo tên hoặc số điện thoại số điện thoại"
              value={name}
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              className="input"
            />
            {/* {errorName && <a className="error">{errorName}</a>} */}
            {dataFilter.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {dataFilter?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item?._id}
                      onClick={(e) => {
                        setIdCollaborator(e.target.value);
                        setName(item?.full_name);
                        setDataFilter([]);
                      }}
                    >
                      {item?.full_name}
                    </option>
                  );
                })}
              </List>
            )}
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
export default EditOrder;
