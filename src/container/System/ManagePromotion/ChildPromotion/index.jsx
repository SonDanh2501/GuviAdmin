import { Image, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getChildPromotion } from "../../../../api/promotion.jsx";
import moment from "moment";
import "./index.scss";
import LoadingPagination from "../../../../components/paginationLoading/index.jsx";

const ChildPromotion = () => {
  const { state } = useLocation();
  const { code } = state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    getChildPromotion(code, tab, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [code, tab]);

  const onChange = (page) => {
    const start = page * data.length - data.length;
    getChildPromotion(code, tab, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: "STT",
      render: (data, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Tên Promotion",
      render: (data) => {
        return (
          <div className="div-img-promotion">
            <Image src={data?.thumbnail} className="img-customer-promotion" />
            <a className="text-title-promotion">{data.title.vi}</a>
          </div>
        );
      },
    },
    {
      title: "Sử dụng",
      align: "center",

      render: (data) => {
        return (
          <a
            className="text-title-promotion"
            onClick={() =>
              navigate("/promotion/manage-setting/order-promotion", {
                state: { id: data?._id },
              })
            }
          >
            {data?.total_used_promotion}
          </a>
        );
      },
    },
    {
      title: "Vị trí",
      align: "center",
      render: (data) => (
        <a className="text-title-promotion">{data?.position}</a>
      ),
    },
    {
      title: "Mã code",

      align: "center",
      render: (data) => <a className="text-title-promotion">{data?.code}</a>,
    },

    {
      title: "Hạn",
      align: "center",

      render: (data) => {
        const startDate = moment(new Date(data?.limit_start_date)).format(
          "DD/MM/YYYY"
        );
        const endDate = moment(new Date(data?.limit_end_date)).format(
          "DD/MM/YYYY"
        );
        return (
          <a className="text-title-promotion">
            {data?.is_limit_date ? startDate + "-" + endDate : "Không có hạn"}
          </a>
        );
      },
    },
    // {
    //   title: "Bật/tắt",
    //   align: "center",

    //   render: (data) => {
    //     var date =
    //       data?.limit_end_date &&
    //       moment(data?.limit_end_date.slice(0, 10));
    //     var now = moment();
    //     return (
    //       <div>
    //         {contextHolder}
    //         {data?.is_active ? (
    //           <img
    //             src={onToggle}
    //             className="img-toggle"
    //             onClick={toggleActive}
    //           />
    //         ) : (
    //           <div>
    //             {data?.is_limit_date ? (
    //               date < now ? (
    //                 <img
    //                   src={offToggle}
    //                   className="img-toggle"
    //                   onClick={() => openNotificationWithIcon("warning")}
    //                 />
    //               ) : (
    //                 <img
    //                   src={offToggle}
    //                   className="img-toggle"
    //                   onClick={toggleActive}
    //                 />
    //               )
    //             ) : (
    //               <img
    //                 src={offToggle}
    //                 className="img-toggle"
    //                 onClick={toggleActive}
    //               />
    //             )}
    //           </div>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Trạng thái",
      align: "center",
      render: (data) => {
        return (
          <div>
            {data?.status === "upcoming" ? (
              <a className="text-upcoming">Sắp diễn ra</a>
            ) : data?.status === "doing" ? (
              <a className="text-upcoming">Đang diễn ra</a>
            ) : data?.status === "out_of_stock" ? (
              <a className="text-cancel">Hết số lượng</a>
            ) : data?.status === "out_of_date" ? (
              <a className="text-cancel">Hết hạn</a>
            ) : (
              <a className="text-cancel">Kết thúc</a>
            )}
          </div>
        );
      },
    },
    // {
    //   title: "",
    //   key: "action",
    //   align: "right",
    //   render: (record) => (
    //     <Space size="middle">
    //       <Dropdown
    //         menu={{
    //           items,
    //         }}
    //         trigger={["click"]}
    //         placement="bottom"
    //       >
    //         <a style={{ color: "black" }}>
    //           <UilEllipsisV />
    //         </a>
    //       </Dropdown>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      <div className="div-tab-child-promotion">
        {TAB_DATA?.map((item, index) => {
          return (
            <div
              key={index}
              className={
                item?.value === tab
                  ? "div-title-child-selected"
                  : "div-title-child"
              }
              onClick={() => setTab(item?.value)}
            >
              <a className="title-child-promotion">{item?.title}</a>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Table columns={columns} pagination={false} dataSource={data} />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {total}</a>
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

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ChildPromotion;

const TAB_DATA = [
  {
    id: 1,
    title: "Tất cả",
    value: "all",
  },
  {
    id: 2,
    title: "Sử dụng",
    value: "used",
  },
  {
    id: 3,
    title: "Chưa sử dụng",
    value: "not-used",
  },
];
