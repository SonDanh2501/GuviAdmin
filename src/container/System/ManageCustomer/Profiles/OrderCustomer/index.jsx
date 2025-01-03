import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Pagination, Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import { getOrderByCustomers } from "../../../../../api/customer";
import { formatMoney } from "../../../../../helper/formatMoney";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import { useCookies } from "../../../../../helper/useCookies";
import DataTable from "../../../../../components/tables/dataTable";
import { errorNotify } from "../../../../../helper/toast";

const OrderCustomer = ({ id }) => {
  const { width } = useWindowDimensions();
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "code_order",
      dataIndex: "id_view",
      key: "code_order",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "date_create",
      dataIndex: "date_create",
      key: "date_create",
      width: 100,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "customer",
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "service",
      title: "Ngày làm",
      dataIndex: "date_work",
      key: "date_work",
      width: 130,
      fontSize: "text-size-M",
    },
    {
      title: "Địa chỉ",
      // i18n_title: "address",
      dataIndex: "address",
      key: "text",
      width: 220,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "collaborator",
      dataIndex: "collaborator",
      key: "collaborator",
      width: 160,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "status",
      dataIndex: "status",
      key: "status",
      width: 120,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "pay",
      dataIndex: "pay",
      key: "pay",
      width: 90,
      fontSize: "text-size-M",
    },
  ];

  const handleGetOrderByCustomersId = async () => {
    try {
      const res = await getOrderByCustomers(id, startPage, lengthPage);
      console.log("check response >>> ", res);
      setData(res?.data);
      setTotal(res?.totalItem);
    } catch (err) {
      errorNotify({
        message: err.message || err,
      });
    }
  };


  useEffect(() => {
    handleGetOrderByCustomersId();
  }, [id, startPage, lengthPage]);

  const onChangePage = (value) => {
    setStartPage(value);
  };

  return (
    <React.Fragment>
      <div>
        <DataTable
          columns={columns}
          data={data}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          onCurrentPageChange={onChangePage}
        ></DataTable>
      </div>
    </React.Fragment>
  );
};

export default OrderCustomer;
