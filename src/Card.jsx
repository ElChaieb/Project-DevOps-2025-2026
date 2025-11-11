import React from "react";
import Details from "./Details.jsx"; // 👈 FIX: Import Details component

function Card({ champion }) { // 👈 IMPROVEMENT: Destructure champion directly
    // Use object destructuring to get properties needed for the Card itself
    const { nom, imageSrc } = champion; 
    const imageStyle = {
        height: '200px', // Adjust this value to your desired height
        width: '200px',  // Ensures the image covers the area without distortion
    };
    return (
        <div className="col">
            <div className="card h-100">
                <h5 className="card-title">{nom}</h5>
                <img  src={imageSrc} className="card-img-top"  style={imageStyle} alt={nom} />
                <div className="card-body"> 
                    {/* 👈 FIX: Render the Details component and pass the full champion object */}
                    <Details champion={champion} />
                </div>
            </div>
        </div>
    );
}

export default Card;