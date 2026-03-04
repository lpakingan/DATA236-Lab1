import React, { useState, useEffect } from 'react';
import AssistantInterface from './AssistantInterface';
import axios from 'axios';

const Explore = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState("");

    const fetchResults = async () => {
        const res = await axios.get(`http://localhost:8000/restaurants?query=${search}`); // [cite: 81]
        setRestaurants(res.data);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <div className="input-group mb-4">
                        <input 
                            className="form-control form-control-lg" 
                            placeholder="Search by name, cuisine, or keyword..." 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-danger" onClick={fetchResults}>Search</button>
                    </div>
                    <div className="row">
                        {restaurants.map(r => (
                            <div key={r.id} className="col-md-6 mb-3">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{r.name}</h5>
                                        <p className="text-muted mb-1">{r.cuisine} • {r.price_range}</p>
                                        <p className="small">{r.location}</p>
                                        <span className="badge bg-warning text-dark">{r.rating} ⭐</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-4">
                    <AssistantInterface />
                </div>
            </div>
        </div>
    );
};

export default Explore;
