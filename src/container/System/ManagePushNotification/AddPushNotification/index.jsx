import { Button, Checkbox, Drawer, Input, List, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify } from "../../../../helper/toast";
import { loadingAction } from "../../../../redux/actions/loading";
import { SearchOutlined } from "@ant-design/icons";
import _debounce from "lodash/debounce";
import moment from "moment";
import { searchCustomers } from "../../../../api/customer";
import { createPushNotification } from "../../../../api/notification";
import { getGroupCustomerApi } from "../../../../api/promotion";
import UploadImage from "../../../../components/uploadImage";
import { getNotification } from "../../../../redux/actions/notification";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import InputCustom from "../../../../components/textInputCustom";
import "./index.scss";
import i18n from "../../../../i18n";

const AddPushNotification = ({ idOrder }) => {
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
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const width = window.innerWidth;

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

  const onCreateNotification = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createPushNotification({
      title: title,
      body: description,
      is_date_schedule: isDateSchedule,
      date_schedule: moment(dateSchedule).toISOString(),
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
        setTitle("");
        setDescription("");
        setIsDateSchedule(false);
        setDateSchedule("");
        setIsCustomer(false);
        setListCustomers([]);
        setGroupCustomer([]);
        setImgThumbnail("");
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
  ]);

  return (
    <>
      <div className="btn-add-push-noti" onClick={showDrawer}>
        <a>{`${i18n.t("create_noti", { lng: lang })}`}</a>
      </div>
      <Drawer
        title={`${i18n.t("create_noti", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={width > 490 ? 500 : 300}
        open={open}
      >
        <InputCustom
          title={`${i18n.t("title", { lng: lang })}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputCustom
          title={`${i18n.t("content", { lng: lang })}`}
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          textArea={true}
        />

        <div className="mt-2">
          <Checkbox
            checked={isDateSchedule}
            onChange={(e) => setIsDateSchedule(e.target.checked)}
          >
            {`${i18n.t("notice_time", { lng: lang })}`}
          </Checkbox>
          {isDateSchedule && (
            <Input
              type="datetime-local"
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
            {`${i18n.t("customer", { lng: lang })}`}
          </Checkbox>
          {isCustomer && (
            <div>
              <InputCustom
                placeholder={`${i18n.t("search", { lng: lang })}`}
                type="text"
                value={nameCustomer}
                prefix={<SearchOutlined />}
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
            {`${i18n.t("customer_group", { lng: lang })}`}
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
              options={options}
            />
          )}
        </div>

        <UploadImage
          title={`${i18n.t("image", { lng: lang })} 360px * 137px, ${i18n.t(
            "ratio",
            { lng: lang }
          )} 2,62`}
          image={imgThumbnail}
          setImage={setImgThumbnail}
          classImg={"img-thumbnail-banner"}
        />

        <Button
          className="btn-create-notification"
          onClick={onCreateNotification}
        >
          {`${i18n.t("create", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};
export default AddPushNotification;
