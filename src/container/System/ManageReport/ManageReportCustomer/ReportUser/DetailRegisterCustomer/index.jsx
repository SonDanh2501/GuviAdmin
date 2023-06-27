import { Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTotalDetailCustomerDay } from "../../../../../../api/report";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";

const DetailRegisterCustomer = () => {
  const { state } = useLocation();
  const { date } = state || {};
  const navigate = useNavigate();
  const [rowIndex, setRowIndex] = useState();
  const [hidePhone, setHidePhone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(date).startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(date).endOf("date").toISOString()
  );
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getTotalDetailCustomerDay(0, 20, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getTotalDetailCustomerDay(start, 20, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create">
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
      width: "10%",
    },
    {
      title: `${i18n.t("code", { lng: lang })}`,
      width: "10%",
      render: (data) => {
        return (
          <Link to={`/profile-customer/${data?._id}`}>
            <a className="text-id"> {data?.id_view}</a>
          </Link>
        );
      },
    },
    {
      title: `${i18n.t("customer", { lng: lang })}`,
      width: "20%",
      render: (data) => {
        return (
          <Link to={`/profile-customer/${data?._id}`}>
            <a className="text-name-report-customer"> {data?.full_name}</a>
          </Link>
        );
      },
    },
    {
      title: `${i18n.t("phone", { lng: lang })}`,
      render: (data, record, index) => {
        const phone = data?.phone.slice(0, 7);
        return (
          <div className="hide-phone">
            <a className="text-phone">
              {rowIndex === index
                ? hidePhone
                  ? data?.phone
                  : phone + "***"
                : phone + "***"}
            </a>
            <a
              className="btn-eyes"
              onClick={() =>
                rowIndex === index
                  ? setHidePhone(!hidePhone)
                  : setHidePhone(!hidePhone)
              }
            >
              {rowIndex === index ? (
                hidePhone ? (
                  <i class="uil uil-eye"></i>
                ) : (
                  <i class="uil uil-eye-slash"></i>
                )
              ) : (
                <i class="uil uil-eye-slash"></i>
              )}
            </a>
          </div>
        );
      },
      width: "15%",
    },
  ];
  return (
    <>
      <i
        class="uil uil-arrow-left"
        style={{ width: 50, height: 50 }}
        onClick={() => navigate(-1)}
      ></i>
      <h4 className="mt-2">
        {`${i18n.t("number_regis_customer_day", { lng: lang })}`}{" "}
        {moment(new Date(date)).format("DD/MM/YYYY")}
      </h4>
      <h5 className="mb-5">
        {`${i18n.t("total", { lng: lang })}`}: {total}
      </h5>
      <div className="mt-2">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowIndex(rowIndex);
              },
            };
          }}
        />
      </div>

      <div className="mt-2 div-pagination p-2">
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
    </>
  );
};

export default DetailRegisterCustomer;
