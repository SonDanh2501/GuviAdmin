import React, { useState, useEffect, useCallback } from "react";
import "./GroupServiceManage.scss";
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
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import {
  createBanner,
  getBanners,
  updateBanner,
} from "../../../../redux/actions/banner";
import { getBanner } from "../../../../redux/selectors/banner";
import { postFile } from "../../../../api/file";
import { searchBanners } from "../../../../api/banner";
import {
  createGroupServiceAction,
  getGroupServiceAction,
  updateGroupServiceAction,
} from "../../../../redux/actions/service";
import { getGroupService } from "../../../../redux/selectors/service";
import TableManageGroupService from "./TableManageGroupService";

export default function GroupServiceManage() {
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [type, setType] = useState("single");
  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();
  const listGroupService = useSelector(getGroupService);
  React.useEffect(() => {
    dispatch(getGroupServiceAction.getGroupServiceRequest());
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    dispatch(
      createGroupServiceAction.createGroupServiceRequest({
        title: {
          vi: titleVN,
          en: titleEN,
        },
        description: {
          vi: descriptionVN,
          en: descriptionEN,
        },
        thumbnail: imgThumbnail,
        type: type,
      })
    );
  }, [
    dispatch,
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    imgThumbnail,
    type,
  ]);

  const onChangeThumbnail = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgThumbnail(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => setImgThumbnail(res))
      .catch((err) => console.log("err", err));
  };

  const setItemEdit = (itemEdit) => {
    setTitleVN(itemEdit?.title?.vi);
    setTitleEN(itemEdit?.title?.en);
    setDescriptionVN(itemEdit?.description?.vi);
    setDescriptionEN(itemEdit?.description?.en);
    setImgThumbnail(itemEdit?.thumbnail);
    setType(itemEdit?.type);
    setId(itemEdit?._id);
    setEdit(true);
    setCreate(false);
    window.scrollTo(0, 0);
  };

  const onEditGroupService = useCallback(() => {
    dispatch(
      updateGroupServiceAction.updateGroupServiceRequest({
        id: id,
        data: {
          title: {
            vi: titleVN,
            en: titleEN,
          },
          description: {
            vi: descriptionVN,
            en: descriptionEN,
          },
          thumbnail: imgThumbnail,
          type: type,
        },
      })
    );
  }, [id, titleVN, titleEN, descriptionVN, descriptionEN, imgThumbnail, type]);

  // const handleSearch = useCallback((value) => {
  //   searchBanners(value)
  //     .then((res) => setDataFilter(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="column">
          {create || edit ? (
            <Form>
              <Row>
                <Col md={6}>
                  <div>
                    <h5>Tiêu đề</h5>
                    <CustomTextInput
                      label={"Tiếng Việt"}
                      id="exampleTitle"
                      name="title"
                      placeholder="Vui lòng nhập tiêu đề Tiếng Việt"
                      type="text"
                      value={titleVN}
                      onChange={(e) => setTitleVN(e.target.value)}
                    />
                    <CustomTextInput
                      label={"Tiếng Anh"}
                      id="exampleTitle"
                      name="title"
                      placeholder="Vui lòng nhập tiêu đề Tiếng Anh"
                      type="text"
                      value={titleEN}
                      onChange={(e) => setTitleEN(e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <h5>Chi tiết</h5>
                    <CustomTextInput
                      label={"Tiếng Việt"}
                      id="exampleTitle"
                      name="title"
                      placeholder="Vui lòng nhập chi tiết Tiếng Việt"
                      type="text"
                      value={descriptionVN}
                      onChange={(e) => setDescriptionVN(e.target.value)}
                    />
                    <CustomTextInput
                      label={"Tiếng Anh"}
                      id="exampleTitle"
                      name="title"
                      placeholder="Vui lòng nhập chi tiết Tiếng Anh"
                      type="text"
                      value={descriptionEN}
                      onChange={(e) => setDescriptionEN(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="exampleImage">
                  <Label for="exampleImage">Thumbnail</Label>
                  <Input
                    id="exampleImage"
                    name="image"
                    type="file"
                    accept={".jpg,.png,.jpeg"}
                    className="input-group"
                    onChange={onChangeThumbnail}
                  />
                  {imgThumbnail && (
                    <img src={imgThumbnail} className="img-thumbnail" />
                  )}
                </Col>
                <Col md={6}>
                  <CustomTextInput
                    label={"Loại dịch vụ"}
                    id="exampleType"
                    name="type"
                    type="select"
                    className="select-code-phone"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    body={
                      <>
                        <option value="single">Single</option>
                        <option value="multi_tab">MultipleTab</option>
                      </>
                    }
                  />
                </Col>
              </Row>
              {create && (
                <Button className="mt-2" color="warning" onClick={onSubmit}>
                  Thêm GroupService
                </Button>
              )}
              {edit && (
                <Button
                  className="mt-2"
                  color="warning"
                  onClick={onEditGroupService}
                >
                  Sửa GroupService
                </Button>
              )}
            </Form>
          ) : (
            <></>
          )}
          <div className="mt-5">
            {/* <TableManageBanner /> */}
            <Card className="shadow">
              <CardHeader className="border-0 card-header">
                <Row className="align-items-center">
                  <Col className="text-left">
                    {!create && (
                      <Button
                        color="info"
                        onClick={() => {
                          setTitleVN("");
                          setTitleEN("");
                          setDescriptionVN("");
                          setDescriptionEN("");
                          setImgThumbnail("");
                          setType("single");
                          setCreate(!create);
                          setEdit(false);
                        }}
                      >
                        Thêm GroupService
                      </Button>
                    )}
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
                      <TableManageGroupService
                        data={e}
                        setItemEdit={setItemEdit}
                      />
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
        </div>
      </div>
    </React.Fragment>
  );
}
