import { Tabs } from "antd";
import PromotionManage from "../Promotion/promotionManage";
import "./index.scss";

const ManagePromotionGuvi = ({ type, brand }) => {
  return (
    <div className="ml-2">
      <Tabs defaultActiveKey="1">
        {DATA.map((item, index) => {
          return (
            <Tabs.TabPane tab={item?.title} key={item?.id}>
              <PromotionManage type={type} brand={brand} />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ManagePromotionGuvi;

const DATA = [
  {
    id: 1,
    title: "Giúp việc theo giờ",
  },
  {
    id: 2,
    title: "Giúp việc cố định",
  },
  {
    id: 3,
    title: "Tổng vệ sinh",
  },
];
