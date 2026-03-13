import React, { useState, useEffect } from 'react';
// import AssistantInterface from './AssistantInterface';
import RestaurantCard from '../components/RestaurantCard';
import api from "../api/api";

const Explore = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [searched, setSearched] = useState(false);

    const placeholderText =
        searchBy === "name" ? "Search by restaurant name..." 
        : searchBy === "cuisine" ? "Search by cuisine..." 
        : searchBy === "keyword" ? "Search by keyword..." 
        : searchBy === "city" ? "Search by city..." 
        : "Search...";

    const fetchResults = async () => {
        try {
            let params = {}
            
            if (searchBy === "name") {
                params.name = search;
            } else if (searchBy === "cuisine") {
                params.cuisine = search;
            } else if (searchBy === "keyword") {
                params.keyword = search;
            } else if (searchBy === "city") {
                params.city = search;
            }

            const res = await api.get("/restaurants", {params}); 
            setRestaurants(Array.isArray(res.data) ? res.data : []);
            setSearched(true);
            setSearch("");
        } catch (err) {
            setRestaurants([]);
            setSearched(true);
            setSearch("");
        }
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
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
                    <div className="row">
                        {restaurants.map(r => (
                            <div key={r.id} className="col-md-6 mb-3">
                                <RestaurantCard restaurant={r} />
                            </div>
                        ))}
                    </div>
                    {searched && restaurants.length === 0 && (
                        <div className="col-12">
                            <div className="alert alert-warning">
                                No results found. Try searching again!
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-4">
                    {/* <AssistantInterface /> */}
                </div>
            </div>
        </div>
    );
};

export default Explore;
