import React, { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import moment from "moment";
import {
  editTimeOrderApi,
  editTimeOrderScheduleApi,
  getOrderByGroupOrderApi,
} from "../../../../api/order";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const EditTimeOrderSchedule = (props) => {
  const {
    idOrder,
    dateWork,
    id,
    setDataGroup,
    setDataList,
    setIsLoading,
    estimate,
  } = props;
  const [open, setOpen] = useState(false);

  const [timeWork, setTimeWork] = useState(
    moment(dateWork).utc().format("HH:mm:ss")
  );
  const [wordDate, setWordDate] = useState(dateWork);
  const [isCheckDateWork, setIsCheckDateWork] = useState(true);
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

  const editOrder = () => {
    setIsLoading(true);
    editTimeOrderScheduleApi(idOrder, {
      date_work: timeW,
      end_date_work: timeWorkEnd,
      is_check_date_work: isCheckDateWork,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getOrderByGroupOrderApi(id)
          .then((res) => {
            setDataGroup(res?.data?.groupOrder);
            setDataList(res?.data?.listOrder);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
          });
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <a className="text-add" onClick={showDrawer}>
        {`${i18n.t("edit", { lng: lang })}`}
      </a>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
      >
        <a>{`${i18n.t("start_time", { lng: lang })}`}</a>
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
              >
                {item.title}
              </Button>
            );
          })}
        </div>

        {/* <a>Giờ kết thúc</a>
        <DatePicker
          className="select-date"
          format={dateFormat}
          onChange={onChangeEnd}
          value={dayjs(wordEndDate.slice(0, 11), dateFormat)}
        /> */}

        {/* <div className="mt-3">
          {DATA_TIME_TOTAL.map((item, index) => {
            return (
              <Button
                className={
                  timeEndWork === item.time
                    ? "select-time"
                    : "select-time-default"
                }
                key={index}
                onClick={() => setTimeEndWork(item?.time)}
              >
                {item.title}
              </Button>
            );
          })}
        </div> */}

        <div className="mt-2">
          <Checkbox
            checked={isCheckDateWork}
            onChange={(e) => setIsCheckDateWork(e.target.checked)}
          >
            {`${i18n.t("check_same_time", { lng: lang })}`}
          </Checkbox>
        </div>

        <Button className="btn-update-time-order" onClick={editOrder}>
          {`${i18n.t("update", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};
export default EditTimeOrderSchedule;
