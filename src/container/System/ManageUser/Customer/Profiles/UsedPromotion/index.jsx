import { useEffect, useState } from "react";
import { getUsedPromotionByCustomers } from "../../../../../../api/customer";

const UsedPromotion = ({ id }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getUsedPromotionByCustomers(id)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, [id]);
  return (
    <div>
      <a>hioudsefgiu</a>
    </div>
  );
};

export default UsedPromotion;
