import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import RangeDatePicker from "../../../components/datePicker/RangeDatePicker";
import moment from "moment";

const FilterTransfer = (props) => {
  const { setReturnFilter, dataFilter, onClick, onReset } = props;
  const [subject, setSubject] = useState(dataSubjects[1]);
  const [paymentMethod, setPaymentMethod] = useState(dataPaymentMethods[0]);
  const [status, setStatus] = useState(dataStatus[0]);
  const [typeTransfer, setTypeTransfer] = useState(dataTypeTransfers[0]);
  const [kindTransfer, setKindTransfer] = useState(dataKindTransfers[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [arrElement, setArrElement] = useState([]);
  // ------------------------- xử lý action --------------------------------------- //
  const handleChooseSubject = ({ key }) => {
    setSubject(dataSubjects[key]);
  };
  const handleChoosePaymentMethod = ({ key }) => {
    setPaymentMethod(dataPaymentMethods[key]);
  };
  const handleChooseStatus = ({ key }) => {
    setStatus(dataStatus[key]);
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
  // ------------------------- xử lý useEffect --------------------------------------- //
  useEffect(() => {
    const temp = [
      {
        key: "subject",
        value: subject.value,
      },
      {
        key: "status",
        value: status.value,
      },
      {
        key: "payment_method",
        value: paymentMethod.value,
      },
      {
        key: "type_transfer",
        value: typeTransfer.value,
      },
      {
        key: "kind_transfer",
        value: kindTransfer.value,
      },
      {
        key: "start_date",
        value: startDate.toString(),
      },
      {
        key: "end_date",
        value: endDate.toString(),
      },
    ];
    setReturnFilter(temp);
  }, [subject, startDate, endDate, status, typeTransfer, kindTransfer]);
  useEffect(() => {
    const tempDataFilter = [
      {
        key: "status",
        type: "dropdown",
        title: "Trạng thái",
        data: [
          {
            label: "Tất cả",
            key: "0",
            value: "all",
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
        ],
        default_key_value: "1",
      },
    ];
    tempDataFilter.map((item, index) => {
      const ElementFilter = () => {
        return (
          <div>
            <Dropdown
              menu={{
                items: item?.data,
                selectable: true,
                defaultSelectedKeys: [item?.default_key_value],
                onClick: (event) => handleAction(event),
              }}
              trigger={["click"]}
            >
              <Space>
                <p>
                  {item?.title}: <span className="fw-500">{status?.label}</span>
                </p>
                <CaretDownOutlined />
              </Space>
            </Dropdown>
          </div>
        );
      };
      setArrElement((a) => [ElementFilter, ...a]);
    });
  }, []);

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
      <div className="filter-transfer_status">
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
      </div>
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
      {/* <div className="filter-transfer_subject">
        <Dropdown
          menu={{
            items: dataSubjects,
            selectable: true,
            defaultSelectedKeys: ["1"],
            onClick: handleChooseSubject,
          }}
          trigger={["click"]}
        >
          <Space>
            <p>
              Đối tượng: <span className="fw-500">{subject?.label}</span>
            </p>

            <CaretDownOutlined />
          </Space>
        </Dropdown>
      </div> */}
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

      {arrElement.map((EL, index) => {
        return <EL />;
      })}
    </div>
  );
};

export default FilterTransfer;

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
    value: "all",
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
    value: "all",
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
];
const dataTypeTransfers = [
  {
    label: "Tất cả",
    key: "0",
    value: "all",
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
    value: "all",
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
