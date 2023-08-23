import { Button, Image, Pagination, Popover, Table } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCollaboratorsById } from "../../../../api/collaborator";
import { getReportCollaboratorDetails } from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";
import { formatMoney } from "../../../../helper/formatMoney";
import { loadingAction } from "../../../../redux/actions/loading";
import "./index.scss";

const DetailReportManager = () => {
  const { state } = useLocation();
  const { id, dateStart, dateEnd } = state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState();
  const [total, setTotal] = useState([]);
  const [startDate, setStartDate] = useState(dateStart);
  const [endDate, setEndDate] = useState(dateEnd);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getReportCollaboratorDetails(id, 0, 20, dateStart, dateEnd)
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .then((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });

    getCollaboratorsById(id)
      .then((res) => {
        setDataCollaborator(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dateStart, dateEnd, dispatch]);

  const columns = [
    {
      title: "Ngày",
      render: (data) => {
        return (
          <div className="div-time-report">
            <p className="text-view-order">
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}{" "}
            </p>
            <p className="text-view-order">
              {moment(new Date(data?.date_work)).format("HH:mm")}{" "}
            </p>
          </div>
        );
      },
    },
    {
      title: "Mã đơn",
      render: (data) => {
        return (
          <div className="div-time-report">
            <p className="text-view-order">{data?.id_view_order} </p>
          </div>
        );
      },
    },
    {
      title: "Doanh số",
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_gross_income)}</p>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Phí dịch vụ trả Cộng tác viên.</p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center", margin: 0 }}>Phí dịch vụ</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </p>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Doanh thu = Doanh số (-) Phí dịch vụ trả CTV
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center", margin: 0 }}>Doanh thu</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },

      align: "center",
      render: (data) => {
        return <p className="text-money">{formatMoney(data?.total_income)}</p>;
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Tổng số tiền giảm giá</p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center" }}>Giảm giá</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_discount)}</p>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần
              = Doanh thu (-) Giảm giá.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center", margin: 0 }}>Doanh thu thuần</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_net_income)}</p>
        );
      },
    },
    {
      title: "Phí áp dụng",

      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_serviceFee)}</p>
        );
      },
      align: "center",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tổng tiền trên dịch vụ. Tổng hoá đơn = Doanh thu thuần (+) Phí áp
              dụng.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center", margin: 0 }}>Tổng hoá đơn</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_order_fee)}</p>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Lợi nhuận = Doanh thu (+) Phí áp dụng (-) Giảm giá.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center", margin: 0 }}>Lợi nhuận</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {formatMoney(data?.total_net_income_business)}
          </p>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              % lợi nhuận = Tổng lợi nhuận (/) Doanh thu thuần.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <p style={{ textAlign: "center", margin: 0 }}>% lợi nhuận</p>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => <p className="text-money">{data?.percent_income}%</p>,
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;

    getReportCollaboratorDetails(
      id,
      start > 0 ? start : 0,
      20,
      startDate,
      endDate
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const onChangeFilter = useCallback(() => {
    getReportCollaboratorDetails(id, 0, 20, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, [id, startDate, endDate]);

  return (
    <div>
      <i
        class="uil uil-arrow-left"
        style={{ width: 50, height: 50 }}
        onClick={() => navigate(-1)}
      ></i>
      <div className="div-info-collaborator mt-2">
        <Image
          src={dataCollaborator?.avatar}
          style={{ width: 100, height: 100, borderRadius: 4 }}
        />
        <div className="div-info-name">
          <div className="div-row-name">
            <p className="text-title-ctv">Tên:</p>{" "}
            <p className="text-name-ctv">{dataCollaborator?.full_name}</p>
          </div>
          <div className="div-row-name">
            <p className="text-title-ctv">Mã:</p>{" "}
            <p className="text-name-ctv">{dataCollaborator?.id_view}</p>
          </div>
          <div className="div-row-name">
            <p className="text-title-ctv">Sđt:</p>{" "}
            <p className="text-name-ctv">{dataCollaborator?.phone}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 div-date">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeFilter}
          onCancel={() => {}}
          setSameStart={() => {}}
          setSameEnd={() => {}}
        />
        {startDate && (
          <p className="text-date m-0 ml-2">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </p>
        )}
      </div>
      <div className="mt-3">
        <Table columns={columns} pagination={false} dataSource={data} />
      </div>
      <div className="mt-2 div-pagination p-2">
        <p>Tổng: {total}</p>
        <Pagination
          current={currentPage}
          onChange={onChange}
          total={total}
          showSizeChanger={false}
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default DetailReportManager;
