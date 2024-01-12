import { Tabs } from "antd";

const CustomTab = (props) => {
  const { dataItems } = props;
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={"middle"}
        items={dataItems.map((item, i) => {
          const id = String(i + 1);
          return {
            label: item.label,
            key: id,
            children: item.children,
          };
        })}
      />
    </>
  );
};

export default CustomTab;

// cấu trúc dataItems
// const dataItems = [
//   {
//     label: "Chi tiết đơn hàng",
//     children: (
//       <>
//         <p>ko co gi</p>
//       </>
//     ),
//   },
// ];
