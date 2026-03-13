import React from "react";

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h5 className="card-title fs-2">{restaurant.name}</h5>
                <p className="text-muted mb-1 fs-4">
                    {restaurant.cuisine} • {restaurant.pricing}
                </p>
                <p className="fs-6">{restaurant.city}, {restaurant.state}</p>
                <span className="badge text-dark mb-3 fs-2">
                    {restaurant.rating} ⭐
                </span>
                <img
                    src={
                        restaurant.photos && restaurant.photos.length > 0
                        ? restaurant.photos[0]
                        : "/placeholder-restaurant-image.png"
                    }
                    alt={restaurant.name}
                    className="card-img-top"
                    />
            </div>
        </div>
    );
};

export default RestaurantCard;