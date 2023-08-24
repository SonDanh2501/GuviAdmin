import { Image, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getChildPromotion } from "../../../../api/promotion.jsx";
import moment from "moment";
import "./index.scss";
import LoadingPagination from "../../../../components/paginationLoading/index.jsx";
import { ExportCSV } from "../../../../helper/export.js";

const ChildPromotion = () => {
  const { state } = useLocation();
  const { code } = state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [dataDealtoday, setDataDealtoday] = useState([]);
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

  useEffect(() => {
    if (total) {
      getChildPromotion(code, tab, 0, total)
        .then((res) => {
          setDataDealtoday(res?.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [total]);

  const onChange = (page) => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getChildPromotion(code, tab, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: "Tên Promotion",
      render: (data) => {
        return (
          <div className="div-img-promotion">
            <Image src={data?.thumbnail} className="img-customer-promotion" />
            <p className="text-title-promotion">{data.title.vi}</p>
          </div>
        );
      },
    },
    {
      title: "Sử dụng",
      align: "center",

      render: (data) => {
        return (
          <p
            className="text-title-promotion"
            onClick={() =>
              navigate("/promotion/manage-setting/order-promotion", {
                state: { id: data?._id },
              })
            }
          >
            {data?.total_used_promotion}
          </p>
        );
      },
    },
    {
      title: "Vị trí",
      align: "center",
      render: (data) => (
        <p className="text-title-promotion">{data?.position}</p>
      ),
    },
    {
      title: "Mã code",

      align: "center",
      render: (data) => <p className="text-title-promotion">{data?.code}</p>,
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
          <p className="text-title-promotion">
            {data?.is_limit_date ? startDate + "-" + endDate : "Không có hạn"}
          </p>
        );
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (data) => {
        return (
          <div>
            {data?.status === "upcoming" ? (
              <p className="text-upcoming">Sắp diễn ra</p>
            ) : data?.status === "doing" ? (
              <p className="text-upcoming">Đang diễn ra</p>
            ) : data?.status === "out_of_stock" ? (
              <p className="text-cancel">Hết số lượng</p>
            ) : data?.status === "out_of_date" ? (
              <p className="text-cancel">Hết hạn</p>
            ) : (
              <p className="text-cancel">Kết thúc</p>
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
      {dataDealtoday.length > 0 && tab === "all" && (
        <div className="btn-export-CSV">
          <ExportCSV csvData={dataDealtoday} fileName={"DEALTODAY"} />
        </div>
      )}
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
              onClick={() => {
                setTab(item?.value);
                setCurrentPage(1);
              }}
            >
              <p className="title-child-promotion">{item?.title}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Table columns={columns} pagination={false} dataSource={data} />
      </div>
      <div className="div-pagination p-2">
        <p>Tổng: {total}</p>
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
