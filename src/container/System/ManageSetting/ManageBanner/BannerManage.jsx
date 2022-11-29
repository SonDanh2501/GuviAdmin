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
import { getBanner } from "../../../../redux/selectors/banner";
import { getPromotionSelector } from "../../../../redux/selectors/promotion";
import "./BannerManage.scss";
import TableManageBanner from "./TableManageBanner.jsx";

export default function BannerManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();
  const banners = useSelector(getBanner);
  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getBanners.getBannersRequest());
  }, [dispatch]);

  const handleSearch = useCallback((value) => {
    searchBanners(value)
      .then((res) => setDataFilter(res.data))
      .catch((err) => console.log(err));
  }, []);

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
    </React.Fragment>
  );
}
