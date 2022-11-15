import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBanner } from "../../../../redux/selectors/banner";
import "./TableManageBanner.scss";
import * as actions from "../../../../redux/actions/banner";
import {
  Table,Card,CardImg,
  Row,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
// import { deleteBanner } from "../../../../api/customer";

export default function TableManageBanner() {
  const [Banner, setBanner] = useState({
    title: "",
    image: "",
    type_link: "",
    link_id: "",
    position: "",
  });
  const [modal, setModal] = React.useState(false);

  const dispatch = useDispatch();
  const Banners = useSelector(getBanner);
  React.useEffect(() => {
    dispatch(actions.getBanners.getBannersRequest());
  }, [dispatch]);

  // const onDelete = useCallback((id) => {
  //   deleteBanner(id, { is_delete: true });
  // }, []);
  // Toggle for Modal
  const toggle = () => setModal(!modal);

  return (
    <>
      <Table className="align-items-center table-flush mt-5" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Type link</th>
            <th scope="col">Position</th>
            <th scope="col" >Link ID</th>
            <th scope="col">Banner</th>
            <th scope="col" />
          </tr>
        </thead>

        <tbody>
          {Banners && Banners.length > 0 &&
            Banners.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row" className="col-2">
                      <Media>
                        <span className="mb-0 text-sm">{item?.title}</span>
                      </Media>
                  </th>
                  <td className="col-0.5">
                    <a>{item?.type_link}</a>
                  </td >
                  <td className="col-0.5">
                    <a>{item?.position}</a>
                  </td>
                  <td className="col-2">
                    <span>{item?.link_id}</span>
                  </td>
                  <td>
                  <Card className="my-2">
    <CardImg
      alt="Card image cap"
      src={item?.image}
      style={{
        height: 100
      }}
      
      width="100%"
    />
</Card>
                  </td>
               
                  <td >
                    <button className="btn-edit">
                      <i className="uil uil-edit-alt"></i>
                    </button>
                    <button className="btn-delete" onClick={toggle}>
                      <i className="uil uil-trash"></i>
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
