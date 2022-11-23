import React, { useCallback, useEffect } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
import { searchPromotion } from "../../../../api/promotion.jsx";
import AddPromotion from "../../../../components/addPromotion/addPromotion.js";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.jsx";
import { removeVietnameseTones } from "../../../../helper/ConvertVie.js";
import { getPromotion } from "../../../../redux/actions/promotion.js";
import { getServiceAction } from "../../../../redux/actions/service.js";
import {
  getPromotionSelector,
  getTotalPromotion,
} from "../../../../redux/selectors/promotion.js";
import "./PromotionManage.scss";
import TableManagePromotion from "./tableManagePromotion.jsx";

export default function PromotionManage() {
  const promotion = useSelector(getPromotionSelector);
  const total = useSelector(getTotalPromotion);
  const dispatch = useDispatch();
  const [dataFilter, setDataFilter] = React.useState([]);

  useEffect(() => {
    dispatch(getServiceAction.getServiceRequest());
    dispatch(getPromotion.getPromotionRequest());
  }, []);

  const handleSearch = useCallback((value) => {
    searchPromotion(removeVietnameseTones(value))
      .then((res) => setDataFilter(res?.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <div className="mt-5">
        <div className="mt-5">
          <Card className="shadow">
            <CardHeader className="border-0 card-header">
              <Row className="align-items-center">
                <Col className="text-left">
                  {/* {!create && (
                      <Button color="info" onClick={() => setCreate(!create)}>
                        Thêm khuyến mãi
                      </Button>
                    )} */}
                  <AddPromotion />
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
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Tên Promotion</th>
                  <th scope="col">Mã code</th>
                  <th scope="col">Hạn</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {dataFilter.length > 0
                  ? dataFilter.map((e) => <TableManagePromotion data={e} />)
                  : promotion &&
                    promotion.map((e) => <TableManagePromotion data={e} />)}
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
      </div>
    </React.Fragment>
  );
}
