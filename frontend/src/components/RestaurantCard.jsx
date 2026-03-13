import React from "react";

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">{restaurant.name}</h5>
                <p className="text-muted mb-1">
                    {restaurant.cuisine} • {restaurant.pricing}
                </p>
                <p className="small">{restaurant.location}</p>
                <span className="badge bg-warning text-dark">
                    {restaurant.rating} ⭐
                </span>
            </div>
        </div>
    );
};

export default RestaurantCard;