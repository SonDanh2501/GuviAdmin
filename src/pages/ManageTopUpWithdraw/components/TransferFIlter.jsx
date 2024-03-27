import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import React, { useEffect, useState } from "react";
import RangeDatePicker from "../../../components/datePicker/RangeDatePicker";
import moment from "moment";
const FilterTransfer = (props) => {
  const { setReturnFilter, dataFilter, onClick, onReset } = props;
  const [subject, setSubject] = useState({
    label: "Tất cả",
    key: "0",
    value: "",
  });
  const [paymentMethod, setPaymentMethod] = useState({
    label: "Tất cả",
    key: "0",
    value: "",
  });
  // const [status, setStatus] = useState({
  //   label: "Tất cả",
  //   key: "0",
  //   value: "",
  // });
  const [typeTransfer, setTypeTransfer] = useState({
    label: "Tất cả",
    key: "0",
    value: "",
  });
  const [kindTransfer, setKindTransfer] = useState({
    label: "Tất cả",
    key: "0",
    value: "",
  });
  const [startDate, setStartDate] = useState("2023-02-12T17:00:00.000Z");
  const [endDate, setEndDate] = useState("2023-02-12T17:00:00.000Z");
  // ------------------------- xử lý action --------------------------------------- //
  const handleChooseSubject = ({ key }) => {
    setSubject(dataSubjects[key]);
  };
  const handleChoosePaymentMethod = ({ key }) => {
    setPaymentMethod(dataPaymentMethods[key]);
  };
  const handleChooseStatus = ({ key }) => {
    // setStatus(dataStatus[key]);
  };
  const handleChooseTypeTransfer = ({ key }) => {
    setTypeTransfer(dataTypeTransfers[key]);
  };
  const handleChooseKindTransfer = ({ key }) => {
    setKindTransfer(dataKindTransfers[key]);
  };
  const handleAction = (event) => {
    console.log("event", event);
  };
  const handleFilter = () => {
    const temp = [
      {
        key: "subject",
        value: subject?.value,
      },
      {
        key: "payment_source",
        value: paymentMethod?.value,
      },
      {
        key: "type_transfer",
        value: typeTransfer?.value,
      },
      {
        key: "kind_transfer",
        value: kindTransfer?.value,
      },
      {
        key: "start_date",
        value: startDate?.toString(),
      },
      {
        key: "end_date",
        value: endDate?.toString(),
      },
      {
        key: "status",
        value: "",
      },
    ];
    setReturnFilter(temp);
  };
  // ------------------------- xử lý useEffect --------------------------------------- //
  useEffect(() => {
    if (dataFilter) {
      dataFilter.map((item) => {
        if (item?.key === "subject") {
          const index = dataSubjects.findIndex(
            (i) => i.value === item.default_value
          );
          setSubject(dataSubjects[index > -1 ? index : 0]);
        } else if (item?.key === "status") {
          // setStatus(item);
        } else if (item?.key === "type_transfer") {
          setTypeTransfer(item);
        } else if (item?.key === "kind_transfer") {
          setKindTransfer(item);
        } else if (item?.key === "payment_source") {
          setPaymentMethod(item);
        }
      });
    }
    handleFilter();
  }, []);
  useEffect(() => {
    handleFilter();
  }, [
    subject,
    startDate,
    endDate,
    // status,
    typeTransfer,
    kindTransfer,
    paymentMethod,
  ]);
  return (
    <div className="filter-transfer_container">
      <div className="filter-transfer_date">
        <p>
          Ngày tạo:{" "}
          <span className="fw-500">
            {moment(startDate).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).format("DD/MM/YYYY")}
          </span>
        </p>
        <RangeDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onCancel={() => {}}
          defaults={"thirty_last"}
        />
      </div>
      {/* <div className="filter-transfer_status">
        <Dropdown
          menu={{
            items: dataStatus,
            selectable: true,
            defaultSelectedKeys: ["0"],
            onClick: handleChooseStatus,
          }}
          trigger={["click"]}
        >
          <Space>
            <p>
              Trạng thái: <span className="fw-500">{status?.label}</span>
            </p>
            <CaretDownOutlined />
          </Space>
        </Dropdown>
      </div> */}
      <div className="filter-transfer_status">
        <Dropdown
          menu={{
            items: dataTypeTransfers,
            selectable: true,
            defaultSelectedKeys: ["0"],
            onClick: handleChooseTypeTransfer,
          }}
          trigger={["click"]}
        >
          <Space>
            <p>
              Loại giao dịch:{" "}
              <span className="fw-500">{typeTransfer?.label}</span>
            </p>
            <CaretDownOutlined />
          </Space>
        </Dropdown>
      </div>
      <div className="filter-transfer_payment-method">
        <Dropdown
          menu={{
            items: dataPaymentMethods,
            selectable: true,
            defaultSelectedKeys: ["0"],
            onClick: handleChoosePaymentMethod,
          }}
          trigger={["click"]}
        >
          <Space>
            <p>
              Phương thức thanh toán:{" "}
              <span className="fw-500">{paymentMethod?.label}</span>
            </p>
            <CaretDownOutlined />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default React.memo(FilterTransfer);

const dataSubjects = [
  {
    label: "Khách hàng",
    key: "0",
    value: "customer",
  },
  {
    label: "CTV",
    key: "1",
    value: "collaborator",
  },

  {
    label: "Khác",
    key: "2",
    value: "other",
  },
];
const dataPaymentMethods = [
  {
    label: "Tất cả",
    key: "0",
    value: "",
  },
  {
    label: "Ngân hàng",
    key: "1",
    value: "bank",
  },
  {
    label: "MoMo",
    key: "2",
    value: "momo",
  },
  {
    label: "VNPay",
    key: "3",
    value: "vn_pay",
  },
  {
    label: "Pay-Point",
    key: "4",
    value: "pay_point",
  },
];

const dataStatus = [
  {
    label: "Tất cả",
    key: "0",
    value: "",
  },
  {
    label: "Đang xử lý",
    key: "1",
    value: "pending",
  },
  {
    label: "Hoàn thành",
    key: "2",
    value: "done",
  },
  {
    label: "Đã chuyển tiền",
    key: "3",
    value: "transferred",
  },
  {
    label: "Đã huỷ",
    key: "4",
    value: "cancel",
  },
  {
    label: "Tạm giữ",
    key: "5",
    value: "holding",
  },
];
const dataTypeTransfers = [
  {
    label: "Tất cả",
    key: "0",
    value: "",
  },
  {
    label: "Nạp",
    key: "1",
    value: "top_up",
  },
  {
    label: "Rút",
    key: "2",
    value: "withdraw",
  },
  {
    label: "Thưởng",
    key: "3",
    value: "reward",
  },
  {
    label: "Phạt",
    key: "4",
    value: "punish",
  },
];
const dataKindTransfers = [
  {
    label: "Tất cả",
    key: "0",
    value: "",
  },
  {
    label: "Phiếu thu",
    key: "1",
    value: "income",
  },
  {
    label: "Phiếu chi",
    key: "2",
    value: "expense",
  },
];
