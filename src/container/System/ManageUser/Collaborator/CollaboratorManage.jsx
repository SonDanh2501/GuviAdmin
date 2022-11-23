import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TableManageCollaborator from "./TableManageCollaborator.jsx";
import "./CollaboratorManage.scss";
import {
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardHeader,
  Table,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.jsx";
import {
  getCollaborator,
  getCollaboratorTotal,
} from "../../../../redux/selectors/collaborator";
import {
  createCollaborator,
  getCollaborators,
  updateCollaborator,
} from "../../../../redux/actions/collaborator";
import {
  searchCollaborators,
  pageCollaborators,
} from "../../../../api/collaborator.jsx";
import { removeVietnameseTones } from "../../../../helper/ConvertVie.js";
import AddCollaborator from "../../../../components/addCollaborator/addCollaborator.js";

export default function CollaboratorManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();
  const collaborator = useSelector(getCollaborator);
  const collaboratorTotal = useSelector(getCollaboratorTotal);

  useEffect(() => {
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
    if (index === 0) {
      dispatch(
        getCollaborators.getCollaboratorsRequest({ start: 0, length: 10 })
      );
    } else if (index === 1) {
      dispatch(
        getCollaborators.getCollaboratorsRequest({
          start: collaborator.length,
          length: 10,
        })
      );
    }
  };

  const pageCount = collaboratorTotal / collaborator.length;
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
      <div className="mt-5">
        {/* <div className="">
                {create || edit ? (
                  <Form>
                    <Row>
                      <Col md={6}>
                        <CustomTextInput
                          label={"Email"}
                          id="exampleEmail"
                          name="email"
                          placeholder="Nhập email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Col>
                      <Col md={6}>
                        {create && (
                          <CustomTextInput
                            label={"Password"}
                            id="examplePassword"
                            name="password"
                            placeholder="Nhập password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <CustomTextInput
                          label={"Tên cộng tác viên"}
                          id="exampleName"
                          name="name"
                          placeholder="Nhập tên cộng tác viên"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Col>
                      <Col md={6}>
                        {create && (
                          <CustomTextInput
                            label={"CMND/CCCD"}
                            id="exampleCMND/CCCD"
                            placeholder="Nhập CMND/CCCD"
                            name="identify"
                            type="number"
                            value={identify}
                            onChange={(e) => setIdentify(e.target.value)}
                          />
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <CustomTextInput
                          label={"Code phone area"}
                          id="exampleCodePhoneArea"
                          placeholder="Nhập code phone area"
                          name="code_phone_area"
                          type="select"
                          className="select-code-phone"
                          value={codePhone}
                          onChange={(e) => setCodePhone(e.target.value)}
                          body={
                            <>
                              <option value={"+84"}>+84</option>
                              <option value={"+1"}>+1</option>
                            </>
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <CustomTextInput
                          label={"Số điện thoại"}
                          id="examplePhone"
                          placeholder="Nhập số điện thoại"
                          name="phone"
                          type="number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Col>
                    </Row>

                    {create && (
                      <Button color="warning" onClick={onSubmit}>
                        Thêm cộng tác viên
                      </Button>
                    )}

                    {edit && (
                      <Button color="warning" onClick={onEditCustomer}>
                        Sửa cộng tác viên
                      </Button>
                    )}
                  </Form>
                ) : (
                  <></>
                )}
              </div> */}
        <div className="mt-5">
          <Card className="shadow">
            <CardHeader className="border-0 card-header">
              <Row className="align-items-center">
                <Col className="text-left">
                  {/* {!create && (
                          <Button
                            color="info"
                            onClick={() => {
                              setCodePhone("");
                              setPhone("");
                              setEmail("");
                              setName("");
                              setIdentify("");
                              setCreate(!create);
                              setEdit(false);
                            }}
                          >
                            Thêm cộng tác viên
                          </Button>
                        )} */}
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
            <Table responsive>
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
                    collaborator.map((e) => (
                      <TableManageCollaborator data={e} />
                    ))}
              </tbody>
            </Table>
            <CardFooter>
              <nav aria-label="...">
                <Pagination
                  className="pagination justify-content-end mb-0"
                  listClassName="justify-content-end mb-0"
                >
                  <PaginationItem>
                    <PaginationLink
                      onClick={(e) => handleClick(e, currentPage - 1)}
                      previous
                      href="#"
                    />
                  </PaginationItem>
                  {pageNumbers}
                  <PaginationItem disabled={currentPage >= pageCount - 1}>
                    <PaginationLink
                      onClick={(e) => handleClick(e, currentPage + 1)}
                      next
                      href="#"
                    />
                  </PaginationItem>
                </Pagination>
              </nav>
            </CardFooter>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}
