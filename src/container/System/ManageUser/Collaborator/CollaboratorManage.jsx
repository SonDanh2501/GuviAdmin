import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { searchCollaborators } from "../../../../api/collaborator.jsx";
import AddCollaborator from "../../../../components/addCollaborator/addCollaborator.js";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.jsx";
import { getCollaborators } from "../../../../redux/actions/collaborator";
import { loadingAction } from "../../../../redux/actions/loading.js";
import {
  getCollaborator,
  getCollaboratorTotal,
} from "../../../../redux/selectors/collaborator";
import "./CollaboratorManage.scss";
import TableManageCollaborator from "./TableManageCollaborator.jsx";

export default function CollaboratorManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();
  const collaborator = useSelector(getCollaborator);
  const collaboratorTotal = useSelector(getCollaboratorTotal);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      getCollaborators.getCollaboratorsRequest({ start: 0, length: 10 })
    );
  }, [dispatch]);

  const handleSearch = useCallback((value) => {
    searchCollaborators(value)
      .then((res) => setDataFilter(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * collaborator.length;
    dispatch(
      getCollaborators.getCollaboratorsRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const pageCount = collaboratorTotal / 10;
  let pageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageNumbers.push(
      <PaginationItem key={i} active={currentPage === i ? true : false}>
        <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddCollaborator />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader>
          <Table
            className="align-items-center table-flush"
            responsive={true}
            hover={true}
          >
            <thead className="thead-light">
              <tr>
                <th>Tên cộng tác viên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Giới tính</th>
                {/* <th>Ngày sinh</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageCollaborator data={e} />)
                : collaborator &&
                  collaborator.map((e) => <TableManageCollaborator data={e} />)}
            </tbody>
          </Table>
          <CardFooter>
            <nav aria-label="...">
              <Pagination
                className="pagination justify-content-end mb-0"
                listClassName="justify-content-end mb-0"
              >
                <PaginationItem
                  className={currentPage === 0 ? "disabled" : "enable"}
                >
                  <PaginationLink
                    onClick={(e) => handleClick(e, currentPage - 1)}
                    previous
                    href="#"
                  >
                    <i class="uil uil-previous"></i>
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers}
                <PaginationItem disabled={currentPage >= pageCount - 1}>
                  <PaginationLink
                    onClick={(e) => handleClick(e, currentPage + 1)}
                    next
                    href="#"
                  >
                    <i class="uil uil-step-forward"></i>
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </nav>
          </CardFooter>
        </Card>
      </div>
    </React.Fragment>
  );
}
