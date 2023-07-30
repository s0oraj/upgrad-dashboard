import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onChange, value }) => {
  return (
    <div className="flex items-center rounded-md shadow-md">
      <SearchIcon className="h-6 w-6 text-gray-400 mx-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by name..."
        className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;
