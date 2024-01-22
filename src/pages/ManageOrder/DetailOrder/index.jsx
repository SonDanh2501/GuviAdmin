import { useParams } from "react-router-dom";
import CustomTab from "../../../components/customTab/CustomTab";
import ActivityOrder from "./ActivityOrder";
import InForDetailGroupOrder from "./InForDetailGroupOrder";

const DetailOrder = () => {
  const params = useParams();
  const idGroupOrder = params?.id;
  const tempData = [
    {
      label: "Chi tiết đơn hàng",
      children: <InForDetailGroupOrder id={idGroupOrder} />,
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
