'use client';
import React from 'react';

export const SnowballCard = ({ name, price, description, image }) => {
    const handleAddToCart = () => {
        console.log(`${name} added to cart!`);
    };

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img src={image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"} alt={name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p>{description}</p>
                <p className="font-semibold">Price: ${price}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};