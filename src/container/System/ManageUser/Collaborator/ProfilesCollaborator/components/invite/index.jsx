import { useEffect, useState } from "react";
import "./styles.scss";
import { getInviteCollaborator } from "../../../../../../../api/collaborator";
import { Dropdown, Pagination, Progress, Space, Table } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import FilterData from "../../../../../../../components/filterData/filterData";
import { CaretDownOutlined } from "@ant-design/icons";
import icons from "../../../../../../../utils/icons";
import DataTable from "../../../../../../../components/tables/dataTable";

const { IoCaretDown } = icons;

const InviteCollaborator = ({ id }) => {
  const lang = useSelector(getLanguageState);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [totalCustomer, setTotalCustomer] = useState();
  const [totalCollaborator, setTotalCollaborator] = useState();
  const [dataCustomer, setCustomer] = useState([]);
  const [dataCollaborator, setCollaborator] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState("collaborator");
  const [statusFilter, setStatusFilter] = useState("collaborator");

  useEffect(() => {
    getInviteCollaborator(id, 0, 20)
      .then((res) => {
        setCustomer(res?.customer);
        setCollaborator(res?.collaborator);
        setTotalCustomer(res?.total_customer);
        setTotalCollaborator(res?.total_collaborator);
      })
      .catch((err) => {});
  }, [id]);

  const columns =
    statusFilter === "collaborator"
      ? [
          {
            title: "Ngày tạo",
            key: "date_create",
            width: 60,
            FontSize: "text-size-M",
          },

          {
            title: "Mã giới thiệu",
            key: "code_order",
            width: 60,
            FontSize: "text-size-M",
          },
          {
            title: "Tên đối tác",
            key: "customer_name_phone",
            width: 60,
            FontSize: "text-size-M",
          },
        ]
      : [
          {
            title: "Ngày tạo",
            key: "date_create",
            width: 60,
            FontSize: "text-size-M",
          },

          {
            title: "Mã giới thiệu",
            key: "code_order",
            width: 60,
            FontSize: "text-size-M",
          },
          {
            title: "Tên đối tác",
            key: "customer_name_phone",
            width: 60,
            FontSize: "text-size-M",
          },
          {
            title: "Giai đoạn",
            key: "customer_name_phone",
            width: 60,
            FontSize: "text-size-M",
          },
        ];
  // const columns1 =
  //   tab === "collaborator"
  //     ? [
  //         {
  //           title: `${i18n.t("date_create", { lng: lang })}`,
  //           render: (data) => {
  //             return (
  //               <div className="div-date-create-invite">
  //                 <p className="text-create">
  //                   {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
  //                 </p>
  //                 <p className="text-create">
  //                   {moment(new Date(data?.date_create)).format("HH:mm")}
  //                 </p>
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: `${i18n.t("code_order", { lng: lang })}`,
  //           render: (data) => <p className="text-id-view">{data?.id_view}</p>,
  //         },
  //         {
  //           title: `${i18n.t("name", { lng: lang })}`,
  //           render: (data) => {
  //             return (
  //               <div className="div-name-invite-collaborator">
  //                 <p className="text-name">{data?.full_name}</p>
  //                 <p className="text-name">{data?.phone}</p>
  //               </div>
  //             );
  //           },
  //         },
  //       ]
  //     : [
  //         {
  //           title: `${i18n.t("date_create", { lng: lang })}`,
  //           render: (data) => {
  //             return (
  //               <div className="div-date-create-invite">
  //                 <p className="text-create">
  //                   {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
  //                 </p>
  //                 <p className="text-create">
  //                   {moment(new Date(data?.date_create)).format("HH:mm")}
  //                 </p>
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: `${i18n.t("code_order", { lng: lang })}`,
  //           render: (data) => <p className="text-id-view">{data?.id_view}</p>,
  //         },
  //         {
  //           title: `${i18n.t("name", { lng: lang })}`,
  //           render: (data) => {
  //             return (
  //               <div className="div-name-invite-collaborator">
  //                 <p className="text-name">{data?.full_name}</p>
  //                 <p className="text-name">{data?.phone}</p>
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Giai đoạn",
  //           render: (data) => (
  //             <Progress
  //               percent={
  //                 data?.total_order === 0
  //                   ? 33
  //                   : data?.total_order !== 0 && data?.total_done_order === 0
  //                   ? 66
  //                   : 100
  //               }
  //               strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
  //             />
  //           ),
  //         },
  //       ];

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength =
      tab === "collaborator"
        ? dataCollaborator.length < 20
          ? 20
          : dataCollaborator.length
        : dataCustomer.length < 20
        ? 20
        : dataCustomer.length;
    const start = page * dataLength - dataLength;
    getInviteCollaborator(id, start, 20)
      .then((res) => {
        setCustomer(res?.customer);
        setCollaborator(res?.collaborator);
        setTotalCustomer(res?.totalCustomer);
        setTotalCollaborator(res?.totalCollaborator);
      })
      .catch((err) => {});
  };

  const statusOptions = [
    { key: "collaborator", label: "Giới thiệu cộng tác viên" },
    { key: "customer", label: "Giới thiệu khách hàng" },
  ];

  const handleSelectStatus = ({ key }) => {
    const findStatus = statusOptions.find((el) => el.key === key);
    setStatusFilter(findStatus?.key);
  };

  /* ~~~ Handle function ~~~ */
  // 1. Hàm xử lý khi chuyển trang
  const onChangePage = (value) => {
    setStartPage(value);
  };

  return (
    <div>
      <div className="div-tab-invite-collaborator">
        {/* {statusOptions?.map((item, index) => {
          return (
            <div
              key={index}
              className={
                item?.value === tab ? "div-item-tab-select" : "div-item-tab"
              }
              onClick={() => setTab(item?.key)}
            >
              <p className="text-tab">{item?.label}</p>
            </div>
          );
        })} */}
        <FilterData
          leftContent={
            <div>
              <Dropdown
                menu={{
                  items: statusOptions,
                  selectable: true,
                  defaultSelectedKeys: ["todo"],
                  onSelect: (key) => handleSelectStatus(key),
                }}
                trigger={["click"]}
              >
                <Space>
                  <span>Trạng thái: </span>
                  <span style={{ cursor: "pointer", fontWeight: 500 }}>
                    {/* {status === "done" ? "Đã xong" : "Đang chờ"} */}
                    {
                      statusOptions.find(
                        (status) => status.key === statusFilter
                      )?.label
                    }
                  </span>
                  <IoCaretDown />
                </Space>
              </Dropdown>
            </div>
          }
        />
      </div>
      <div className="mt-3">
        {/* <Table
          dataSource={tab === "collaborator" ? dataCollaborator : dataCustomer}
          columns={columns}
          pagination={false}
        /> */}
      </div>
      {/* <div className="div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}:{" "}
          {tab === "collaborator" ? totalCollaborator : totalCustomer}
        </p>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={tab === "collaborator" ? totalCollaborator : totalCustomer}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div> */}
      <DataTable
        columns={columns}
        data={statusFilter === "collaborator" ? dataCollaborator : dataCustomer}
        start={startPage}
        pageSize={lengthPage}
        setLengthPage={setLengthPage}
        totalItem={
          statusFilter === "collaborator" ? totalCollaborator : totalCustomer
        }
        onCurrentPageChange={onChangePage}
      />
    </div>
  );
};

export default InviteCollaborator;

// const DATA_TAB = [
//   { title: "invite_collaborator", value: "collaborator" },
//   { title: "invite_customer", value: "customer" },
// ];
