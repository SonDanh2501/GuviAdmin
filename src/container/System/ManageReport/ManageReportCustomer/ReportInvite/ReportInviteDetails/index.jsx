import { Pagination, Progress, Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getReportDetailsCustomerInvite } from "../../../../../../api/report";
import "./index.scss";
import moment from "moment";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";

const ReportInviteDetails = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getReportDetailsCustomerInvite(id, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getReportDetailsCustomerInvite(id, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: `${i18n.t("detail", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create-invite-detail">
            <p className="text-invite">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-invite">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("code", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.id_view}</p>,
    },
    {
      title: `${i18n.t("customer", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.full_name}</p>,
    },
    {
      title: `${i18n.t("phone", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.phone}</p>,
    },
    {
      title: `${i18n.t("total_order", { lng: lang })}`,
      render: (data) => (
        <p className="text-name-invite">{data?.total_done_order}</p>
      ),
      align: "center",
    },
    {
      title: `${i18n.t("stage", { lng: lang })}`,
      render: (data) => (
        <Progress
          percent={
            data?.total_order === 0
              ? 33
              : data?.total_order !== 0 && data?.total_done_order === 0
              ? 66
              : 100
          }
          strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
        />
      ),
    },
  ];
  return (
    <div>
      <p className="title">{`${i18n.t("detail", { lng: lang })}`}</p>
      <div className="mt-5">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div className="mt-1 div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </p>
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
    </div>
  );
};

export default ReportInviteDetails;
