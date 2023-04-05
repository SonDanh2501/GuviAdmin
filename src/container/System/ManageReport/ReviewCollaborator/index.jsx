import { Input, Pagination, Select, Table } from "antd";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import { getReportReviewCollaborator } from "../../../../api/report";
import moment from "moment";
import CustomDatePicker from "../../../../components/customDatePicker";
import _debounce from "lodash/debounce";
import { SearchOutlined } from "@ant-design/icons";
import LoadingPagination from "../../../../components/paginationLoading";

const ReviewCollaborator = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [star, setStar] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getReportReviewCollaborator(
      0,
      20,
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString(),
      star,
      valueSearch
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});

    setStartDate(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
  }, []);

  const handleFilter = useCallback(
    (star) => {
      setStar(star);
      getReportReviewCollaborator(0, 20, startDate, endDate, star, valueSearch)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [valueSearch, startDate, endDate]
  );

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      setIsLoading(true);
      getReportReviewCollaborator(0, 20, startDate, endDate, star, value)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }, 1000),
    [startDate, endDate, star]
  );

  const onChangeDay = () => {
    setIsLoading(true);
    getReportReviewCollaborator(0, 20, startDate, endDate, star, valueSearch)
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onCancelPicker = () => {
    setStartDate(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
  };

  const onChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);

    const start = page * data.length - data.length;
    getReportReviewCollaborator(
      start,
      20,
      startDate,
      endDate,
      star,
      valueSearch
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-create-review">
            <a className="text-date-review">
              {moment(new Date(data?.date_create_review)).format("DD/MM/YYYY")}
            </a>
            <a className="text-date-review">
              {moment(new Date(data?.date_create_review)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Tên khách hàng",
      render: (data) => {
        return (
          <div className="div-customer-review">
            <a className="text-name-review">{data?.id_customer?.full_name}</a>
            <a className="text-name-review">{data?.id_customer?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Tên cộng tác viên",
      render: (data) => {
        return (
          <div className="div-collaborator-review">
            <a className="text-name-review">
              {data?.id_collaborator?.full_name}
            </a>
            <a className="text-name-review">{data?.id_collaborator?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Số sao",
      render: (data) => (
        <a className="star-review">
          {data?.star} <i class="uil uil-star icon-star"></i>
        </a>
      ),
    },
    {
      title: "Nội dung",
      render: (data) => <a className="text-review">{data?.review}</a>,
    },
    {
      title: "Đánh giá nhanh",
      render: (data) => {
        return (
          <div>
            {data?.short_review?.map((item) => (
              <a className="text-short-review">{item}</a>
            ))}
          </div>
        );
      },
    },
    {
      title: "Đơn hàng",
    },
  ];

  return (
    <>
      <a className="title-review">Đánh giá cộng tác viên</a>
      <div className="div-head-review">
        <Select
          defaultValue="0"
          style={{ width: 150 }}
          onChange={handleFilter}
          options={[
            { value: 0, label: "Lọc theo số sao" },
            { value: 1, label: "1 sao" },
            { value: 2, label: "2 sao" },
            { value: 3, label: "3 sao" },
            { value: 4, label: "4 sao" },
            { value: 5, label: "5 sao" },
          ]}
        />

        <Input
          placeholder="Tìm kiếm"
          type="text"
          className="input-search"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="div-date">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={onCancelPicker}
        />
        {startDate && (
          <a className="text-date">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(new Date(endDate)).format("DD/MM/YYYY")}
          </a>
        )}
      </div>

      <div>
        <Table columns={columns} pagination={false} dataSource={data} />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ReviewCollaborator;
