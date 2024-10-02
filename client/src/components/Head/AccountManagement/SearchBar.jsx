import React from "react";

const SearchBar = ({ searchTerm, handleSearch }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="search"
        id="search"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full h-10"
        placeholder="Tìm kiếm người dùng"
      />
    </div>
  );
};

export default SearchBar;