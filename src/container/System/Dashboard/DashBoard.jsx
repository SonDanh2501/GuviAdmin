import {
  DatePicker,
  Empty,
  FloatButton,
  List,
  Progress,
  Select,
  Skeleton,
  Table,
  Input,
} from "antd";

import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, CardBody, Col, Row } from "reactstrap";
import { getDayReportApi } from "../../../api/statistic";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import {
  getActiveUser,
  getHistoryActivity,
  getLastestService,
  getServiceConnect,
  getTopCollaborator,
} from "../../../redux/actions/statistic";
import {
  getActiveUsers,
  getHistoryActivitys,
  getLastestServices,
  getServiceConnects,
  getTopCollaborators,
} from "../../../redux/selectors/statistic";
import "./DashBoard.scss";
import Header from "./HeaderBoard/Header";
import "moment/locale/vi";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "../../../helper/formatMoney";
import MoreTopCollaborator from "../../../components/moreTopCollaborator";
import MoreActivity from "./MoreActivity";
import CustomDatePicker from "../../../components/customDatePicker";
import { number_processing } from "../../../helper/numberProcessing";
moment.locale("vi");
const { RangePicker } = DatePicker;
const { Option } = Select;

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 100 },
];
const COLORS = ["#BAE6FD", " #F477EF", "#FCD34D", "#2ACB9E"];

