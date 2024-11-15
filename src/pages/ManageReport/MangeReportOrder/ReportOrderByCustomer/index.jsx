import { formatMoney } from "../../../../helper/formatMoney";
import {getReportOrderByCustomer, getReportTotalOrderByCustomer} from "../../../../api/report"
import { Pagination, Popover, Table, Select } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getReportOrder } from "../../../../api/report";
import DataTable from "../../../../components/tables/dataTable"
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
import i18n from "../../../../i18n";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import { getLanguageState } from "../../../../redux/selectors/auth";
import CardMultiInfo from "../../../../components/card/cardMultiInfo"

import "./index.scss";



const ReportOrderByCustomer = () => {
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  /* ~~~ Value ~~~ */
  // const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTotal, setDataTotal] = useState({}); // Lưu các giá trị tổng của từng giá trị tương ứng với label của từng cột
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sameStartDate, setSameStartDate] = useState(""); // Giá trị thời gian tương ứng cho ngày bắt đầu nhưng lùi lại 1 tháng
  const [sameEndDate, setSameEndDate] = useState(""); // Giá trị thời gian tương ứng cho ngày kết thúc nhung lùi lại 1 tháng
  const [start, setStart] = useState(0);
  const [typeCustomer, setTypeCustomer] = useState("all");
  const [typeDate, setTypeDate] = useState("date_create");
  const [detectLoading, setDetectLoading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // 1. Các giá trị của khách hàng mới
  const [customerNew, setCustomerNew] = useState({
    mainInfo: {
      title: "Khách hàng mới",
      detail: 0,
      percentPeriod: 0,
    },
    secondInfo: [
      {
        title: "Tổng giá trị giao dịch",
        detail: 0,
        percentPeriod: 0,
      },
      {
        title: "Đơn hàng",
        detail: 0,
        percentPeriod: 0,
      },
    ],
  });
  // 2. Các giá trị của khách hàng cũ
  const [customerOld, setCustomerOld] = useState({
    mainInfo: {
      title: "Khách hàng mới",
      detail: 0,
      percentPeriod: 0,
    },
    secondInfo: [
      {
        title: "Tổng giá trị giao dịch",
        detail: 0,
        percentPeriod: 0,
      },
      {
        title: "Đơn hàng",
        detail: 0,
        percentPeriod: 0,
      },
    ],
  });
  /* ~~~ List ~~~ */
  const CustomHeaderDatatable = ({
    title,
    subValue,
    typeSubValue,
    textToolTip,
  }) => {
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
  // 1. Danh sách các cột của bảng
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="Khách hàng" />,
      dataIndex: "id_customer.full_name",
      key: "id_customer_report",
      width: 100,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable title="Số ĐH" subValue={dataTotal?.total_item} />
      ),
      dataIndex: "total_item",
      key: "number",
      width: 50,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
          title="Giá vốn"
          subValue={dataTotal?.cost_price}
          typeSubValue="money"
        />
      ),
      dataIndex: "cost_price",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu bảng
  useEffect(() => {
    if (startDate !== "") {
      setDetectLoading(sameStartDate);
      // const oneDay = 24 * 60 * 60 * 1000;
      // const diffDays = Math.round(
      //   Math.abs(
      //     (new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDay
      //   )
      // );
      getDataReportOrderByCustomer();
      getDataReportTotalOrderByCustomer();
    }
  }, [sameStartDate, sameEndDate, lengthPage]);
  // 2. Fetch dữ liệu bảng (thừa, coi viết lại cho đúng)
  useEffect(() => {
    if (startDate !== "") {
      setDetectLoading(start + typeCustomer);
      getDataReportOrderByCustomer();
    }
  }, [start, typeCustomer, lengthPage]);
  // 3. Tính kì trước nhưng chỉ giới hạn là theo tháng (sai, sửa lại nốt là chạy theo chính xác theo mốc thời gian đã chọn,
  // rangDatePicker có trả về thời gian bắt đầu và thời gian kết thúc của kì trước, lấy ra mà xài là done)
  useEffect(() => {
    if (startDate !== "") {
      const timeStartDate = new Date(startDate).getTime();
      const timeEndDate = new Date(endDate).getTime();
      const rangeDate = timeEndDate - timeStartDate;
      const tempSameEndDate = timeStartDate - 1;
      const tempSameStartDate = tempSameEndDate - rangeDate;

      setSameStartDate(new Date(tempSameStartDate).toISOString());
      setSameEndDate(new Date(tempSameEndDate).toISOString());
    }
  }, [startDate, endDate]);
  /* ~~~ Handle function ~~~ */
  // 1. Hàm fetch dữ liệu bảng
  const getDataReportOrderByCustomer = async () => {
    const res = await getReportOrderByCustomer(
      startDate,
      endDate,
      typeCustomer,
      typeDate,
      start,
      lengthPage
    );
    console.log("check response >>>", res);
    setData(res.data);
    setTotal(res?.totalItem);
    setDataTotal(res?.total[0]);
  };
  // 2. Hàm fetch các giá trị của hai thẻ thống kê, sau khi có giá trị rồi thì tính toán và lưu lại
  const getDataReportTotalOrderByCustomer = async () => {
    // Hàm sẽ trả về một mảng rồi các giá trị total và totalItem: tổng số lượng khách hàng
    const arrGetResult = await Promise.all([
      getReportTotalOrderByCustomer(startDate, endDate, "new", typeDate),
      getReportTotalOrderByCustomer(startDate, endDate, "old", typeDate),
      getReportTotalOrderByCustomer(
        sameStartDate,
        sameEndDate,
        "new",
        typeDate
      ),
      getReportTotalOrderByCustomer(
        sameStartDate,
        sameEndDate,
        "old",
        typeDate
      ),
    ]);

    // const tempPercentCustomer = (arrGetResult[0].totalItem*100/(arrGetResult[0].totalItem + arrGetResult[2].totalItem)).toFixed(2);
    // const tempSamePercentCustomer = (arrGetResult[2].totalItem*100/(arrGetResult[0].totalItem + arrGetResult[2].totalItem)).toFixed(2);

    // const tempPercentTotalGrossIncome =
    // (arrGetResult[0].total[0].total_gross_income*100/(arrGetResult[0].total[0].total_gross_income + arrGetResult[2].total[0].total_gross_income)).toFixed(2)
    // const tempSamePercentTotalGrossIncome =
    // (arrGetResult[2].total[0].total_gross_income*100/(arrGetResult[0].total[0].total_gross_income + arrGetResult[2].total[0].total_gross_income)).toFixed(2)

    // const tempPercentTotalOrder = (arrGetResult[0].total[0].total_item*100/(arrGetResult[0].total[0].total_item + arrGetResult[2].total[0].total_item)).toFixed(2)
    // const tempSamePercentTotalOrder = (arrGetResult[2].total[0].total_item*100/(arrGetResult[0].total[0].total_item + arrGetResult[2].total[0].total_item)).toFixed(2)

    const tempPercentCustomer =
      arrGetResult[0].totalItem / arrGetResult[2].totalItem - 1;

    const tempPercentTotalGrossIncome =
      arrGetResult[0].total[0].total_gross_income /
        arrGetResult[2].total[0].total_gross_income -
      1;

    const tempPercentTotalOrder =
      arrGetResult[0].total[0].total_item /
        arrGetResult[2].total[0].total_item -
      1;

    setCustomerNew({
      mainInfo: {
        title: "Khách hàng mới",
        detail: arrGetResult[0].totalItem || 0,
        percentPeriod: Math.abs(tempPercentCustomer * 100).toFixed(2),
        arrow: tempPercentCustomer > 0 ? "up" : "down",
      },
      secondInfo: [
        {
          title: "Tổng giá trị giao dịch",
          detail: formatMoney(arrGetResult[0].total[0].total_gross_income) || 0,
          percentPeriod: Math.abs(tempPercentTotalGrossIncome * 100).toFixed(2),
          arrow: tempPercentTotalGrossIncome > 0 ? "up" : "down",
        },
        {
          title: "Đơn hàng",
          detail: arrGetResult[0].total[0].total_item + " đơn" || 0 + " đơn",
          percentPeriod: Math.abs(tempPercentTotalOrder * 100).toFixed(2),
          arrow: tempPercentTotalOrder > 0 ? "up" : "down",
        },
      ],
    });

    // const tempPercentCustomerOld = (arrGetResult[1].totalItem*100/(arrGetResult[1].totalItem + arrGetResult[3].totalItem)).toFixed(2);
    // const tempSamePercentCustomerOld = (arrGetResult[3].totalItem*100/(arrGetResult[1].totalItem + arrGetResult[3].totalItem)).toFixed(2);

    // const tempPercentTotalGrossIncomeOld =
    // (arrGetResult[1].total[0].total_gross_income*100/(arrGetResult[1].total[0].total_gross_income + arrGetResult[3].total[0].total_gross_income)).toFixed(2)
    // const tempSamePercentTotalGrossIncomeOld =
    // (arrGetResult[3].total[0].total_gross_income*100/(arrGetResult[1].total[0].total_gross_income + arrGetResult[3].total[0].total_gross_income)).toFixed(2)

    // const tempPercentTotalOrderOld = (arrGetResult[1].total[0].total_item*100/(arrGetResult[1].total[0].total_item + arrGetResult[3].total[0].total_item)).toFixed(2)
    // const tempSamePercentTotalOrderOld = (arrGetResult[3].total[0].total_item*100/(arrGetResult[1].total[0].total_item + arrGetResult[3].total[0].total_item)).toFixed(2)

    const tempPercentCustomerOld =
      arrGetResult[1].totalItem / arrGetResult[3].totalItem - 1;
    const tempPercentTotalGrossIncomeOld =
      arrGetResult[1].total[0].total_gross_income /
        arrGetResult[3].total[0].total_gross_income -
      1;
    const tempPercentTotalOrderOld =
      arrGetResult[1].total[0].total_item /
        arrGetResult[3].total[0].total_item -
      1;

    setCustomerOld({
      mainInfo: {
        title: "Khách hàng cũ",
        detail: arrGetResult[1]?.totalItem || 0,
        percentPeriod: Math.abs(tempPercentCustomerOld * 100).toFixed(2),
        arrow: tempPercentCustomerOld > 0 ? "up" : "down",
      },
      secondInfo: [
        {
          title: "Tổng giá trị giao dịch",
          detail: formatMoney(
            arrGetResult[1].total[0]?.total_gross_income || 0
          ),
          percentPeriod: Math.abs(tempPercentTotalGrossIncomeOld * 100).toFixed(
            2
          ),
          arrow: tempPercentTotalGrossIncomeOld > 0 ? "up" : "down",
        },
        {
          title: "Đơn hàng",
          detail: arrGetResult[1].total[0]?.total_item + " đơn" || 0 + " đơn",
          percentPeriod: Math.abs(tempPercentTotalOrderOld * 100).toFixed(2),
          arrow: tempPercentTotalOrderOld > 0 ? "up" : "down",
        },
      ],
    });
  };
  /* ~~~ Other ~~~ */
  const changeTypeCustomer = (value) => {
    setTypeCustomer(value);
  };
  /* ~~~ Main ~~~ */
  return (
    <React.Fragment>
      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">
              Báo cáo số lượng đơn hàng theo khách hàng
            </h4>
          </div>
        </div>

        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              defaults={"thirty_last"}
            />
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ này: {moment(startDate).format("DD/MM/YYYY")}-
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ trước: {moment(sameStartDate).format("DD/MM/YYYY")}-
              {moment(sameEndDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="div-flex-row">
          <CardMultiInfo
            mainInfo={customerNew.mainInfo}
            secondInfo={customerNew.secondInfo}
          />
          <CardMultiInfo
            mainInfo={customerOld.mainInfo}
            secondInfo={customerOld.secondInfo}
          />
        </div>

        {/* <div className="div-flex-row-flex-start">
          <div className="block-content-100">
            <div className="header">
              <div className="text-header">
                <p>Lượng đơn hàng</p>
              </div>
              <HeaderInfoCharts total={headerChartsOrder.total} arrow={headerChartsOrder.arrow} percentSame={headerChartsOrder.percent} />
            </div>
            <div className="content">
              {
                dataChartsOrder?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataChartsOrder}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineOrder.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
        </div> */}

        <div className="div-flex-row">
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={changeTypeCustomer}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "new", label: "Khách hàng mới" },
              { value: "old", label: "Khách hàng cũ" },
            ]}
          />
        </div>

        <div className="div-flex-row-start">
          <DataTable
            columns={columns}
            data={data}
            // actionColumn={addActionColumn}
            start={startPage}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={total}
            detectLoading={detectLoading}
            // getItemRow={setItem}
            onCurrentPageChange={setStart}
          />
        </div>
      </div>
    </React.Fragment>
  );
}


export default ReportOrderByCustomer;