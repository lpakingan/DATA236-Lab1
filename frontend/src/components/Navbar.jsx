import React from "react";

const Navbar = ({
  search,
  setSearch,
  searchBy,
  setSearchBy,
  fetchResults,
}) => {
  const placeholderText =
    searchBy === "name"
      ? "Search by restaurant name..."
      : searchBy === "cuisine"
      ? "Search by cuisine..."
      : searchBy === "keyword"
      ? "Search by keyword..."
      : searchBy === "city"
      ? "Search by city..."
      : "Search...";

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom px-3 py-3">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">Tastlytics</span>

        <div className="input-group mb-4">
            <input 
                className="form-control form-control-lg" 
                placeholder={placeholderText} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select 
                className="form-control form-control-lg" 
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
            >
                <option value="name"> Name </option>
                <option value="cuisine"> Cuisine </option>
                <option value="keyword"> Keyword </option>
                <option value="city"> City </option>
            </select>
            <button className="btn btn-danger" onClick={fetchResults}>Search</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;