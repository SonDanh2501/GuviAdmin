import { Drawer, List, DatePicker, Input, Select } from "antd";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../../helper/formatMoney";
import { getTopCollaborator } from "../../redux/actions/statistic";
import { getTopCollaborators } from "../../redux/selectors/statistic";
import { getTopCollaboratorApi } from "../../api/statistic";
import "./index.scss";
import i18n from "../../i18n";
import { getLanguageState } from "../../redux/selectors/auth";
import useWindowDimensions from "../../helper/useWindowDimensions";
const { RangePicker } = DatePicker;
const { Option } = Select;

const MoreTopCollaborator = () => {
  const dispatch = useDispatch();
  const topCollaborator = useSelector(getTopCollaborators);
  const [typeDate, setTypeDate] = useState("day");
  const [data, setData] = useState([]);
  const lang = useSelector(getLanguageState);
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const isLoadMore = () => {
    dispatch(
      getTopCollaborator.getTopCollaboratorRequest({
        startDate: moment().startOf("month").toISOString(),
        endDate: moment().endOf("month").toISOString(),
        start: topCollaborator.length,
        length: 10,
      })
    );
  };

  const onChangeDate = useCallback((start, end) => {
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
    getTopCollaboratorApi(dayStart, dayEnd, 0, 10)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div onClick={showDrawer} className="btn-see">
        <a>
          {`${i18n.t("see_more", {
            lng: lang,
          })}`}
        </a>{" "}
        <i class="uil uil-angle-right"></i>
      </div>

      <Drawer
        title="Top Cộng tác viên"
        width={width > 490 ? 500 : 350}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        headerStyle={{ height: 50 }}
      >
        <div>
          <div className="div-date">
            <Input.Group compact>
              <Select defaultValue={typeDate} onChange={(e) => setTypeDate(e)}>
                <Option value="day">Ngày</Option>
                <Option value="week">Tuần </Option>
                <Option value="month">Tháng</Option>
                <Option value="quarter">Quý</Option>
              </Select>
            </Input.Group>
            <div>
              <RangePicker
                picker={typeDate}
                className="picker"
                onChange={(e) => onChangeDate(e[0]?.$d, e[1]?.$d)}
              />
            </div>
          </div>
          <List
            dataSource={data.length > 0 ? data : topCollaborator}
            loadMore={isLoadMore}
            renderItem={(item, index) => {
              return (
                <div className="div-item-more-collaborator">
                  <div className="div-name-more">
                    <a className="text-number">{index + 1}.</a>
                    <a className="text-name">{item?._id?.full_name}</a>
                  </div>
                  <a className="text-money-more">
                    {formatMoney(item?.sumIncome)}
                  </a>
                </div>
              );
            }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MoreTopCollaborator;
