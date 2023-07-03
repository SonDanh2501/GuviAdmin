import { Drawer, List, DatePicker, Input, Select, Button } from "antd";
import moment from "moment";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryActivity } from "../../../../redux/actions/statistic";
import { getHistoryActivitys } from "../../../../redux/selectors/statistic";

import "./index.scss";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";

const MoreActivity = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const historyActivity = useSelector(getHistoryActivitys);
  const lang = useSelector(getLanguageState);

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
      <div onClick={showDrawer} className="btn-see-activity">
        {`${i18n.t("see_more", {
          lng: lang,
        })}`}{" "}
        <i class="uil uil-angle-right"></i>
      </div>

      <Drawer
        title="Chi tiết hoạt động"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        headerStyle={{ height: 50 }}
      >
        <div>
          <List
            dataSource={historyActivity}
            loadMore={loadMore}
            loading={initLoading}
            renderItem={(item, index) => {
              const subject = item?.id_user_system
                ? item?.title_admin.replace(
                    item?.id_user_system?._id,
                    item?.id_user_system?.full_name
                  )
                : item?.id_admin_action
                ? item?.title_admin.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_customer
                ? item?.title_admin.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_collaborator
                ? item?.title_admin.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.title_admin.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.code
                  );

              const predicate = item?.id_order
                ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
                : item?.id_reason_punish
                ? subject.replace(
                    item?.id_reason_punish?._id,
                    item?.id_reason_punish?.title?.vi
                  )
                : item?.id_reward
                ? subject.replace(
                    item?.id_reward?._id,
                    item?.id_reward?.title?.vi
                  )
                : item?.id_info_reward_collaborator
                ? subject.replace(
                    item?.id_info_reward_collaborator?._id,
                    item?.id_info_reward_collaborator?.id_reward_collaborator
                      ?.title?.vi
                  )
                : item?.id_transistion_collaborator
                ? subject.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : item?.id_collaborator
                ? subject.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? subject.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_promotion
                ? subject.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.title?.vi
                  )
                : item?.id_admin_action
                ? subject.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_address
                ? subject.replace(item?.id_address, item?.value_string)
                : subject.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );

              const object = item?.id_reason_cancel
                ? predicate.replace(
                    item?.id_reason_cancel?._id,
                    item?.id_reason_cancel?.title?.vi
                  )
                : item?.id_collaborator
                ? predicate.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_address
                ? predicate.replace(item?.id_address, item?.value_string)
                : item?.id_order
                ? predicate.replace(
                    item?.id_order?._id,
                    item?.id_order?.id_view
                  )
                : item?.id_transistion_collaborator
                ? predicate.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : predicate.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
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
