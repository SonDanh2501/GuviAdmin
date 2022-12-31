import { List, Pagination } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { PaginationItem, PaginationLink } from "reactstrap";
import { getHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const Activity = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getHistoryActivityCollaborator(id, 0, 5)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log(err));
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getHistoryActivityCollaborator(id, start, 5)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const renderItem = (item) => {
    const subject = item?.title_admin.replace(item?.id_admin_action, "Admin");
    const predicate = subject.replace(item?.id_collaborator, "Huy");
    return (
      <div className="div-listItem">
        <div className="div-list">
          <a className="text-title">{predicate}</a>
          <a className="text-date">
            {moment(new Date(item?.date_create)).format("DD/MM/yyy HH:mm")}
          </a>
        </div>
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
            pageSize={20}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Activity);
