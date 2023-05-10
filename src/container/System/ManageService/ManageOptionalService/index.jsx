import { useLocation } from "react-router-dom";
import "./styles.scss";
import { useEffect, useState } from "react";
import { getOptionalServiceByServiceApi } from "../../../../api/service";

const ManageOptionService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);

  useEffect(() => {
    getOptionalServiceByServiceApi(id)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, [id]);
  return (
    <div>
      {data.map((item, index) => {
        return (
          <div>
            <a>{item?.optional_service?.title?.vi}</a>
            <div className="div-extend">
              {item?.extend_optional?.map((itemExtend, indexExtend) => {
                return (
                  <div className="div-item-extend">
                    <a>{itemExtend?.title?.vi}</a>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManageOptionService;
