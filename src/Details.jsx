import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';  

function Details(props){
    const {nom, qualif} = props.champion;
    cont [isDetailsVisible, changeState] = useState(false);
    
    function handleCarriereProfClick(id) {
        const champ = info.find((champion) => champion.id === id);
        const wikipediaUrl = `https://fr.wikipedia.org/wiki/${encodeURIComponent(
            champ.nom
        )}`;
        window.open(wikipediaUrl, "_blank");
    }
    return(
        <>
        {isDetailsVisible &&(
            <ul className="list-group">
                <li className="list-group-item" key="qualif">
                    <strong>{qualif}</strong>
                </li>
            </ul>)}
        
        <button 
        className='btn btn-outline-primary' 
        onClick={() => changeState(!isDetailsVisible)}>
            {isDetailsVisible ? 'Hide Details' : 'Show Details'}
        </button>
        
        </>
    )
}

export default Details;