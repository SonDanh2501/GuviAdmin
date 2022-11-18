import React, { Component, useState } from "react";
import { Pagination, PaginationItem, PaginationLink, Button } from "reactstrap";

const PaginationCustom = ({ pageSize, pageCount, data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };
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
  const paginatedData = data.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    //   <React.Fragment>
    //     {paginatedData.map((datum, i) => (
    //       <tr className="data-slice" key={i}>
    //         <td>{datum.id}</td>
    //         <td>{datum.message}</td>
    //         <td>
    //           <Button id={datum.i} color="primary">
    //             Edit Details
    //           </Button>
    //         </td>
    //       </tr>
    //     ))}
    <React.Fragment>
      <Pagination aria-label="Page navigation example">
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
      <hr />
      currentPage (real): {currentPage} <br />
      currentPage (visual): {currentPage + 1}
    </React.Fragment>
    //   </React.Fragment>
  );
};

export default PaginationCustom;
