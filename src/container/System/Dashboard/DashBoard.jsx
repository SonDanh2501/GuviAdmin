import React from "react";
import { Card, CardHeader, Col, Container, Row, Table } from "reactstrap";
import "./DashBoard.scss";
import Header from "./HeaderBoard/Header";
import HomeObj from "./DashboardTable";
const data = [
  {
    id: 1,
    name: "Nguyễn Tam Kiều Công",
    service: "Tong ve sinh",
    time: "16:00",
    address: "Ho chi Minh",
    progress: "Hoàn thành",
  },
  {
    id: 2,
    name: "Nguyễn Tam Kiều Công",
    service: "Tong ve sinh",
    time: "16:00",
    address: "Ho chi Minh",
    progress: "Hoàn thành",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Thông tin dịch vụ gần nhất</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Khách hàng</th>
                    <th scope="col">Dịch vụ yêu cầu</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Địa điểm</th>
                    <th scope="col">Tiến độ</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((e) => <HomeObj {...e} />)
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
