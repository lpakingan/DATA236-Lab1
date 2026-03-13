import React, { useState, useEffect } from 'react';
// import AssistantInterface from './AssistantInterface';
import RestaurantCard from '../components/RestaurantCard';
import Navbar from '../components/Navbar'
import api from "../api/api";

const Explore = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [searched, setSearched] = useState(false);

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
                <div>
                    <Navbar
                        search={search}
                        setSearch={setSearch}
                        searchBy={searchBy}
                        setSearchBy={setSearchBy}
                        fetchResults={fetchResults}
                    />
                    <div className="row">
                        {restaurants.map(r => (
                            <div key={r.id} className="col-md-6 mb-3 mt-4">
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
