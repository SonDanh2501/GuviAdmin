import {
  Checkbox,
  Image,
  Input,
  Modal,
  Pagination,
  Rate,
  Select,
  Table,
} from "antd";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import {
  checkReviewCollaborator,
  getReportReviewCollaborator,
} from "../../../../api/report";
import moment from "moment";
import CustomDatePicker from "../../../../components/customDatePicker";
import _debounce from "lodash/debounce";
import { SearchOutlined } from "@ant-design/icons";
import LoadingPagination from "../../../../components/paginationLoading";
import { Link, useNavigate } from "react-router-dom";
import { errorNotify } from "../../../../helper/toast";
import { getElementState } from "../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import member from "../../../../assets/images/iconMember.svg";
import silver from "../../../../assets/images/iconSilver.svg";
import gold from "../../../../assets/images/iconGold.svg";
import platinum from "../../../../assets/images/iconPlatinum.svg";
const { TextArea } = Input;
const width = window.innerWidth;

const ReviewCollaborator = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [startDate, setStartDate] = useState(
    moment(moment().subtract(30, "d").startOf("date").toISOString())
      .add(7, "hours")
      .toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
  );
  const [star, setStar] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [modalCheck, setModalCheck] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const toggleModalCheck = () => setModalCheck(!modalCheck);

  useEffect(() => {
    getReportReviewCollaborator(
      0,
      20,
      startDate,
      endDate,
      star,
      valueSearch,
      tab
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const handleFilter = useCallback(
    (star) => {
      setStar(star);
      getReportReviewCollaborator(
        startPage,
        20,
        startDate,
        endDate,
        star,
        valueSearch
      )
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [valueSearch, startDate, endDate, startPage]
  );

  const handleSearch = useCallback(
    _debounce((value) => {
      setCurrentPage(1);
      setStartPage(0);
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
    setCurrentPage(1);
    setStartPage(0);
    getReportReviewCollaborator(
      0,
      20,
      startDate,
      endDate,
      star,
      valueSearch,
      tab
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
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getReportReviewCollaborator(
      start,
      20,
      startDate,
      endDate,
      star,
      valueSearch,
      tab
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

  const onChangeTab = useCallback(
    (value) => {
      setTab(value);
      setCurrentPage(1);
      setStartPage(0);
      getReportReviewCollaborator(
        startPage,
        20,
        startDate,
        endDate,
        star,
        valueSearch,
        value
      )
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [startDate, endDate, star, valueSearch, tab, startPage]
  );

  const onCheckReview = useCallback(
    (id) => {
      setIsLoading(true);
      checkReviewCollaborator(id, {
        note_admin: note,
      })
        .then((res) => {
          setModalCheck(false);
          setIsLoading(false);
          getReportReviewCollaborator(
            startPage,
            20,
            startDate,
            endDate,
            star,
            valueSearch,
            tab
          )
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [note, startDate, endDate, star, valueSearch, tab, startPage]
  );

  const columns = [
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <>
            {data?.date_create_review && (
              <div className="div-create-review">
                <a className="text-date-review">
                  {moment(new Date(data?.date_create_review)).format(
                    "DD/MM/YYYY"
                  )}
                </a>
                <a className="text-date-review">
                  {moment(new Date(data?.date_create_review)).format("HH:mm")}
                </a>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Tên khách hàng",
      render: (data) => {
        return (
          <div className="div-customer-review">
            <img
              src={
                data?.id_customer?.rank_point < 100
                  ? member
                  : data?.id_customer?.rank_point >= 100 &&
                    data?.id_customer?.rank_point < 300
                  ? silver
                  : data?.id_customer?.rank_point >= 300 &&
                    data?.id_customer?.rank_point < 1500
                  ? gold
                  : platinum
              }
              style={{ width: 20, height: 20 }}
            />
            <Link
              to={`/profile-customer/${data?.id_customer?._id}`}
              className="div-name-info"
            >
              <a className="text-name-review">{data?.id_customer?.full_name}</a>
              <a className="text-name-review">{data?.id_customer?.phone}</a>
            </Link>
          </div>
        );
      },
      width: "15%",
    },
    {
      title: "Tên cộng tác viên",
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-collaborator-review"
          >
            <a className="text-name-review">
              {data?.id_collaborator?.full_name}
            </a>
            <a className="text-name-review">{data?.id_collaborator?.phone}</a>
          </Link>
        );
      },
    },
    {
      title: "Số sao/Đơn",
      width: "15%",
      render: (data) => {
        return (
          <Link
            to={`/details-order/${data?.id_group_order}`}
            className="div-star-review"
          >
            <a className="text-order">{data?.id_view}</a>
            <div className="div-star">
              <Rate
                value={data?.star}
                style={{ width: "100%" }}
                disabled={true}
              />
            </div>
          </Link>
        );
      },
      sorter: (a, b) => a.star - b.star,
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
            <a className="text-short-review">{data?.short_review[0]}</a>
          </div>
        );
      },
    },
    {
      key: "action",
      render: (data) => {
        return (
          <>
            {checkElement?.includes("admin_check_review_support_customer") && (
              <Checkbox
                checked={
                  data?.is_check_admin || data?.star === 5 ? true : false
                }
                disabled={
                  data?.star === 5 || data?.is_check_admin ? true : false
                }
                onChange={(e) => {
                  toggleModalCheck();
                  console.log(e.target.checked);
                }}
              ></Checkbox>
            )}
          </>
        );
      },
    },
    {
      title: "Ghi chú",
      render: (data) => <a>{data?.note_admin}</a>,
    },
  ];

  return (
    <>
      {/* <a className="title-review">Đánh giá cộng tác viên</a> */}
      <div className="div-head-review">
        <Select
          defaultValue={"Lọc theo số sao"}
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
          style={{ width: "60%" }}
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
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </a>
        )}
      </div>
      <div className="div-tab-review">
        {TAB?.map((item, index) => {
          return (
            <div
              className={
                tab === item?.value
                  ? "div-item-review-select"
                  : "div-item-review"
              }
              onClick={() => onChangeTab(item?.value)}
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        <Table
          columns={columns}
          pagination={false}
          dataSource={data}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
          scroll={
            width <= 490
              ? {
                  x: 1600,
                }
              : null
          }
        />
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

      <div>
        <Modal
          title="Kiểm tra"
          open={modalCheck}
          onOk={() => onCheckReview(itemEdit?._id)}
          okText={"Lưu"}
          onCancel={toggleModalCheck}
          cancelText={"Huỷ"}
        >
          <div>
            <a>Nội dung</a>
            <TextArea
              placeholder="Nhập nội dung"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </Modal>
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ReviewCollaborator;

const TAB = [
  {
    id: 1,
    title: "Tất cả",
    value: "all",
  },
  {
    id: 2,
    title: "Đã liên hệ",
    value: "is_check",
  },
  {
    id: 2,
    title: "Chưa liên hệ",
    value: "is_not_check",
  },
];
