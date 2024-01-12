import { useParams } from "react-router-dom";
import CustomTab from "../../../components/customTab/CustomTab";
import InForDetailOrder from "./InfoDetailOrder";
import ActivityOrder from "./ActivityOrder";

const DetailOrder = () => {
  const params = useParams();
  const idGroupOrder = params?.id;
  console.log("id ", idGroupOrder);
  const tempData = [
    {
      label: "Chi tiết đơn hàng",
      children: <InForDetailOrder id={idGroupOrder} />,
    },
    {
      label: "Hoạt động đơn hàng",
      children: <ActivityOrder id={idGroupOrder} />,
    },
  ];
  return (
    <>
      <CustomTab dataItems={tempData} />
    </>
  );
};

export default DetailOrder;
