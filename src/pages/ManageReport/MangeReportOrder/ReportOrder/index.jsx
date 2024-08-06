import { Pagination, Popover, Table, Select } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getReportOrder } from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";
import LoadingPagination from "../../../../components/paginationLoading";
import { formatMoney } from "../../../../helper/formatMoney";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
import DataTable from "../../../../components/tables/dataTable";
import CardMultiInfo from "../../../../components/card/cardMultiInfo";
import "./index.scss";
const ReportOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTotal, setDataTotal] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [start, setStart] = useState(0);

  const typeDate =
    window.location.pathname.slice(-5) === "-work"
      ? "date_work"
      : "date_create";

  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  const { state } = useLocation();
  const date = state?.date;

  const [selectStatus, setSelectStatus] = useState([
    "done",
    "doing",
    "confirm",
  ]);

  const [defaultRangeTime, setDefaultRangeTime] = useState(
    date
      ? [
          moment(date, "DD-MM-YYYY").startOf("date").toISOString(),
          moment(date, "DD-MM-YYYY").endOf("date").toISOString(),
        ]
      : "thirty_last"
  );
  const [orderStatus, setOrderStatus] = useState({
    total_item: 0,
    total_order_confirm: 0,
    total_order_done: 0,
    total_order_doing: 0,
  });

  useEffect(() => {
    if (date) {
      const startDate = moment(date, "DD-MM-YYYY")
        .startOf("date")
        .toISOString();
      const endDate = moment(date, "DD-MM-YYYY").endOf("date").toISOString();
      setStartDate(startDate);
      setEndDate(endDate);
    }
  }, []);

  useEffect(() => {
    if (startDate !== "") {
      getDataReportOrder();
    }
  }, [startDate, endDate, start, selectStatus,lengthPage]);

  const getDataReportOrder = async () => {
    const res = await getReportOrder(
      start,
      lengthPage,
      startDate,
      endDate,
      typeDate,
      selectStatus
    );
    setData(res?.data);
    setTotal(res?.totalItem);
    setDataTotal(res?.total[0]);
    setOrderStatus({
      total_item: res?.total[0]?.total_item,
      total_order_confirm: res?.total[0]?.total_order_confirm,
      total_order_done: res?.total[0]?.total_order_done,
      total_order_doing: res?.total[0]?.total_order_doing,
    });
  };

  // const getDataReportOrder = () => {
  //   getReportOrder(
  //     0,
  //     20,
  //     startDate,
  //     endDate,
  //     "date_work"
  //   )
  //     .then((res) => {
  //       setData(res?.data);
  //       setTotal(res?.totalItem);
  //       setDataTotal(res?.total[0]);
  //     })
  //     .catch((err) => {});
  // }
  // const columns2 = [
  //   {
  //     title: () => {
  //       return (
  //         <div className="div-title-collaborator-id">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("time", {
  //               lng: lang,
  //             })}`}</p>
  //           </div>
  //           <div className="div-top"></div>
  //         </div>
  //       );
  //     },
  //     render: (data) => (
  //       <div className="div-date-report-order">
  //         <p className="text-date-report-order">
  //           {moment(
  //             new Date(data?.date_work[0])
  //           ).format("DD/MM/YYYY")}
  //         </p>
  //         <p className="text-date-report-order">
  //           {moment(
  //             new Date(data?.date_work[0])
  //           ).format("HH:mm")}
  //         </p>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <div className="div-title-collaborator-id">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("code_order", {
  //               lng: lang,
  //             })}`}</p>
  //           </div>
  //           <div className="div-top"></div>
  //         </div>
  //       );
  //     },
  //     render: (data) => (
  //       <Link to={`/details-order/${data?.id_group_order?._id}`}>
  //         <p className="text-id-report-order">
  //           {data?.id_group_order?.id_view}
  //         </p>
  //       </Link>
  //     ),
  //     width: "5%",
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("shift", {
  //               lng: lang,
  //             })}`}</p>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_item > 0 ? dataTotal?.total_item : 0}
  //           </p>
  //         </div>
  //       );
  //     },
  //     render: (data) => {
  //       return <p className="text-money">{data?.total_item}</p>;
  //     },
  //     align: "center",
  //     width: "5%",
  //     sorter: (a, b) => a.total_item - b.total_item,
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("sales", {
  //               lng: lang,
  //             })}`}</p>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_gross_income > 0
  //               ? formatMoney(dataTotal?.total_gross_income)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">{formatMoney(data?.total_gross_income)}</p>
  //       );
  //     },
  //     width: "8%",
  //     sorter: (a, b) => a.total_gross_income - b.total_gross_income,
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">{`${i18n.t(
  //             "service_fee_pay_collaborator",
  //             {
  //               lng: lang,
  //             }
  //           )}`}</p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("service_fee", {
  //               lng: lang,
  //             })}`}</p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 200,
  //                 display: "flex",
  //                 flexWrap: "wrap",
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_collabotator_fee > 0
  //               ? formatMoney(dataTotal?.total_collabotator_fee)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">
  //           {formatMoney(data?.total_collabotator_fee)}
  //         </p>
  //       );
  //     },
  //     width: "10%",
  //     sorter: (a, b) => a.total_collabotator_fee - b.total_collabotator_fee,
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">
  //             {`${i18n.t("revenue_sales", { lng: lang })}`}
  //           </p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column-blue">{`${i18n.t("revenue", {
  //               lng: lang,
  //             })}`}</p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 300,
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <p className="text-money-title-blue">
  //             {dataTotal?.total_income > 0
  //               ? formatMoney(dataTotal?.total_income)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money-blue">{formatMoney(data?.total_income)}</p>
  //       );
  //     },
  //     width: "8%",
  //     sorter: (a, b) => a.total_income - b.total_income,
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">{`${i18n.t("total_discount", {
  //             lng: lang,
  //           })}`}</p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("discount", {
  //               lng: lang,
  //             })}`}</p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 200,
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_discount > 0
  //               ? formatMoney(dataTotal?.total_discount)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">{formatMoney(data?.total_discount)}</p>
  //       );
  //     },
  //     width: "8%",
  //     sorter: (a, b) => a.total_discount - b.total_discount,
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">
  //             {`${i18n.t("note_net_revenue", { lng: lang })}`}
  //           </p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("net_revenue", {
  //               lng: lang,
  //             })}`}</p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 300,
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_net_income > 0
  //               ? formatMoney(dataTotal?.total_net_income)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">{formatMoney(data?.total_net_income)}</p>
  //       );
  //     },
  //     width: "11%",
  //     sorter: (a, b) => a.total_net_income - b.total_net_income,
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("fees_apply", {
  //               lng: lang,
  //             })}`}</p>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_service_fee > 0
  //               ? formatMoney(dataTotal?.total_service_fee)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     render: (data) => {
  //       return (
  //         <p className="text-money">{formatMoney(data?.total_service_fee)}</p>
  //       );
  //     },
  //     align: "center",
  //     width: "7%",
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">
  //             {`${i18n.t("note_total_bill", {
  //               lng: lang,
  //             })}`}
  //           </p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("total_bill", {
  //               lng: lang,
  //             })}`}</p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 300,
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_order_fee > 0
  //               ? formatMoney(dataTotal?.total_order_fee)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">{formatMoney(data?.total_order_fee)}</p>
  //       );
  //     },
  //     width: "10%",
  //     sorter: (a, b) => a.total_order_fee - b.total_order_fee,
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">
  //             {`${i18n.t("note_profit", { lng: lang })}`}
  //           </p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">{`${i18n.t("profit", {
  //               lng: lang,
  //             })}`}</p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 300,
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <p className="text-money-title">
  //             {dataTotal?.total_net_income_business > 0
  //               ? formatMoney(dataTotal?.total_net_income_business)
  //               : formatMoney(0)}
  //           </p>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">
  //           {formatMoney(data?.total_net_income_business)}
  //         </p>
  //       );
  //     },
  //     width: "8%",
  //     sorter: (a, b) =>
  //       a.total_net_income_business - b.total_net_income_business,
  //   },
  //   {
  //     title: () => {
  //       const content = (
  //         <div className="div-content">
  //           <p className="text-content">
  //             %{" "}
  //             {`${i18n.t("percent_profit", {
  //               lng: lang,
  //             })}`}
  //           </p>
  //         </div>
  //       );
  //       return (
  //         <div className="div-title-order-report">
  //           <div className="div-title-report">
  //             <p className="text-title-column">
  //               %{" "}
  //               {`${i18n.t("profit", {
  //                 lng: lang,
  //               })}`}
  //             </p>
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //                 width: 280,
  //               }}
  //             >
  //               <div>
  //                 <i class="uil uil-question-circle icon-question"></i>
  //               </div>
  //             </Popover>
  //           </div>
  //           <div className="div-top"></div>
  //         </div>
  //       );
  //     },
  //     align: "center",
  //     render: (data) => {
  //       return (
  //         <p className="text-money">
  //           {data?.percent_income ? data?.percent_income + "%" : ""}
  //         </p>
  //       );
  //     },
  //   },
  // ];

  const HeaderInfo = ({ title, subValue, typeSubValue, textToolTip }) => {
    const content = <p>{textToolTip ? textToolTip : ""}</p>;
    if (subValue)
      subValue =
        typeSubValue === "money"
          ? formatMoney(subValue)
          : typeSubValue === "percent"
          ? subValue + " %"
          : subValue;
    if (title == "Giá vốn") subValue = "0 đ";
    return (
      <React.Fragment>
        <div className="header-table-custom">
          <div className="title-report">
            <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
              {title}
            </p>
            {textToolTip ? (
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                }}
              >
                <div>
                  <i
                    style={{
                      color: title === "Doanh thu" ? "#2463eb" : "none",
                    }}
                    class="uil uil-question-circle icon-question"
                  ></i>
                </div>
              </Popover>
            ) : (
              <></>
            )}
          </div>
          <div className="sub-value">
            {subValue ? (
              <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
                {subValue}
              </p>
            ) : (
              <div style={{ marginTop: "35px" }}></div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const columns = [
    {
      customTitle:
        typeDate === "date_work" ? (
          <HeaderInfo title="Ngày làm" />
        ) : (
          <HeaderInfo title="Ngày tạo" />
        ),
      dataIndex: typeDate === "date_work" ? "date_work" : "date_create",
      key: "date_hour",
      width: 50,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: <HeaderInfo title="Mã đơn" />,
      dataIndex: "id_view",
      key: "text_link",
      width: 90,
      fontSize: "text-size-M text-color-black text-weight-500",
    },
    {
      customTitle: <HeaderInfo title="Trạng thái" />,
      dataIndex: "status",
      key: "status",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Tổng giá trị giao dịch"
          subValue={dataTotal?.total_gross_income}
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume"
        />
      ),
      dataIndex: "total_gross_income",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Thu hộ dịch vụ"
          subValue={dataTotal?.total_collabotator_fee}
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả cho CTV, tiền tip từ khách,…"
        />
      ),
      dataIndex: "total_collabotator_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Doanh thu"
          subValue={dataTotal?.total_income}
          typeSubValue="money"
          textToolTip=""
        />
      ),
      dataIndex: "total_income",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-color-1 text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Giảm giá"
          subValue={dataTotal?.total_discount}
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
        />
      ),
      dataIndex: "total_discount",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },

    {
      customTitle: (
        <HeaderInfo
          title="Doanh thu thuần"
          subValue={dataTotal?.total_net_income}
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
        />
      ),
      dataIndex: "total_net_income",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Tổng hoá đơn"
          subValue={dataTotal?.total_order_fee}
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
        />
      ),
      dataIndex: "total_order_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Giá vốn"
          subValue={dataTotal?.punishss}
          typeSubValue="money"
        />
      ),
      dataIndex: "punishss",
      key: "money",
      width: 90,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Thu nhập khác"
          subValue={dataTotal?.punish}
          typeSubValue="money"
          textToolTip="Bao gồm phí phạt trễ và huỷ ca"
        />
      ),
      dataIndex: "punish",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Tổng lợi nhuận"
          subValue={dataTotal?.total_net_income_business}
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần + thu nhập khác"
        />
      ),
      dataIndex: "total_net_income_business",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="% Lợi nhuận"
          subValue={dataTotal?.percent_income}
          typeSubValue="percent"
          textToolTip="% Lợi nhuận = Tổng lợi nhuận (/) Doanh thu."
        />
      ),
      dataIndex: "percent_income",
      key: "percent",
      width: 90,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Phí áp dụng"
          subValue={dataTotal?.total_service_fee}
          typeSubValue="money"
        />
      ),
      title: "Phí áp dụng",
      dataIndex: "total_service_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
  ];

  const onChange = useCallback(
    (page) => {
      // setIsLoading(true);
      setCurrentPage(page);
      const start = page * lengthPage - lengthPage;
      setStartPage(start);
      getReportOrder(start, lengthPage, startDate, endDate, "date_work")
        .then((res) => {
          setIsLoading(false);
          setData(res?.data);
          setTotal(res?.totalItem);
          setDataTotal(res?.total[0]);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    },
    [data, startDate, endDate]
  );

  const onChangeDay = () => {
    setIsLoading(true);

    getReportOrder(startPage, 20, startDate, endDate, "date_work")
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const changeStatusOrder = (value) => {
    setSelectStatus(value);
  };
  return (
    <div className="div-container-content">
      <div className="div-flex-row">
        {/* <div className="div-header-container"> */}
        <div className="">
          <h4 className="title-cv">{`${i18n.t("order_report", {
            lng: lang,
          })}`}</h4>
          <div className="div-range-date">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              defaults={defaultRangeTime}
            />
            <p className="date">
              {moment(startDate).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        {/* <div className="total-order-status">
      <CardMultiInfo
            mainInfo={orderStatus.mainInfo} 
            secondInfo={orderStatus.secondInfo}
            />
      </div> */}
      </div>
      <div className="div-flex-row">
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Tổng đơn hàng</a>
            <a class="text-detail">{orderStatus.total_item}</a>
          </div>
        </div>
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Đơn hoàn thành</a>
            <a class="text-detail">{orderStatus.total_order_done}</a>
          </div>
        </div>
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Đơn đang làm</a>
            <a class="text-detail">{orderStatus.total_order_doing}</a>
          </div>
        </div>
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Đơn đã nhận</a>
            <a class="text-detail">{orderStatus.total_order_confirm}</a>
          </div>
        </div>
      </div>

      <div className="div-flex-row">
        <Select
          mode="multiple"
          defaultValue="all"
          onChange={changeStatusOrder}
          value={selectStatus}
          options={[
            { value: "done", label: "Hoàn thành" },
            { value: "doing", label: "Đang làm" },
            { value: "confirm", label: "Đã nhận" },
          ]}
        />
      </div>

      {/* <div className="div-flex-row">
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
                <a class="text-title">Tổng đơn hàng</a>
                <a class="text-detail">{orderStatus.total_item}</a>
              </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
                <a class="text-title">Đơn hoàn thành</a>
                <a class="text-detail">{orderStatus.total_order_done}</a>
              </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
              <a class="text-title">Đơn đang làm</a>
                <a class="text-detail">{orderStatus.total_order_doing}</a>
              </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
              <a class="text-title">Đơn đã nhận</a>
                <a class="text-detail">{orderStatus.total_order_confirm}</a>
              </div>
          </div>
      </div> */}

      {/* <div className="div-flex-row">
          <CardMultiInfo
            mainInfo={orderStatus.mainInfo} 
            secondInfo={orderStatus.secondInfo}
            />
        </div> */}

      <div>
        <DataTable
          columns={columns}
          data={data}
          // actionColumn={addActionColumn}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          // detectLoading={detectLoading}
          // getItemRow={setItem}
          onCurrentPageChange={setStart}
        />
      </div>
    </div>
  );
};

export default ReportOrder;
