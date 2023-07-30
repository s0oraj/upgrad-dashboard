// src/components/Table.js
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

function CustomTable({ data, columns, rowsPerPage }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={rowsPerPage}
        pagination
      />
    </div>
  );
}

export default CustomTable;
