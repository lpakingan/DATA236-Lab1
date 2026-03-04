import React, { useState } from 'react';

const ProfileManagement = () => {
    const [profile, setProfile] = useState({
        name: '', email: '', city: '',
        cuisine: 'Italian', price_range: '$$', dietary: 'None' // [cite: 21, 22, 25]
    });

    const handleUpdate = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value});
    };

    return (
        <div className="container mt-4">
            <h2>Profile & AI Preferences</h2>
            <div className="row mt-3">
                <div className="col-md-6">
                    <h5>Personal Details</h5>
                    <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleUpdate} />
                    <input className="form-control mb-2" name="city" placeholder="City" onChange={handleUpdate} />
                </div>
                <div className="col-md-6">
                    <h5>AI Personalization</h5>
                    <label>Preferred Cuisine</label>
                    <select className="form-select mb-2" name="cuisine" onChange={handleUpdate}>
                        <option>Italian</option><option>Chinese</option><option>Mexican</option><option>Japanese</option>
                    </select>
                    <label>Price Range</label>
                    <select className="form-select mb-2" name="price_range" onChange={handleUpdate}>
                        <option>$</option><option>$$</option><option>$$$</option>
                    </select>
                    <button className="btn btn-dark w-100 mt-2">Save Profile</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;