export default function Home() {
  const [arrResult, setArrResult] = useState([]);
  const [totalMoneyChart, setTotalMoneyChart] = useState(0);
  const [day, setDay] = useState([]);
  const [type, setType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const historyActivity = useSelector(getHistoryActivitys);
  const activeUser = useSelector(getActiveUsers);
  const lastestService = useSelector(getLastestServices);
  const connectionService = useSelector(getServiceConnects);
  const topCollaborator = useSelector(getTopCollaborators);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    getDayReportApi(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setArrResult(res.arrResult);
        setTotalMoneyChart(res?.total_money);
        getDates(res?.arrResult[0]?.date_start, res?.arrResult?.date_end);
      })
      .catch((err) => console.log(err));
    dispatch(getServiceConnect.getServiceConnectRequest());
    dispatch(
      getHistoryActivity.getHistoryActivityRequest({ start: 0, length: 20 })
    );
    dispatch(getActiveUser.getActiveUserRequest());
    dispatch(
      getLastestService.getLastestServiceRequest({ start: 0, length: 5 })
    );
    dispatch(
      getTopCollaborator.getTopCollaboratorRequest({
        startDate: moment(moment().startOf("year").toISOString())
          .add(7, "hours")
          .toISOString(),
        endDate: moment(new Date()).toISOString(),
        start: 0,
        length: 10,
      })
    );
  }, []);

  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return setDay(dateArray);
  }

  const onChange = useCallback(() => {
    getDayReportApi(startDate, endDate)
      .then((res) => {
        setArrResult(res.arrResult);
        setTotalMoneyChart(res?.total_money);
      })
      .catch((err) => console.log(err));

    getDates(startDate, endDate);
  }, [startDate, endDate]);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const onChangeNumberData = useCallback((number) => {
    dispatch(
      getLastestService.getLastestServiceRequest({ start: 0, length: number })
    );
  }, []);

  const columns = [
    {
      title: "Khách hàng",
      render: (data) => {
        return (
          <a
            className="text-collaborator"
            onClick={() =>
              navigate("/profile-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
          >
            {data?.id_customer?.full_name}
          </a>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a className="text-service">
              {data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại"
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? "Theo giờ"
                : data?.service?._id?.kind === "giup_viec_co_dinh"
                ? "Cố định"
                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                ? "Phục vụ"
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a className="text-service">
              {moment(new Date(data.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-service">
              {moment(new Date(data.date_work_schedule[0].date))
                .lang("VI")
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => {
        return <a className="text-address-dashboard">{data?.address}</a>;
      },
    },
    {
      title: "Cộng tác viên",
      render: (data) => {
        return (
          <div>
            {!data?.id_collaborator ? (
              <a className="text-find-collaborator">Đang tìm kiếm</a>
            ) : (
              <a
                onClick={() =>
                  navigate("/details-collaborator", {
                    state: { id: data?.id_collaborator?._id },
                  })
                }
                className="text-collaborator"
              >
                {data?.id_collaborator.full_name}
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: "Tiến độ",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending"
              : data?.status === "confirm"
              ? "text-confirm"
              : data?.status === "doing"
              ? "text-doing"
              : data?.status === "done"
              ? "text-done"
              : "text-cancel"
          }
        >
          {data?.status === "pending"
            ? "Đang chờ làm"
            : data?.status === "confirm"
            ? "Đã nhận"
            : data?.status === "doing"
            ? "Đang làm"
            : data?.status === "done"
            ? "Hoàn thành"
            : "Đã huỷ"}
        </a>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (data) => {
        return (
          <div className="div-action">
            {/* <button className="btn-click">Thao tác</button> */}
            <button
              className="btn-details"
              onClick={() =>
                navigate("/details-order", {
                  state: { id: data?._id },
                })
              }
            >
              Chi tiết
            </button>
          </div>
        );
      },
    },
  ];

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart">
        <a className="date-text">
          Ngày: {moment(new Date(label)).format("DD/MM/YYYY")}
        </a>

        <a className="money-text-dashboard">
          Tổng tiền:{" "}
          {payload?.length > 0
            ? formatMoney(payload[0]?.payload?.total_income)
            : 0}
        </a>

        <a className="date-text">
          Tổng đơn: {payload?.length > 0 ? payload[0]?.payload?.total_job : 0}
        </a>
      </div>
    );
  };

  return (
    <div className="container-dash">
      <Header />
      <div>
        <div className="mt-4 mb-4">
          <Row>
            <Col lg="9">
              <div className="chart">
                <div className="div-head-chart">
                  <div className="div-date">
                    <CustomDatePicker
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      onClick={onChange}
                      onCancel={() => {}}
                    />
                    {startDate && (
                      <a className="text-date">
                        {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
                        {moment(endDate).utc().format("DD/MM/YYYY")}
                      </a>
                    )}
                  </div>
                  <a className="text-total-money">
                    Tổng tiền: {formatMoney(totalMoneyChart)}
                  </a>
                </div>
                <div>
                  <ResponsiveContainer
                    width={"100%"}
                    height={350}
                    min-width={300}
                  >
                    <AreaChart
                      width={window.screen.height / 1.2}
                      height={400}
                      data={arrResult}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date_start"
                        tickFormatter={(tickItem) =>
                          moment(tickItem).format("DD/MM")
                        }
                      />
                      <YAxis
                        dataKey="total_income"
                        fontSize={12}
                        tickFormatter={(tickItem) =>
                          number_processing(tickItem)
                        }
                      />
                      <Tooltip content={renderTooltipContent} />
                      <Area
                        type="monotone"
                        dataKey="total_income"
                        stroke="#00CF3A"
                        fill="#00CF3A"
                        name="Tổng tiền"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <Row>
                  <Col lg="7" className="pl-4">
                    <p className="label-persen-active">Phần trăm hoạt động</p>
                    <div className="div-persen">
                      <p className="label-persen">{activeUser?.donePercent}%</p>
                      <p className="label-total">Tổng</p>
                    </div>
                    <Progress
                      percent={activeUser?.donePercent}
                      showInfo={false}
                      strokeColor={"#48CAE4"}
                      className="progress-persent"
                      strokeWidth={15}
                    />
                    <div className="div-container-on">
                      <div className="div-on">
                        <div className="line-on" />
                        <div className="total-div-on">
                          <a className="text-on">Online</a>
                          <a className="text-total-on">
                            {activeUser?.ActiveUsers}
                          </a>
                        </div>
                      </div>

                      <div className="div-on">
                        <div className="line-off" />
                        <div className="total-div-on">
                          <a className="text-on">Ofline</a>
                          <a className="text-total-on">
                            {activeUser?.OfflineUsers}
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="5">
                    {/* <p className="label-persen-active">Active Users</p>
                    <p className="label-active">2154</p>
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hồ Chí Minh</a>
                    </div> */}
                    {/* <div>
                      <Progress
                        percent={73}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Đà Nẵng</a>
                    </div>
                    <div>
                      <Progress
                        percent={20}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hà Nội</a>
                    </div> */}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg="3">
              <div className="div-connect-service">
                <div className="div-progress">
                  <Progress
                    type="dashboard"
                    percent={
                      !connectionService?.donePercent
                        ? 0
                        : connectionService?.donePercent
                    }
                    gapDegree={5}
                    strokeColor={"#48CAE4"}
                    strokeWidth={15}
                    width={150}
                  />
                </div>
                <div className="div-progress-text">
                  <p className="title-progress">Tỉ lệ dịch vụ kết nối</p>
                </div>
                <div className="div-success">
                  <a className="square" />
                  <p className="text-success-square">Hoàn thành</p>
                </div>
                <div className="div-success">
                  <a className="unsquare" />
                  <p className="text-success-square">Chưa hoàn thành</p>
                </div>
              </div>
              {topCollaborator.length > 0 && (
                <div className="div-top-collaborator">
                  <p className="text-top">Top CTV</p>
                  <div className="level">
                    <div
                      className="level-ctv1"
                      onClick={() =>
                        navigate("/details-collaborator", {
                          state: {
                            id: topCollaborator[0]?._id?.id_collaborator,
                          },
                        })
                      }
                    >
                      <p className="text-level">
                        {topCollaborator[0]?._id?.full_name}
                      </p>
                      <p className="text-level-number">
                        {formatMoney(topCollaborator[0]?.sumIncome)}
                      </p>
                    </div>
                    {topCollaborator.length > 1 && (
                      <div
                        className="level-ctv2"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[1]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[1]?._id?.name}
                        </p>
                        <p className="text-level-number">
                          {formatMoney(topCollaborator[1]?.sumIncome)}
                        </p>
                      </div>
                    )}
                    {topCollaborator.length > 2 && (
                      <div
                        className="level-ctv3"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[2]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[2]?._id?.name}
                        </p>
                        <p className="text-level-number">
                          {formatMoney(topCollaborator[2]?.sumIncome)}
                        </p>
                      </div>
                    )}
                    {topCollaborator.length > 3 && (
                      <div
                        className="level-ctv4"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[3]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[3]?._id?.name}
                        </p>
                        <p className="text-level-number">
                          {formatMoney(topCollaborator[3]?.sumIncome)}
                        </p>
                      </div>
                    )}
                    {topCollaborator.length > 4 && (
                      <div
                        className="level-ctv5"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[4]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[4]?._id?.name}
                        </p>
                        <p className="text-level-number">
                          {formatMoney(topCollaborator[4]?.sumIncome)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="div-seemore">
                    <MoreTopCollaborator />
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
        <p className="label-service">DỊCH VỤ GẦN NHẤT</p>
        <Row className=" mb-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardBody className="sm:bg-red-500">
                <Table
                  columns={columns}
                  dataSource={lastestService}
                  pagination={false}
                />
              </CardBody>
              <div className="div-entries">
                {/* <CustomTextInput
                  label={"Hiện"}
                  type="select"
                  className={"select-entries"}
                  onChange={(e) => onChangeNumberData(e.target.value)}
                  body={
                    <>
                      <option value={"5"}>5</option>
                      <option value={"10"}>10</option>
                      <option value={"20"}>20</option>
                    </>
                  }
                /> */}
                <Select
                  style={{ width: 60 }}
                  defaultValue={"5"}
                  onChange={onChangeNumberData}
                  options={[
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                    { value: 20, label: "20" },
                  ]}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <div>
          <Row>
            <Col lg="9">
              {/* <div className="div-chart-pie">
                <div>
                  <a>TOP DỊCH VỤ</a>
                </div>
                <Row>
                  <Col>
                    <div className="div-pieChart">
                      <div>
                        <div className="div-service-hours">
                          <div className="div-towhours" />
                          <a>2 Giờ</a>
                        </div>
                        <div className="div-service-hours">
                          <div className="div-threehours" />
                          <a>3 Giờ</a>
                        </div>
                        <div className="div-service-hours">
                          <div className="div-fourhours" />
                          <a>4 Giờ</a>
                        </div>
                        <div className="div-service-hours">
                          <div className="div-different" />
                          <a>Khác</a>
                        </div>
                      </div>
                      <div className="div-chart-de">
                        <PieChart width={300} height={320}>
                          <Pie
                            data={data}
                            cx={120}
                            cy={200}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </div>
                    </div>
                  </Col>
                  <Col className="mt-5">
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                      />
                      <a>Hồ Chí Minh</a>
                    </div>
                  </Col>
                </Row>
              </div> */}
            </Col>
            <Col lg="3">
              <div className="col-activity">
                <p className="label-activity">Hoạt động</p>
                <List
                  itemLayout="horizontal"
                  dataSource={historyActivity.slice(0, 4)}
                  renderItem={(item, index) => {
                    const subject = item?.id_admin_action
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
                      : item?.id_promotion
                      ? item?.title_admin.replace(
                          item?.id_promotion?._id,
                          item?.id_promotion?.code
                        )
                      : "";

                    const predicate = item?.id_address
                      ? subject.replace(item?.id_address, item?.value_string)
                      : item?.id_order
                      ? subject.replace(
                          item?.id_order?._id,
                          item?.id_order?.id_view
                        )
                      : item?.id_promotion
                      ? subject.replace(
                          item?.id_promotion?._id,
                          item?.id_promotion?.title?.vi
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
                      ? predicate.replace(
                          item?.id_order?._id,
                          item?.id_order?.id_view
                        )
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
                      <div className="div-list" key={index}>
                        <div className="div-line">
                          <div className="circle" />
                          <div className="line-vertical" />
                        </div>
                        <div className="div-details-activity">
                          <a className="text-date-activity">
                            {moment(new Date(item?.date_create)).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </a>
                          <a className="text-content-activity">{object}</a>
                        </div>
                      </div>
                    );
                  }}
                />
                <MoreActivity />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
