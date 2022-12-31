import { Drawer, List, DatePicker, Input, Select } from "antd";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryActivity } from "../../../../redux/actions/statistic";
import { getHistoryActivitys } from "../../../../redux/selectors/statistic";

import "./index.scss";

const MoreActivity = () => {
  const dispatch = useDispatch();
  const [typeDate, setTypeDate] = useState("day");
  const [data, setData] = useState([]);
  const historyActivity = useSelector(getHistoryActivitys);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={showDrawer} className="btn-see-more float-right">
        Xem chi tiết <i class="uil uil-angle-right"></i>
      </button>

      <Drawer
        title="Top Cộng tác viên"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div>
          <List
            dataSource={historyActivity}
            // loadMore={isLoadMore}
            renderItem={(item, index) => {
              return (
                <div className="div-item">
                  {/* <div>
                    <a className="text-number">{index + 1}.</a>
                    <a className="text-name">{item?._id?.name}</a>
                  </div>
                  <a className="text-number">{formatMoney(item?.sumIncome)}</a> */}
                </div>
              );
            }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MoreActivity;
