import { Space, Tabs, Dropdown, Input, FloatButton, Button } from "antd";
import { ExportCSV } from "../../../helper/export";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import "./index.scss";
import OrderManage from "./Order/OrderManage";
import { UilEllipsisH, UilFileExport } from "@iconscout/react-unicons";
import {
  getOrderSelector,
  getOrderTotal,
  searchOrderSelector,
  searchOrderTotal,
} from "../../../redux/selectors/order";
import { getOrder, searchOrder } from "../../../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { searchOrderApi, getOrderApi } from "../../../api/order";
import AddOrder from "./DrawerAddOrder";
import { SearchOutlined } from "@ant-design/icons";
import { DATA, DATA_STATUS } from "../../../api/fakeData";
import { useNavigate } from "react-router-dom";
import { getElementState, getUser } from "../../../redux/selectors/auth";

const ManageOrder = () => {
  const [tab, setTab] = useState("all");
  const [kind, setKind] = useState("");
  const [valueTab, setValueTab] = useState("tat_ca");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    dispatch(
      getOrder.getOrderRequest({
        start: 0,
        length: 20,
        status: tab,
        kind: kind,
      })
    );
    getOrderApi(0, 20, tab, kind)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [dispatch, tab, kind]);

  const items = [
    {
      label: (
        <div>
          <UilFileExport />
          <ExportCSV csvData={data} fileName={"order"} />
        </div>
      ),
      key: "0",
    },
  ];

  return (
    <>
      <div className="div-header">
        <a className="title-cv">Danh sách công việc</a>
        <div className="div-add-export">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            className="dropdown-export"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <UilEllipsisH className="icon-menu" />
              </Space>
            </a>
          </Dropdown>
        </div>
        {checkElement?.includes("create_guvi_job") ? (
          <Button
            className="btn-create-order"
            onClick={() => navigate("/group-order/manage-order/create-order")}
          >
            Tạo dịch vụ
          </Button>
        ) : (
          <></>
        )}
      </div>

      <div className="div-container">
        <div className="div-tab">
          {DATA_STATUS.map((item, index) => {
            return (
              <div
                className="div-tab-item"
                key={index}
                onClick={() => {
                  setTab(item?.value);
                  setKind("");
                  setValueTab("tat_ca");
                  setCurrentPage(1);
                  setStartPage(0);
                }}
              >
                <a
                  className={
                    tab === item?.value
                      ? "text-title-tab"
                      : "text-title-tab-default"
                  }
                >
                  {item?.title}
                </a>
                <div className={tab === item?.value ? "tab-line" : ""}></div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="div-tab">
            {DATA.map((item, index) => {
              return (
                <div
                  className="div-tab-item"
                  key={index}
                  onClick={() => {
                    setKind(item?.kind);
                    setValueTab(item?.value);
                    setCurrentPage(1);
                    setStartPage(0);
                  }}
                >
                  <a
                    className={
                      valueTab === item?.value
                        ? "text-title-tab"
                        : "text-title-tab-default"
                    }
                  >
                    {item?.title}
                  </a>
                  <div
                    className={valueTab === item?.value ? "tab-line" : ""}
                  ></div>
                </div>
              );
            })}
          </div>

          <OrderManage
            data={data}
            total={total}
            status={tab}
            kind={kind}
            setData={setData}
            setTotal={setTotal}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            startPage={startPage}
          />
        </div>

        <FloatButton.BackTop />
      </div>
    </>
  );
};

export default ManageOrder;
