import React, { useCallback, useEffect, useState } from "react";
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
import { loadingAction } from "../../../../redux/actions/loading.js";
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
  const [currentPage, setCurrentPage] = useState(0);

  const total = useSelector(getTotalPromotion);
  const dispatch = useDispatch();
  const [dataFilter, setDataFilter] = useState([]);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getServiceAction.getServiceRequest());
    dispatch(getPromotion.getPromotionRequest({ start: 0, length: 10 }));
  }, []);

  const handleSearch = useCallback((value) => {
    searchPromotion(removeVietnameseTones(value))
      .then((res) => setDataFilter(res?.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * promotion.length;
    dispatch(
      getPromotion.getPromotionRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const pageCount = total / 10;
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
      </div>
    </React.Fragment>
  );
}
