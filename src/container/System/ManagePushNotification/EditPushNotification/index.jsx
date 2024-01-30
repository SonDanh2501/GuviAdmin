import { Button, Checkbox, Drawer, Input, List, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify } from "../../../../helper/toast";
import { loadingAction } from "../../../../redux/actions/loading";
import "./index.scss";

import _debounce from "lodash/debounce";
import moment from "moment";
import { searchCustomersApi } from "../../../../api/customer";
import {
  editPushNotification,
  getDetailNotification,
} from "../../../../api/notification";
import { getGroupCustomerApi } from "../../../../api/promotion";
import InputCustom from "../../../../components/textInputCustom";
import UploadImage from "../../../../components/uploadImage";
import i18n from "../../../../i18n";
import { getNotification } from "../../../../redux/actions/notification";
import { getLanguageState } from "../../../../redux/selectors/auth";
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
  const width = window.innerWidth;
  const lang = useSelector(getLanguageState);

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
          return listCustomers.push(item?._id);
        });
        res?.id_group_customer?.map((item) => {
          return groupCustomer.push(item?._id);
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
    return options.push({
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

  const searchCustomer = _debounce((value) => {
    setNameCustomer(value);
    if (value) {
      searchCustomersApi(value)
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
  }, 500);

  const handleChange = (value) => {
    setGroupCustomer(value);
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
          message: err?.message,
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
    dispatch,
    isGroupCustomer,
  ]);

  return (
    <>
      <p className="m-0" onClick={showDrawer}>
        {`${i18n.t("edit", { lng: lang })}`}
      </p>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={width > 490 ? 500 : 320}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <InputCustom
          title={`${i18n.t("title", { lng: lang })}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputCustom
          title={`${i18n.t("content", { lng: lang })}`}
          textArea={true}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-2">
          <Checkbox
            checked={isDateSchedule}
            onChange={(e) => setIsDateSchedule(e.target.checked)}
          >
            {`${i18n.t("notice_time", { lng: lang })}`}
          </Checkbox>
          {isDateSchedule && (
            <InputCustom
              type="datetime-local"
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
              <Input
                placeholder={`${i18n.t("search", { lng: lang })}`}
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
                        <p className="text-name">
                          {item?.full_name} - {item?.phone} - {item?.id_view}
                        </p>
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
                          <p className="text-name-list">
                            - {item?.full_name} . {item?.phone} .{" "}
                            {item?.id_view}
                          </p>
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
              value={groupCustomer}
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
          classImg="img-background-noti"
        />

        <Button
          className="btn-edit-notification"
          onClick={onCreateNotification}
        >
          {`${i18n.t("edit", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};
export default EditPushNotification;
