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
import { getUser } from "../../../redux/selectors/auth";

const ManageOrder = () => {
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [kind, setKind] = useState("");
  const [valueTab, setValueTab] = useState("tat_ca");

  const dispatch = useDispatch();
  const listOrder = useSelector(getOrderSelector);
  const orderTotal = useSelector(getOrderTotal);
  const listOrderSearch = useSelector(searchOrderSelector);
  const totalOrderSearch = useSelector(searchOrderTotal);
  const user = useSelector(getUser);
  const navigate = useNavigate();
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
  }, [dispatch, tab, kind]);

  const handleSearch = useCallback(
    _debounce((value) => {
      searchOrderApi(0, 20, tab, value, kind).then((res) => {
        setDataSearch(res?.data);
        setTotalSearch(res?.totalItem);
      });
    }, 1000),
    [tab, kind]
  );

  const items = [
    {
      label: (
        <div>
          <UilFileExport />
          <ExportCSV csvData={listOrder} fileName={"order"} />
        </div>
      ),
      key: "0",
    },
  ];

  return (
    <>
      <div className="div-header">
        <a className="title-cv">Danh sách công việc</a>
        {/* <Input
          placeholder="Tìm kiếm"
          type="text"
          className="field-search"
          value={valueSearch}
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
            setValueSearch(e.target.value);
          }}
        /> */}
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
        {user?.role !== "marketing" || user?.role !== "marketing_manager" ? (
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
                    setDataSearch([]);
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
            data={listOrder}
            total={orderTotal}
            // dataSearch={dataSearch}
            // value={valueSearch}
            status={tab}
            kind={kind}
            // setDataSearch={setDataSearch}
            // setTotalSearch={setTotalSearch}
          />
        </div>

        <FloatButton.BackTop />
      </div>
    </>
  );
};

export default ManageOrder;
