import { List, Pagination } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const Activity = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getHistoryActivityCollaborator(id, 0, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getHistoryActivityCollaborator(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const renderItem = (item) => {
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

    const predicate = item?.id_order
      ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
      : item?.id_promotion
      ? subject.replace(item?.id_promotion?._id, item?.id_promotion?.title?.vi)
      : item?.id_collaborator
      ? subject.replace(
          item?.id_collaborator?._id,
          item?.id_collaborator?.full_name
        )
      : item?.id_customer
      ? subject.replace(item?.id_customer?._id, item?.id_customer?.full_name)
      : item?.id_admin_action
      ? subject.replace(
          item?.id_admin_action?._id,
          item?.id_admin_action?.full_name
        )
      : item?.id_transistion_collaborator
      ? subject.replace(
          item?.id_transistion_collaborator?._id,
          item?.id_transistion_collaborator?.transfer_note
        )
      : item?.id_transistion_customer
      ? subject.replace(
          item?.id_transistion_customer?._id,
          item?.id_transistion_customer?.transfer_note
        )
      : "";

    const object = item?.id_order
      ? predicate.replace(item?.id_order?._id, item?.id_order?.id_view)
      : item?.id_transistion_collaborator
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
          item?.id_reason_cancel?.title?.vi
        );

    return (
      <div className="div-list-item">
        <a className="text-title">{object}</a>
        <a className="text-date">
          {moment(new Date(item?.date_create)).format("DD/MM/yyy HH:mm")}
        </a>
      </div>
    );
  };

  return (
    <>
      <List itemLayout="horizontal" dataSource={data} renderItem={renderItem} />
      <div className="div-pagination p-2">
        <a>Tổng: {totalData}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalData}
            showSizeChanger={false}
            pageSize={10}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Activity);
