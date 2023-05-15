import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import moment from "moment";
import {
  editTimeOrderApi,
  editTimeOrderScheduleApi,
} from "../../../../api/order";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";

const EditTimeOrderSchedule = ({ idOrder, dateWork, endDateWord, code }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeWork, setTimeWork] = useState(
    moment(dateWork).utc().format("HH:mm:ss")
  );
  const [wordDate, setWordDate] = useState(dateWork);
  const [timeEndWork, setTimeEndWork] = useState(
    moment(endDateWord).utc().format("HH:mm:ss")
  );
  const [wordEndDate, setWordEndDate] = useState(endDateWord);
  const dispatch = useDispatch();
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
  const onChangeEnd = (date, dateString) => {
    setWordEndDate(moment(moment(dateString)).add(7, "hours").toISOString());
  };

  const timeW = moment(wordDate).format(dateFormat) + "T" + timeWork + ".000Z";
  const timeWorkEnd =
    moment(wordEndDate).format(dateFormat) + "T" + timeEndWork + ".000Z";

  const editOrder = () => {
    dispatch(loadingAction.loadingRequest(true));
    editTimeOrderScheduleApi(idOrder, {
      date_work: timeW,
      end_date_work: timeWorkEnd,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        window.location.reload();
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  return (
    <>
      <a className="text-add" onClick={showDrawer}>
        Chỉnh sửa
      </a>
      <Drawer
        title="Chỉnh sửa thời gian làm việc"
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
      >
        <a>Giờ bắt đầu</a>
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

        <a>Giờ kết thúc</a>
        <DatePicker
          className="select-date"
          format={dateFormat}
          onChange={onChangeEnd}
          value={dayjs(wordEndDate.slice(0, 11), dateFormat)}
        />

        <div className="mt-3">
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
        </div>

        <Button className="btn-update-time-order" onClick={editOrder}>
          Cập nhật
        </Button>
      </Drawer>

      {isLoading && <LoadingPagination />}
    </>
  );
};
export default EditTimeOrderSchedule;
