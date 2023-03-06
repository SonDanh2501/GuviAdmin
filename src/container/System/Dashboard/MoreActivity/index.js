import { Drawer, List, DatePicker, Input, Select, Button } from "antd";
import moment from "moment";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryActivity } from "../../../../redux/actions/statistic";
import { getHistoryActivitys } from "../../../../redux/selectors/statistic";

import "./index.scss";

const MoreActivity = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const historyActivity = useSelector(getHistoryActivitys);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    setInitLoading(false);
  }, []);

  const onLoadMore = () => {
    dispatch(
      getHistoryActivity.getHistoryActivityRequest({
        start: 0,
        length: 20 + historyActivity.length,
      })
    );
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Xem thêm</Button>
      </div>
    ) : null;

  return (
    <>
      <button onClick={showDrawer} className="btn-see-more ">
        Xem chi tiết <i class="uil uil-angle-right"></i>
      </button>

      <Drawer
        title="Chi tiết hoạt động"
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
            loadMore={loadMore}
            loading={initLoading}
            renderItem={(item, index) => {
              const subject = item?.id_admin_action
                ? item?.title_admin.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_collaborator
                ? item?.title_admin.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? item?.title_admin.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : "";

              const predicate = item?.id_collaborator
                ? subject.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? subject.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_admin_action
                ? subject.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : subject.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  );

              const object = item?.id_transistion_collaborator
                ? predicate.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : item?.id_transistion_customer
                ? predicate.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  )
                : predicate.replace(
                    item?.id_reason_cancel?._id,
                    item?.id_reason_cancel?.title.vi
                  );

              return (
                <div className="div-item">
                  <a>
                    {index + 1}. {object}
                  </a>
                  <a className="text-time">
                    {moment(new Date(item?.date_create)).format(
                      "DD/MM/YYYY HH:MM"
                    )}
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

export default MoreActivity;
