import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNews } from "../../../../redux/selectors/news";
import "./TableManageNews.scss";
import * as actions from "../../../../redux/actions/news";
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

export default function TableManageNews() {
  const [newss, setNews] = useState({
    phone: "",
    email: "",
    name: "",
    default_address: "",
  });
  const [modal, setModal] = React.useState(false);

  const dispatch = useDispatch();
  const news = useSelector(getNews);
  console.log("<<<<<<<<<<<<<<<<<CHECK NEWSSSSSSSSSSSS",news);
  React.useEffect(() => {
    dispatch(actions.getNews.getNewsRequest());
  }, [dispatch]);


  // Toggle for Modal
  const toggle = () => setModal(!modal);
  return (
    <>
      <Table className="align-items-center table-flush mt-5" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Short description</th>
            <th scope="col">URL</th>
            <th scope="col">Type</th>
            <th scope="col">Thumbnail</th>
            <th scope="col" />
          </tr>
        </thead>


        {/* <tbody>
          {news && news.length > 0 &&
            news.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <img
                        alt="..."
                        src={item?.thumbnail}
                        className="img_news"
                        width={"50px"}
                      />
                      <Media>
                        <span className="mb-0 text-sm">{item?.title}</span>
                      </Media>
                    </Media>
                  </th>
                  <td>
                    <a>{item?.short_description}</a>
                  </td>
                  <td>
                    <a>{item?.url}</a>
                  </td>
                  <td>
                    <a>{item?.type}</a>
                  </td>
                  <td>
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
        </tbody> */}

        <tbody>
          {news && news.length > 0 &&
            news.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row" className="col-2">
                      <Media>
                        <span className="mb-0 text-sm">{item?.title}</span>
                      </Media>
                  </th>
                  <td className="col-2">
                    {/* <a>{item?.short_description}</a> */}
                    <Media>
                        <span className="mb-0 text-sm">{item?.short_description}</span>
                      </Media>
                  </td>
                  <td className="col-2">
                  <Media>
                  <span className="mb-0 text-sm">{item?.url}</span>
                      </Media>
                  </td>
                  
                  <td className="col-1">
                    <span>{item?.type}</span>
                  </td>
                  <td>
                  <Card className="my-2">
    <CardImg
      alt="Card image cap"
      src={item?.thumbnail}
      style={{
        height: 100
      }}
      
      width="100%"
    />
</Card>
                  </td>
               
                  <td>
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
