import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Image,
  Input,
  List,
  Select,
} from "antd";
import "./index.scss";
import { searchCollaborators } from "../../../../api/collaborator";
import { errorNotify } from "../../../../helper/toast";
import { addCollaboratorToOrderApi } from "../../../../api/order";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";

import _debounce from "lodash/debounce";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { searchCustomers } from "../../../../api/customer";
import { getGroupCustomerApi } from "../../../../api/promotion";
import {
  createPushNotification,
  editPushNotification,
  getDetailNotification,
} from "../../../../api/notification";
import { getNotification } from "../../../../redux/actions/notification";
import moment from "moment";
import { postFile } from "../../../../api/file";
import resizeFile from "../../../../helper/resizer";
const EditPushNotification = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDateSchedule, setIsDateSchedule] = useState(false);
  const [dateSchedule, setDateSchedule] = useState("");
  const [isCustomer, setIsCustomer] = useState(false);
  const [nameCustomer, setNameCustomer] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [isGroupCustomer, setIsGroupCustomer] = useState(false);
  const [groupCustomer, setGroupCustomer] = React.useState([]);
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]);
  const [imgThumbnail, setImgThumbnail] = useState("");
  const options = [];
  const dispatch = useDispatch();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDetailNotification(id)
      .then((res) => {
        const date = moment(new Date(res?.date_schedule)).format(
          "YYYY-MM-DDTHH:mm"
        );
        setTitle(res?.title);
        setDescription(res?.body);
        setImgThumbnail(res?.image_url);
        setIsCustomer(res?.is_id_customer);
        setIsGroupCustomer(res?.is_id_group_customer);
        // setGroupCustomer(res?.id_group_customer);
        setIsDateSchedule(res?.is_date_schedule);
        setDateSchedule(date);
        setListNameCustomers(res?.id_customer);
        res?.id_customer?.map((item) => {
          listCustomers.push(item?._id);
        });
        res?.id_group_customer?.map((item) => {
          groupCustomer.push(item?._id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => console.log(err));
  }, []);

  dataGroupCustomer.map((item, index) => {
    options.push({
      label: item?.name,
      value: item?._id,
    });
  });

  const changeValue = (value) => {
    setNameCustomer(value);
  };

  const onChooseCustomer = (item) => {
    setNameCustomer("");
    setDataFilter([]);
    const newData = listCustomers.concat(item?._id);
    const newNameData = listNameCustomers.concat({
      _id: item?._id,
      full_name: item?.full_name,
      phone: item?.phone,
      id_view: item?.id_view,
    });
    setListCustomers(newData);
    setListNameCustomers(newNameData);
  };

  const removeItemCustomer = (item) => {
    const newNameArray = listNameCustomers.filter((i) => i?._id !== item?._id);
    const newArray = listCustomers.filter((i) => i !== item?._id);
    setListNameCustomers(newNameArray);
    setListCustomers(newArray);
  };

  const searchCustomer = useCallback(
    _debounce((value) => {
      setNameCustomer(value);
      if (value) {
        searchCustomers(0, 20, "", value)
          .then((res) => {
            if (value === "") {
              setDataFilter([]);
            } else {
              setDataFilter(res.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        setDataFilter([]);
      }
    }, 500),
    []
  );

  const handleChange = (value) => {
    setGroupCustomer(value);
  };

  const onChangeThumbnail = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgThumbnail(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const formData = new FormData();
      formData.append("file", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setImgThumbnail(res);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onCreateNotification = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    editPushNotification(id, {
      title: title,
      body: description,
      is_date_schedule: isDateSchedule,
      date_schedule: moment(new Date(dateSchedule)).toISOString(),
      is_id_customer: isCustomer,
      id_customer: listCustomers,
      is_id_group_customer: isGroupCustomer,
      id_group_customer: groupCustomer,
      image_url: imgThumbnail,
    })
      .then(() => {
        dispatch(
          getNotification.getNotificationRequest({
            status: "todo",
            start: 0,
            length: 20,
          })
        );
        dispatch(loadingAction.loadingRequest(false));
        setOpen(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    title,
    description,
    isDateSchedule,
    dateSchedule,
    isCustomer,
    listCustomers,
    groupCustomer,
    imgThumbnail,
    id,
  ]);

  return (
    <>
      <a onClick={showDrawer}>
        <a>Chỉnh sửa </a>
      </a>
      <Drawer
        title="Tạo thông báo"
        placement="right"
        onClose={onClose}
        width={500}
        open={open}
      >
        <CustomTextInput
          label={"Tiêu đề"}
          placeholder="Vui lòng nhập tiêu đề"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <CustomTextInput
          label={"Nội dung"}
          placeholder="Vui lòng nhập nội dung"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <Checkbox
            checked={isDateSchedule}
            onChange={(e) => setIsDateSchedule(e.target.checked)}
          >
            Thời gian thông báo
          </Checkbox>
          {isDateSchedule && (
            <CustomTextInput
              type="datetime-local"
              name="time"
              className="text-input mt-2"
              value={dateSchedule}
              onChange={(e) => setDateSchedule(e.target.value)}
            />
          )}
        </div>

        <div className="mt-3">
          <Checkbox
            checked={isCustomer}
            onChange={(e) => setIsCustomer(e.target.checked)}
          >
            Khách hàng
          </Checkbox>
          {isCustomer && (
            <div>
              <Input
                placeholder="Tìm kiếm theo tên và số điện thoại"
                className="mt-2"
                value={nameCustomer}
                onChange={(e) => {
                  changeValue(e.target.value);
                  searchCustomer(e.target.value);
                }}
              />
              {dataFilter.length > 0 && (
                <List type={"unstyled"} className="list-item-kh">
                  {dataFilter?.map((item, index) => {
                    return (
                      <div
                        className="div-item"
                        key={index}
                        onClick={() => onChooseCustomer(item)}
                      >
                        <a className="text-name">
                          {item?.full_name} - {item?.phone} - {item?.id_view}
                        </a>
                      </div>
                    );
                  })}
                </List>
              )}

              {listNameCustomers.length > 0 && (
                <div className="div-list-customer">
                  <List type={"unstyled"}>
                    {listNameCustomers.map((item) => {
                      return (
                        <div className="div-item-customer">
                          <a className="text-name-list">
                            - {item?.full_name} . {item?.phone} .{" "}
                            {item?.id_view}
                          </a>
                          <i
                            class="uil uil-times-circle"
                            onClick={() => removeItemCustomer(item)}
                          ></i>
                        </div>
                      );
                    })}
                  </List>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-3">
          <Checkbox
            checked={isGroupCustomer}
            onChange={(e) => setIsGroupCustomer(e.target.checked)}
          >
            Nhóm khách hàng
          </Checkbox>

          {isGroupCustomer && (
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              onChange={handleChange}
              value={groupCustomer}
              options={options}
            />
          )}
        </div>

        <div className="mt-3">
          <a className="label ">Hình ảnh 360px * 137px, tỉ lệ 2,62</a>
          <Input
            id="exampleImage"
            name="image"
            type="file"
            accept={".jpg,.png,.jpeg"}
            className="input-group"
            onChange={onChangeThumbnail}
          />
          {imgThumbnail && (
            <Image src={imgThumbnail} className="img-thumbnail-banner" />
          )}
        </div>

        <Button
          className="btn-create-notification"
          onClick={onCreateNotification}
        >
          Sửa
        </Button>
      </Drawer>
    </>
  );
};
export default EditPushNotification;
