import React, { useEffect, useState } from "react";
import "./index.scss";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import DataTable from "../../../../../components/tables/dataTable";
import FilterData from "../../../../../components/filterData";
import { errorNotify } from "../../../../../helper/toast";
import { getReportOrderDaily } from "../../../../../api/report";

const ReportOrderDoneDaily = () => {
  /* ~~~ Value ~~~ */
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  /* ~~~ List ~~~ */
  const [listData, setListData] = useState([]);
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      dataIndex: "",
      key: "ordinal",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày tạo" />,
      dataIndex: "_id",
      key: "id_date_work",
      width: 100,
      position: "center",
      navigate: "/report/manage-report/report-detail-revenue",
    },
    {
      customTitle: <CustomHeaderDatatable title="Số đơn hàng" />,
      dataIndex: "total_item",
      key: "number",
      width: 130,
      position: "center",
    },
    // {
    //   customTitle: <CustomHeaderDatatable title="Trạng thái" />,
    //   dataIndex: "status",
    //   key: "status",
    //   width: 120,
    // },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng giá trị giao dịch"
          //   subValue={totalValue?.total_fee}
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume (total_fee)"
        />
      ),
      dataIndex: "total_fee",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thu hộ dịch vụ"
          //   subValue={totalValue?.total_net_income_new}
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả đối tác: tiền tip từ khách,... (net_income)"
        />
      ),
      dataIndex: "total_net_income_new",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu"
          //   subValue={
          //     // totalValue?.total_fee - totalValue?.total_net_income_new || null
          //   }
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
        />
      ),
      dataIndex: "revenue",
      key: "money",
      width: 120,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giảm giá"
          //   subValue={totalValue?.total_discount_new || null}
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ: giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
        />
      ),
      dataIndex: "total_discount_new",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu thuần"
          //   subValue={
          //     totalValue?.total_fee -
          //     totalValue?.total_net_income_new -
          //     totalValue?.total_discount_new || null
          //   }
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
        />
      ),
      dataIndex: "net_revenue",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng hóa đơn"
          //   subValue={totalValue?.total_fee - totalValue?.total_discount_new || null}
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
        />
      ),
      dataIndex: "invoice",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giá vốn"
          //   subValue={totalValue?.punishss }
          typeSubValue="money"
        />
      ),
      dataIndex: "punishss",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Phí áp dụng"
          //   subValue={totalValue?.total_service_fee}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_service_fee",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thuế"
          //   subValue={totalValue?.total_tax}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_tax",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng lợi nhuận"
          //   subValue={
          //     totalValue?.total_fee -
          //     totalValue?.total_net_income_new -
          //     totalValue?.total_discount_new || null
          //   }
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần + thu nhập khác"
        />
      ),
      dataIndex: "net_revenue",
      key: "money",
      width: 150,
    },

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Lợi nhuận sau thuế"
          //   subValue={
          //     totalValue?.total_fee -
          //     totalValue?.total_net_income_new -
          //     totalValue?.total_discount_new -
          //     totalValue?.total_tax || null
          //   }
          typeSubValue="money"
          textToolTip="Lợi nhuận sau thuế = Tổng lợi nhuận (-) Thuế"
        />
      ),
      dataIndex: "profit_after_tax",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="% Lợi nhuận"
          typeSubValue="percent"
          textToolTip="% Lợi nhuận = Lời nhuận sau thuế (/) Tổng lời nhuận"
        />
      ),
      dataIndex: "percent_income_envenue",
      key: "percent",
      width: 120,
      position: "center",
    },
  ];
  /* ~~~ Handle function ~~~ */
  const fetchReportOrderDaily = async () => {
    try {
      setIsLoading(true);
      const res = await getReportOrderDaily(
        start,
        lengthPage,
        startDate,
        endDate,
        "date_create",
        -1,
        "date_create",
        "done"
      );
      setListData(res?.data);
      setTotal(res?.totalItem);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setIsLoading(false);
    }
  };
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    fetchReportOrderDaily();
  }, []);
  /* ~~~ Other ~~~ */
  /* ~~~ Main ~~~ */
  return (
    <div className="report-order-daily-revenue">
      <div className="report-order-daily-revenue__header">
        <span className="report-order-daily-revenue__header--title">
          Báo cáo doanh thu từng ngày
        </span>
        <div>
          <FilterData
            isTimeFilter={true}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={listData}
          start={start}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          onCurrentPageChange={setStart}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReportOrderDoneDaily;
