import { List } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
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

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * data.length;
    getHistoryActivityCollaborator(id, start, 5)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const pageCount = totalData / 5;
  let pageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageNumbers.push(
      <PaginationItem key={i} active={currentPage === i ? true : false}>
        <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <div className="div-listItem">
            <div className="div-list">
              <a className="text-title">{item?.title_admin}</a>
              <a className="text-date">
                {moment(new Date(item?.date_create)).format("DD/MM/yyy HH:mm")}
              </a>
            </div>
          </div>
        )}
      />
      <div className="div-pagination">
        <h7>Tổng: {totalData}</h7>
        <Pagination
          className="pagination justify-content-end mb-0"
          listClassName="justify-content-end mb-0"
        >
          <PaginationItem className={currentPage === 0 ? "disabled" : "enable"}>
            <PaginationLink
              onClick={(e) => handleClick(e, currentPage - 1)}
              href="#"
            >
              <i class="uil uil-previous"></i>
            </PaginationLink>
          </PaginationItem>
          {pageNumbers}
          <PaginationItem disabled={currentPage >= pageCount - 1}>
            <PaginationLink
              onClick={(e) => handleClick(e, currentPage + 1)}
              href="#"
            >
              <i class="uil uil-step-forward"></i>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </>
  );
};

export default memo(Activity);
