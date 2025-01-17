import { Button, Checkbox, DatePicker, Drawer, message, Switch } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DATA_TIME_TOTAL } from "../../../api/fakeData";
import {
  editTimeOrderScheduleApi,
  getAddressCustomerApi,
  getOrderApi,
  getOrderByGroupOrderApi,
  updateAddressOrder,
  updateAddressOrderApi,
} from "../../../api/order";
import { errorNotify, successNotify } from "../../../helper/toast";
import i18n from "../../../i18n";
import { getLanguageState } from "../../../redux/selectors/auth";
import "./index.scss";
import { formatArray } from "../../../utils/contant";
import InputTextCustom from "../../../components/inputCustom";
import _debounce from "lodash/debounce";
import {
  getPlaceDetailApi,
  googlePlaceAutocomplete,
} from "../../../api/location";
import { createAddressForCustomer } from "../../../api/customer";
import ButtonCustom from "../../../components/button";
import icons from "../../../utils/icons";
var AES = require("crypto-js/aes");

const { IoAddCircleOutline } = icons;

const EditTimeOrder = (props) => {
  const {
    idOrder,
    idCustomer,
    dateWork,
    status,
    kind,
    startPage,
    setData,
    setTotal,
    setIsLoading,
    idDetail,
    details,
    estimate,
    valueSearch,
    type,
    startDate,
    endDate,
    setReCallData,
    reCallData,
    title,
    address,
  } = props;
  const [open, setOpen] = useState(false);

  const [timeWork, setTimeWork] = useState(
    moment(dateWork).utc().format("HH:mm:ss")
  );
  const [wordDate, setWordDate] = useState(dateWork);
  const [isCheckDateWork, setIsCheckDateWork] = useState(true);
  const [isChangePrice, setIsChangePrice] = useState(false);
  const [valueChangeAddress, setValueChangeAddress] = useState("");
  const [selectCustomerValue, setSelectCustomerValue] = useState(idCustomer); // Giá trị thông tin khách hàng lựa chọn
  const [selectAddressValueTemp, setSelectAddressValueTemp] = useState(""); // Giá trị thông tin địa chỉ của khách hàng để hiển thị
  const [newAddressValue, setNewAddressValue] = useState(null); // Giá trị thông tin địa chỉ của khách hàng để tạo địa chỉ mặc định

  const [valueAddrressEncode, setValueAddressEncode] = useState(null); // Giá trị thông tin địa chỉ của khách hàng nhưng sau khi encode

  /* ~~~ List ~~~ */
  const [listAddressDefault, setListAddressDefault] = useState([]); // Giá trị danh sách những địa chỉ mặc định
  const [listAddress, setListAddress] = useState([]); // Giá trị danh sách những địa chỉ đã tìm kiếm
  /* ~~~ Flag ~~~ */
  const [isShowAddressSearch, setIsShowAddressSearch] = useState(false); // Cờ hiển thị danh sách địa chỉ tìm kiếm
  const [isShowAddressDefault, setIsShowAddressDefault] = useState(true); // Cờ hiển thị danh sách địa chỉ mặc định
  const [isChangeAddress, setIsChangeAddress] = useState(false); // Cờ chỉnh sửa địa chỉ
  const lang = useSelector(getLanguageState);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const dateFormat = "YYYY-MM-DD";

  const onChange = (date, dateString) => {
    setWordDate(moment(moment(dateString)).add(7, "hours").toISOString());
  };

  const timeW = moment(wordDate).format(dateFormat) + "T" + timeWork + ".000Z";
  const timeWorkEnd = moment(new Date(timeW))
    .add(estimate, "hours")
    .toISOString();

  const fetchAddressDefault = async () => {
    try {
      const res = await getAddressCustomerApi(idCustomer, 0, 20);
      setListAddressDefault(res?.data);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  const handleSearchAddress = useCallback(
    _debounce(async (newValue) => {
      const dataRes = [];
      setIsShowAddressSearch(true);
      if (newValue.trim() !== "") {
        const res = await googlePlaceAutocomplete(newValue);
        setIsShowAddressDefault(false);
        for (const item of res.predictions) {
          dataRes.push({
            place_id: item.place_id,
            _id: item.place_id,
            address: item.description,
          });
        }
        setListAddress(dataRes);
      }
    }, 1000),
    []
  );
  // Hàm thêm địa chỉ mặc định mới cho khách hàng
  const handleAddNewAddressCustomer = async () => {
    try {
      const data = {
        token: valueAddrressEncode.toString(),
        type_address_work: "house",
        note_address: "",
        address: "",
      };
      const res = await createAddressForCustomer(selectCustomerValue, data);
      setNewAddressValue(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  const editOrder = () => {
    editTimeOrderScheduleApi(idOrder, {
      date_work: timeW,
      end_date_work: timeWorkEnd,
      is_check_date_work: isCheckDateWork,
      is_change_price: isChangePrice,
    })
      .then((res) => {
        console.log("resssss ", res);
        setReCallData(!reCallData);
        setOpen(false);
        successNotify({
          message: "Thay đổi thời gian làm việc thành công",
        });
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
  };

  // Hàm chọn địa chỉ (lấy place_id: thuộc tính của phần tử trong listAddress khi tìm kiếm để encode ra và lưu lại)
  const handleChangeAddress = async (newValue) => {
    if (newValue?.place_id) {
      const res = await getPlaceDetailApi(newValue.place_id);
      const temp = JSON.stringify({
        lat: res.result.geometry.location.lat,
        lng: res.result.geometry.location.lng,
        address: res.result.formatted_address,
      });
      const accessToken = AES.encrypt(temp, "guvico");
      setValueAddressEncode(accessToken);
      setNewAddressValue(accessToken); // Lưu lại giá trị địa chỉ để nếu cần thêm địa chỉ mặc định cho khách hàng thì lấy giá trị này
      setSelectAddressValueTemp(res.result.formatted_address); // Code cũ
      setIsShowAddressSearch(false); //
      setIsShowAddressDefault(false);
    } else {
      // Trường hợp chọn địa chỉ mặc định sẵn có: tìm kiếm trong listAddressDefault để lọc ra
      const address = listAddressDefault.filter(
        (item) => item._id === newValue
      )[0];
      if (address) {
        const tempAddres = JSON.stringify({
          lat: address.lat,
          lng: address.lng,
          address: address.address,
        });
        const accessToken = AES.encrypt(tempAddres, "guvico");
        setValueAddressEncode(accessToken);
        setNewAddressValue(null);
        setSelectAddressValueTemp(address.address);
        setIsShowAddressSearch(false);
        setIsShowAddressDefault(false);
      }
    }
  };
  const handleChangeAddressDefault = (checked) => {
    setIsShowAddressDefault(checked);
  };
  const handleUpdateAddress = async (idOrder, tokenAddress) => {
    try {
      const payload = {
        token: tokenAddress,
      };
      const res = updateAddressOrderApi(idOrder, payload);
      setOpen(false);
      successNotify({
        message: "Thay đổi địa chỉ làm thành công",
      });
      window.location.reload()
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  useEffect(() => {
    fetchAddressDefault();
  }, [idCustomer]);

  useEffect(() => {
    if (selectAddressValueTemp.trim() !== "") {
      if (isShowAddressDefault && listAddressDefault.length > 0) {
        const findAddress = listAddressDefault.find(
          (el) => el._id === selectAddressValueTemp
        );
        handleChangeAddress(findAddress._id);
      } else {
        const findAddress = listAddress.find(
          (el) => el.place_id === selectAddressValueTemp
        );
        handleChangeAddress(findAddress);
      }
    }
  }, [selectAddressValueTemp]);

  return (
    <div className="">
      {title ? (
        <Button className="edit-time_button-edit" onClick={showDrawer}>
          <p>{title}</p>
        </Button>
      ) : (
        <p onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</p>
      )}
      <Drawer
        title={`${i18n.t("edit_work_time", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingBottom: "8px",
          }}
        >
          <span className="container-create-order__info--container-child-label">
            Nhập địa chỉ muốn thay đổi
          </span>
          <InputTextCustom
            type="select"
            value={selectAddressValueTemp}
            options={
              isShowAddressDefault && listAddressDefault.length > 0
                ? formatArray(listAddressDefault, "_id", ["address"])
                : isShowAddressSearch && listAddress.length > 0
                ? formatArray(listAddress, "place_id", ["address"])
                : []
            }
            placeHolder="Địa chỉ"
            searchField={true}
            onChange={handleSearchAddress}
            // onChange={(e) => {
            //   handleSearchAddress(e.target.value);
            //   setSelectAddressValueTemp(e.target.value);
            // }}
            setValueSelectedProps={setSelectAddressValueTemp}
            related={
              listAddressDefault.length > 0 && isChangeAddress ? true : false
            }
            disable={!isChangeAddress}
            contentChild={
              <div className="container-create-order__content-child">
                <div className="container-create-order__content-child--default-address">
                  <span>Địa chỉ mặc định</span>
                  <Switch
                    size="small"
                    value={isShowAddressDefault}
                    onChange={handleChangeAddressDefault}
                    checked={isShowAddressDefault}
                  />
                </div>

                {selectCustomerValue && newAddressValue && (
                  <div
                    onClick={() => handleAddNewAddressCustomer()}
                    className="container-create-order__content-child--add-address"
                  >
                    <div className="container-create-order__content-child--add-address-icon">
                      <IoAddCircleOutline />
                    </div>
                    <span>Thêm địa chỉ mới cho khách hàng</span>
                  </div>
                )}
              </div>
            }
          />
        </div>
        <DatePicker
          className="select-date"
          format={dateFormat}
          onChange={onChange}
          value={dayjs(wordDate?.slice(0, 11), dateFormat)}
        />

        <div className="mt-3">
          {DATA_TIME_TOTAL.map((item, index) => {
            return (
              <Button
                className={
                  timeWork === item.time ? "select-time" : "select-time-default"
                }
                key={index}
                onClick={() => setTimeWork(item?.time)}
                style={{ width: "auto" }}
              >
                {item.title}
              </Button>
            );
          })}
        </div>

        <div className="div-check">
          <Checkbox
            checked={isCheckDateWork}
            onChange={(e) => setIsCheckDateWork(e.target.checked)}
          >
            Thời gian trùng nhau
          </Checkbox>
          <Checkbox
            checked={isChangePrice}
            onChange={(e) => setIsChangePrice(e.target.checked)}
            style={{ marginTop: 5, margin: 0, padding: 0 }}
          >
            Thay đổi giá đơn hàng
          </Checkbox>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {isChangeAddress ? (
            <ButtonCustom
              label="Lưu địa chỉ"
              onClick={() =>
                handleUpdateAddress(idOrder, valueAddrressEncode.toString())
              }
            />
          ) : (
            <ButtonCustom
              label="Cập nhật địa chỉ"
              onClick={() => setIsChangeAddress(true)}
            />
          )}
          <ButtonCustom label="Cập nhật" onClick={editOrder} disable ={isChangeAddress}/>
        </div>

        {/* <Button
          className="btn-update-time-order"
          onClick={editOrder}
          style={{ width: "auto" }}
        >
          {`${i18n.t("update", { lng: lang })}`}
        </Button> */}
      </Drawer>
    </div>
  );
};
export default EditTimeOrder;
