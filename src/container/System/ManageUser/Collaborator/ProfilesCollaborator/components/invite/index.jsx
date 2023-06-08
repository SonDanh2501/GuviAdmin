import { useEffect, useState } from "react";
import "./styles.scss";
import { getInviteCollaborator } from "../../../../../../../api/collaborator";
import { Pagination, Progress, Table } from "antd";
import moment from "moment";

const InviteCollaborator = ({ id }) => {
  const [totalCustomer, setTotalCustomer] = useState();
  const [totalCollaborator, setTotalCollaborator] = useState();
  const [dataCustomer, setCustomer] = useState([]);
  const [dataCollaborator, setCollaborator] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState("collaborator");
  useEffect(() => {
    getInviteCollaborator(id, 0, 20)
      .then((res) => {
        setCustomer(res?.customer);
        setCollaborator(res?.collaborator);
        setTotalCustomer(res?.total_customer);
        setTotalCollaborator(res?.total_collaborator);
      })
      .catch((err) => {});
  }, [tab]);

  const columns =
    tab === "collaborator"
      ? [
          {
            title: "Ngày tạo",
            render: (data) => {
              return (
                <div className="div-date-create-invite">
                  <a className="text-create">
                    {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                  </a>
                  <a className="text-create">
                    {moment(new Date(data?.date_create)).format("HH:mm")}
                  </a>
                </div>
              );
            },
          },
          {
            title: "Mã",
            render: (data) => <a className="text-id-view">{data?.id_view}</a>,
          },
          {
            title: "Tên",
            render: (data) => {
              return (
                <div className="div-name-invite-collaborator">
                  <a className="text-name">{data?.full_name}</a>
                  <a className="text-name">{data?.phone}</a>
                </div>
              );
            },
          },
        ]
      : [
          {
            title: "Ngày tạo",
            render: (data) => {
              return (
                <div className="div-date-create-invite">
                  <a className="text-create">
                    {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                  </a>
                  <a className="text-create">
                    {moment(new Date(data?.date_create)).format("HH:mm")}
                  </a>
                </div>
              );
            },
          },
          {
            title: "Mã",
            render: (data) => <a className="text-id-view">{data?.id_view}</a>,
          },
          {
            title: "Tên",
            render: (data) => {
              return (
                <div className="div-name-invite-collaborator">
                  <a className="text-name">{data?.full_name}</a>
                  <a className="text-name">{data?.phone}</a>
                </div>
              );
            },
          },
          {
            title: "Giai đoạn",
            render: (data) => (
              //   <a className="text-step">
              //     {data?.total_order === 0
              //       ? "Hoàn thành bước 1"
              //       : data?.total_order !== 0 && data?.total_done_order === 0
              //       ? "Hoàn thành bước 2"
              //       : "Hoàn thành"}
              //   </a>
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

  return (
    <div>
      <a></a>
      <div className="div-tab-invite-collaborator">
        {DATA_TAB?.map((item, index) => {
          return (
            <div
              key={index}
              className={
                item?.value === tab ? "div-item-tab-select" : "div-item-tab"
              }
              onClick={() => setTab(item?.value)}
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <Table
          dataSource={tab === "collaborator" ? dataCollaborator : dataCustomer}
          columns={columns}
          pagination={false}
        />
      </div>
      <div className="div-pagination p-2">
        <a>
          Tổng: {tab === "collaborator" ? totalCollaborator : totalCustomer}
        </a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={tab === "collaborator" ? totalCollaborator : totalCustomer}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>
    </div>
  );
};

export default InviteCollaborator;

const DATA_TAB = [
  { title: "Giới thiệu cộng tác viên", value: "collaborator" },
  { title: "Giới thiệu khách hàng", value: "customer" },
];
