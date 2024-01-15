import { useDispatch, useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import { loadingAction } from "../../../redux/actions/loading";
import { errorNotify } from "../../../helper/toast";
import { useEffect, useState } from "react";
import { getOrderByGroupOrderApi } from "../../../api/order";
import InfoCustomer from "./InfoCustomer";
import InfoCollaborator from "./InfoCollaborator";
import { getFavoriteAndBlockByCustomers } from "../../../api/customer";

const InForDetailOrder = (props) => {
  const { id } = props;
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();
  const [dataGroup, setDataGroup] = useState();
  const [dataList, setDataList] = useState();
  const [customer, setCustomer] = useState();
  const [collaborator, setCollaborator] = useState();
  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    getOrderByGroupOrderApi(id, lang)
      .then((res) => {
        setDataGroup(res?.data?.groupOrder);
        setDataList(res?.data?.listOrder);
        setCustomer(res?.data?.groupOrder?.id_customer);
        setCollaborator(res?.data?.groupOrder?.id_collaborator);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  console.log("data group ", dataGroup);
  return (
    <>
      <section className="info-collab-customer">
        {customer && <InfoCustomer info={customer} />}
        {collaborator && (
          <InfoCollaborator
            info={collaborator}
            list_block={dataGroup?.id_block_collaborator}
            list_favourite={dataGroup?.id_favourite_collaborator}
          />
        )}
      </section>
    </>
  );
};
export default InForDetailOrder;
