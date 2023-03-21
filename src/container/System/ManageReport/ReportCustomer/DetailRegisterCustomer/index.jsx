import { Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTotalDetailCustomerDay } from "../../../../../api/report";
import "./index.scss";

const DetailRegisterCustomer = () => {
  const { state } = useLocation();
  const { date } = state || {};
  const navigate = useNavigate();
  const [rowIndex, setRowIndex] = useState();
  const [hidePhone, setHidePhone] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getTotalDetailCustomerDay(
      moment(date).startOf("date").toISOString(),
      moment(date).endOf("date").toISOString()
    )
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: "Ngày tạo",
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
      title: "Mã",
      width: "10%",
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/system/user-manage/details-customer", {
                state: { id: data?._id },
              })
            }
          >
            {/* <img
                className="img_customer"
                src={data?.avatar ? data?.avatar : user}
              /> */}
            <a className="text-id"> {data?.id_view}</a>
          </div>
        );
      },
    },
    {
      title: "Khách hàng",
      width: "20%",
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/system/user-manage/details-customer", {
                state: { id: data?._id },
              })
            }
          >
            {/* <img
                className="img_customer"
                src={data?.avatar ? data?.avatar : user}
              /> */}
            <a className="text-name-report-customer"> {data?.full_name}</a>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
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
        Số lượng khách hàng đăng kí ngày{" "}
        {moment(new Date(date)).format("DD/MM/YYYY")}
      </h4>
      <h5 className="mb-5">Tổng: {data.length}</h5>
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
    </>
  );
};

export default DetailRegisterCustomer;
