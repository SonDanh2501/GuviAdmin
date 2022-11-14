import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./TableManagePromotion.scss";

import { Media, Table } from "reactstrap";
import { getPromotion } from "../../../../redux/actions/promotion";
import { getPromotionSelector } from "../../../../redux/selectors/promotion";

export default function TableManagePromotion() {
  const dispatch = useDispatch();
  const promotion = useSelector(getPromotionSelector);
  React.useEffect(() => {
    dispatch(getPromotion.getPromotionRequest());
  }, [dispatch]);

  return (
    <>
      <Table className="align-items-center table-flush mt-5" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Tên Promotion</th>
            <th scope="col">Mã code</th>
            <th scope="col">Hạn</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {promotion.length > 0 &&
            promotion.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <img
                        alt="..."
                        src={item?.thumbnail}
                        className="img_customer"
                      />
                      <Media>
                        <span className="mb-0 text-sm">{item?.title.vi}</span>
                      </Media>
                    </Media>
                  </th>
                  <td>
                    <a>{item?.code}</a>
                  </td>
                  <td>
                    <a>{item?.phone}</a>
                  </td>
                  <td>
                    <button className="btn-edit">
                      <i className="uil uil-edit-alt"></i>
                    </button>
                    <button className="btn-delete">
                      <i class="uil uil-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
}
