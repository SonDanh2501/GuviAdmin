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
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import member from "../../../../assets/images/iconMember.svg";
import silver from "../../../../assets/images/iconSilver.svg";
import gold from "../../../../assets/images/iconGold.svg";
import platinum from "../../../../assets/images/iconPlatinum.svg";
import i18n from "../../../../i18n";
import InputCustom from "../../../../components/textInputCustom";
import ModalCustom from "../../../../components/modalCustom";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import { getProvince } from "../../../../redux/selectors/service";
const { TextArea } = Input;

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
  const [city, setCity] = useState("");
  const [dataDistrict, setDataDistrict] = useState([]);
  const [district, setDistrict] = useState([]);
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const toggleModalCheck = () => setModalCheck(!modalCheck);
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);
  const user = useSelector(getUser);
  const cityOptions = [];
  const districtOptions = [];

  useEffect(() => {
    getReportReviewCollaborator(
      0,
      20,
      startDate,
      endDate,
      star,
      valueSearch,
      tab,
      city,
      district
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  province?.map((item) => {
    if (user?.area_manager_lv_1?.length === 0) {
      cityOptions.push({
        value: item?.code,
        label: item?.name,
        district: item?.districts,
      });
    } else if (user?.area_manager_lv_1?.includes(item?.code)) {
      cityOptions.push({
        value: item?.code,
        label: item?.name,
        district: item?.districts,
      });
    }
  });

  dataDistrict?.map((item) => {
    if (user?.area_manager_lv_2?.length === 0) {
      districtOptions.push({
        value: item?.code,
        label: item?.name,
      });
    } else if (user?.area_manager_lv_2?.includes(item?.code)) {
      districtOptions.push({
        value: item?.code,
        label: item?.name,
      });
    }
  });

  const onChangeCity = (value, item) => {
    setCity(value);
    setDataDistrict(item?.district);
    getReportReviewCollaborator(
      0,
      20,
      startDate,
      endDate,
      star,
      valueSearch,
      tab,
      value,
      district
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeDistrict = (value) => {
    setDistrict(value);
    getReportReviewCollaborator(
      0,
      20,
      startDate,
      endDate,
      star,
      valueSearch,
      tab,
      city,
      value
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

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
      getReportReviewCollaborator(
        0,
        20,
        startDate,
        endDate,
        star,
        value,
        city,
        district
      )
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
      tab,
      city,
      district
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
      tab,
      city,
      district
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
        value,
        city,
        district
      )
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [startDate, endDate, star, valueSearch, tab, startPage, city, district]
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
            tab,
            city,
            district
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
    [
      note,
      startDate,
      endDate,
      star,
      valueSearch,
      tab,
      startPage,
      city,
      district,
    ]
  );

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("customer", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("collaborator", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("star_order", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => <a className="text-review">{data?.review}</a>,
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("quick_review", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("note", { lng: lang })}`}</a>
        );
      },
      render: (data) => <a>{data?.note_admin}</a>,
      align: "center",
    },
  ];

  return (
    <>
      {/* <a className="title-review">Đánh giá cộng tác viên</a> */}
      <div className="div-head-review">
        <Select
          value={star}
          style={{ width: width <= 490 ? "100%" : "18%" }}
          onChange={handleFilter}
          options={[
            { value: 0, label: `${i18n.t("Tất cả", { lng: lang })}` },
            { value: 1, label: `1 ${i18n.t("star", { lng: lang })}` },
            { value: 2, label: `2 ${i18n.t("star", { lng: lang })}` },
            { value: 3, label: `3 ${i18n.t("star", { lng: lang })}` },
            { value: 4, label: `4 ${i18n.t("star", { lng: lang })}` },
            { value: 5, label: `5 ${i18n.t("star", { lng: lang })}` },
          ]}
        />
        <Select
          value={city}
          style={{ width: width <= 490 ? "100%" : "18%" }}
          options={cityOptions}
          onChange={(e, item) => onChangeCity(e, item)}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          placeholder="Chọn Tỉnh/thành phố"
        />
        <Select
          value={district}
          style={{ width: width <= 490 ? "100%" : "18%" }}
          options={districtOptions}
          onChange={(e, item) => onChangeDistrict(e)}
          placeholder="Chọn quận/huyện"
          disabled={districtOptions.length > 0 ? false : true}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          mode="multiple"
        />

        <Input
          placeholder={`${i18n.t("search", { lng: lang })}`}
          type="text"
          style={
            width <= 490 ? { width: "100%", marginTop: 10 } : { width: "40%" }
          }
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="div-date-review-collaborator">
        <div className="div-picker">
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={onCancelPicker}
            setSameStart={() => {}}
            setSameEnd={() => {}}
          />
        </div>
        <div>
          {startDate && (
            <a className="text-date">
              {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </a>
          )}
        </div>
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
              <a className="text-tab">{`${i18n.t(item?.title, {
                lng: lang,
              })}`}</a>
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
          scroll={{
            x: width <= 900 ? 1200 : 0,
          }}
          expandable={
            width <= 900
              ? {
                  expandedRowRender: (record) => {
                    return (
                      <div className="div-detail-review-collaborator">
                        <div className="div-text-detail">
                          <a className="title-detail">CTV :</a>
                          <Link
                            to={`/details-collaborator/${record?.id_collaborator?._id}`}
                          >
                            <a className="text-detail-review">
                              {record?.id_collaborator?.full_name}
                            </a>
                          </Link>
                        </div>
                        <div className="div-text-detail">
                          <a className="title-detail">Số sao/đơn :</a>
                          <Link
                            to={`/details-order/${record?.id_group_order}`}
                            className="div-star-review"
                          >
                            <a className="text-order">{record?.id_view}</a>
                            <div className="div-star">
                              <Rate
                                value={record?.star}
                                style={{ width: "100%" }}
                                disabled={true}
                              />
                            </div>
                          </Link>
                        </div>
                        <div className="div-text-detail">
                          <a className="title-detail">Nội dung :</a>
                          <a className="text-detail-review">{record?.review}</a>
                        </div>
                        <div className="div-text-detail">
                          <a className="title-detail">Đánh giá :</a>
                          <a className="text-detail-review">
                            {record?.short_review[0]}
                          </a>
                        </div>
                      </div>
                    );
                  },
                }
              : ""
          }
        />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </a>
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
        <ModalCustom
          title={`${i18n.t("check", { lng: lang })}`}
          isOpen={modalCheck}
          handleOk={() => onCheckReview(itemEdit?._id)}
          textOk={`${i18n.t("save", { lng: lang })}`}
          handleCancel={toggleModalCheck}
          body={
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              placeholder={`${i18n.t("placeholder", { lng: lang })}`}
              textArea={true}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ReviewCollaborator;

const TAB = [
  {
    id: 1,
    title: "all",
    value: "all",
  },
  {
    id: 2,
    title: "contacted",
    value: "is_check",
  },
  {
    id: 2,
    title: "not_contacted",
    value: "is_not_check",
  },
];
