import React from "react";
import { Pagination as MuiPagination } from "@mui/material";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center my-6">
      <MuiPagination
        count={totalPages}
        page={currentPage + 1}
        onChange={onPageChange}
        shape="rounded"
      />
    </div>
  );
};

export default Pagination;
