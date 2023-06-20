import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import { DATA_TIME_TOTAL } from "../../../../api/fakeData";
import moment from "moment";
import {
  editTimeOrderApi,
  getOrderApi,
  getOrderByGroupOrderApi,
} from "../../../../api/order";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
const EditTimeOrder = (props) => {
  const {
    idOrder,
    dateWork,
    code,
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
  } = props;
  const [open, setOpen] = useState(false);

  const [timeWork, setTimeWork] = useState(
    moment(dateWork).utc().format("HH:mm:ss")
  );
  const [wordDate, setWordDate] = useState(dateWork);
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

  const editOrder = () => {
    setIsLoading(true);
    editTimeOrderApi(idOrder, {
      date_work_schedule: timeW,
      code_promotion: code,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);

        if (details) {
          getOrderByGroupOrderApi(idDetail)
            .then((res) => {
              setDataGroup(res?.data?.groupOrder);
              setDataList(res?.data?.listOrder);
            })
            .catch((err) => {
              errorNotify({
                message: err,
              });
            });
        } else {
          getOrderApi(startPage, 20, status, kind)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        }
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
        title={`${i18n.t("edit_work_time", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
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
              >
                {item.title}
              </Button>
            );
          })}
        </div>

        <Button className="btn-update-time-order" onClick={editOrder}>
          {`${i18n.t("update", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};
export default EditTimeOrder;
