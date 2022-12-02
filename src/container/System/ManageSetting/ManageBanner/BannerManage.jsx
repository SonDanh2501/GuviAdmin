import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Col,
  Form,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import { searchBanners } from "../../../../api/banner";
import { postFile } from "../../../../api/file";
import AddBanner from "../../../../components/addBanner/addBanner";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import {
  createBanner,
  getBanners,
  updateBanner,
} from "../../../../redux/actions/banner";
import { loadingAction } from "../../../../redux/actions/loading";
import { getPromotion } from "../../../../redux/actions/promotion";
import { getBanner, getBannerTotal } from "../../../../redux/selectors/banner";
import { getPromotionSelector } from "../../../../redux/selectors/promotion";
import "./BannerManage.scss";
import TableManageBanner from "./TableManageBanner.jsx";
import _debounce from "lodash/debounce";

export default function BannerManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const banners = useSelector(getBanner);
  const totalBanner = useSelector(getBannerTotal);
  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getBanners.getBannersRequest(0, 10));
  }, [dispatch]);

  const handleSearch = useCallback(
    _debounce((value) => {
      searchBanners(value)
        .then((res) => setDataFilter(res.data))
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  const handleClick = useCallback(
    (e, index) => {
      e.preventDefault();
      setCurrentPage(index);
      const start =
        dataFilter.length > 0
          ? index * dataFilter.length
          : index * banners.length;

      dispatch(
        getPromotion.getPromotionRequest({
          start: start > 0 ? start : 0,
          length: 10,
        })
      );
    },
    [dataFilter]
  );

  const pageCount = totalBanner / 10;
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
                <AddBanner />
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
                <th scope="col">Title</th>
                <th scope="col">Type link</th>
                <th scope="col">Position</th>
                <th scope="col">Link ID</th>
                <th scope="col">Banner</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageBanner data={e} />)
                : banners && banners.map((e) => <TableManageBanner data={e} />)}
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
                    href="#"
                  >
                    <i class="uil uil-previous"></i>
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers}
                <PaginationItem disabled={currentPage >= pageCount - 1}>
                  <PaginationLink
                    onClick={(e) => handleClick(e, currentPage + 1)}
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
