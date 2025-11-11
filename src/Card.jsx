import React from "react";
function Card(props) {
  return (
    <>
      <div className="col">
        <div className="card h-100">
          <h5 className="card-title">{props.nom}</h5>
          <img src={props.imageSrc} className="card-img-top" />
            <button className="button-cv" onClick={Details}>Details</button>
            </div>
      </div>
    </>
  );
}

export default Card