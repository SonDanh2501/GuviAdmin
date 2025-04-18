import { Button, Checkbox, DatePicker, Drawer } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import {
  editTimeOrderScheduleApi,
  getOrderApi,
  getOrderByGroupOrderApi,
} from "../../../../api/order";
import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import "./index.scss";
const EditTimeOrder = (props) => {
  const {
    idOrder,
    dateWork,
    status,
    kind,
    startPage,
    setData,
    setTotal,
    setIsLoading,
    idDetail,
    setDataGroup,
    setDataList,
    details,
    estimate,
    valueSearch,
    type,
    startDate,
    endDate,
  } = props;
  const [open, setOpen] = useState(false);

  const [timeWork, setTimeWork] = useState(
    moment(dateWork).utc().format("HH:mm:ss")
  );
  const [wordDate, setWordDate] = useState(dateWork);
  const [isCheckDateWork, setIsCheckDateWork] = useState(true);
  const [isChangePrice, setIsChangePrice] = useState(false);
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
  // console.log("idDetail ", idDetail, lang);
  const editOrder = () => {
    setIsLoading(true);
    editTimeOrderScheduleApi(idOrder, {
      date_work: timeW,
      end_date_work: timeWorkEnd,
      is_check_date_work: isCheckDateWork,
      is_change_price: isChangePrice,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);

        if (details) {
          getOrderByGroupOrderApi(idDetail, lang)
            .then((res) => {
              setDataGroup(res?.data?.groupOrder);
              setDataList(res?.data?.listOrder);
            })
            .catch((err) => {
              errorNotify({
                message: err?.message,
              });
            });
        } else {
          getOrderApi(
            valueSearch,
            startPage,
            20,
            status,
            kind,
            type,
            startDate,
            endDate,
            "",
            ""
          )
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <Button onClick={showDrawer}>
        <p className="text-add m-0">{`${i18n.t("edit", { lng: lang })}`}</p>
      </Button>
      <Drawer
        title={`${i18n.t("edit_work_time", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <DatePicker
          className="select-date"
          format={dateFormat}
          onChange={onChange}
          value={dayjs(wordDate.slice(0, 11), dateFormat)}
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

        <Button
          className="btn-update-time-order"
          onClick={editOrder}
          style={{ width: "auto" }}
        >
          {`${i18n.t("update", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};
export default EditTimeOrder;
