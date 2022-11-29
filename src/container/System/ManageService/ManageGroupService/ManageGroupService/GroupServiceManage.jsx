import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
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
import AddGroupService from "../../../../../components/addGroupService/addGroupService";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getGroupServiceAction } from "../../../../../redux/actions/service";
import { getGroupService } from "../../../../../redux/selectors/service";
import "./GroupServiceManage.scss";
import TableManageGroupService from "./TableManageGroupService";

export default function GroupServiceManage() {
  const dispatch = useDispatch();
  const listGroupService = useSelector(getGroupService);
  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getGroupServiceAction.getGroupServiceRequest());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddGroupService />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  // onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
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
              {listGroupService &&
                listGroupService.map((e) => (
                  <TableManageGroupService data={e} />
                ))}
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
