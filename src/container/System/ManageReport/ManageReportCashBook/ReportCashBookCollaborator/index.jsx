import React, { useEffect, useState } from "react";
import DataTable from "../../../../../components/tables/dataTable";
import FilterData from "../../../../../components/filterData";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import moment from "moment";
import icons from "../../../../../utils/icons";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import {
  getDetailReportCashBookApi,
  getDetailReportCashBookCollaboratorApi,
  getReportCashBookCollaboratorApi,
} from "../../../../../api/report";
import { exportToExcel } from "../../../../../utils/contant";
import ButtonCustom from "../../../../../components/button";

const { IoReceipt, IoCash, IoTrendingUp, IoHappy } = icons;

const ReportCashBookCollaborator = () => {
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
  const [previousStartDate, setPreviousStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [previousEndDate, setPreviousEndDate] = useState("");
  /* ~~~ List ~~~ */
  const [listData, setListData] = useState([]);
  const [listTotalStatistic, setListTotalStatistic] = useState([]);
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      dataIndex: "",
      key: "ordinal",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày báo cáo" />,
      dataIndex: "_id",
      key: "id_date_work",
      width: 100,
      position: "center",
      fontSize: "cursor-pointer",
      navigate: "/report/manage-report/report-detail-cash-book-collaborator",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng thu"
          subValue={listTotalStatistic?.total_income_from_collaborators}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_income_from_collaborators",
      key: "money",
      width: 130,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng thu vào từ ngân hàng"
          subValue={listTotalStatistic?.total_income_from_collaborators_bank}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_income_from_collaborators_bank",
      key: "money",
      width: 170,
      childArray: 0,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng thu vào từ momo"
          subValue={listTotalStatistic?.total_income_from_collaborators_momo}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_income_from_collaborators_momo",
      key: "money",
      width: 170,
      childArray: 1,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng chi"
          subValue={listTotalStatistic?.total_expenses_for_collaborators}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_expenses_for_collaborators",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng chi ra bằng ngân hàng"
          subValue={listTotalStatistic?.total_expenses_for_collaborators_bank}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_expenses_for_collaborators_bank",
      key: "money",
      width: 170,
      childArray: 0,
      childArrayIndex: "money",
    },
  ];
  /* ~~~ Handle function ~~~ */
  const fetchDataReportCashBookCollaborator = async (payload) => {
    try {
      // setIsLoading(true);
      const res = await getReportCashBookCollaboratorApi(
        payload.start,
        payload.lengthPage,
        payload.startDate,
        payload.endDate
      );
      setListData(res?.data);
      setTotal(res?.total);
      setListTotalStatistic(res?.totalItem[0]);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    fetchDataReportCashBookCollaborator({
      start,
      lengthPage,
      startDate,
      endDate,
    });
  }, [start, lengthPage, start, endDate]);
  // 3. Tính toán thời gian của kỳ trước dựa trên kỳ hiện tại
  useEffect(() => {
    if (startDate !== "") {
      const timeStartDate = new Date(startDate).getTime();
      const timeEndDate = new Date(endDate).getTime();
      const rangeDate = timeEndDate - timeStartDate;
      const tempSameEndDate = timeStartDate - 1;
      const tempSameStartDate = tempSameEndDate - rangeDate;
      setPreviousStartDate(new Date(tempSameStartDate).toISOString());
      setPreviousEndDate(new Date(tempSameEndDate).toISOString());
    }
  }, [startDate, endDate]);
  /* ~~~ Other ~~~ */
  const rightContent = (
    startDate,
    endDate,
    previousStartDate,
    previousEndDate
  ) => {
    return (
      <div className="report-order-daily-revenue__previous-period">
        <div className="report-order-daily-revenue__previous-period-child">
          <span>Kỳ này&nbsp;</span>
          <div className="line"></div>
          <span className="report-order-daily-revenue__previous-period-child-value">
            {startDate}&nbsp;-&nbsp;{endDate}
          </span>
        </div>
        <div className="report-order-daily-revenue__previous-period-child">
          <span>Kỳ trước&nbsp;</span>
          <div className="line"></div>
          <span className="report-order-daily-revenue__previous-period-child-value">
            {previousStartDate}&nbsp;-&nbsp;{previousEndDate}
          </span>
        </div>
      </div>
    );
  };

  const leftContent = () => {
    return (
      <div>
        <ButtonCustom
          label="Xuất Excel"
          customColor="green"
          onClick={() => exportToExcel(listData, "Bao_cao_thu_chi_doi_tac")}
        />
      </div>
    );
  };

  console.log("check listTotalStatistic", listTotalStatistic);
  return (
    <div className="report-order-daily-revenue">
      <div className="report-order-daily-revenue__header">
        <span className="report-order-daily-revenue__header--title">
          Báo cáo tổng quan thu chi của đối tác
        </span>
        <div className="report-order-daily-revenue__header--total-statistic">
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow blue">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoReceipt />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng thu
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(
                  listTotalStatistic?.total_income_from_collaborators
                )}
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow green">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoTrendingUp />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng chi
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(
                  listTotalStatistic?.total_expenses_for_collaborators
                )}
              </span>
            </div>
          </div>
        </div>
        <div>
          <FilterData
            isTimeFilter={true}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            rightContent={rightContent(
              moment(startDate).format("DD/MM/YYYY"),
              moment(endDate).format("DD/MM/YYYY"),
              moment(previousStartDate).format("DD/MM/YYYY"),
              moment(previousEndDate).format("DD/MM/YYYY")
            )}
            leftContent={leftContent()}
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

export default ReportCashBookCollaborator;
