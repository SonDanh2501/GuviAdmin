import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import {
  Card,
  CardFooter,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import { getServiceByIdApi } from "../../../../api/service";
import AddService from "../../../../components/addService/addService";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { getGroupService } from "../../../../redux/selectors/service";
import "./ServiceManage.scss";
import TableManageGroupService from "./TabManageService";

export default function ServiceManage() {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);

  React.useEffect(() => {
    getServiceByIdApi(id)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">{/* <AddService id={id} /> */}</Col>
            </Row>
          </CardHeader>
          <Table className="align-items-center table-flush " responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {data && data.map((e) => <TableManageGroupService data={e} />)}
            </tbody>
          </Table>
          <CardFooter>
            <nav aria-label="...">
              <Pagination
                className="pagination justify-content-end mb-0"
                listClassName="justify-content-end mb-0"
              >
                <PaginationItem className="active">
                  <PaginationLink
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </nav>
          </CardFooter>
        </Card>
      </div>
      <Outlet />
    </React.Fragment>
  );
}
