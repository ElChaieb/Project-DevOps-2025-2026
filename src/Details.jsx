import { useState } from 'react';  
import info from './info.jsx'; // 👈 FIX: Import info data

function Details(props){
    // 👈 FIX: Destructure id, nom, and qualif
    const {id, nom, qualif} = props.champion;
    
    // 👈 FIX: 'const' instead of 'cont'
    const [isDetailsVisible, changeState] = useState(false);
    
    function handleCarriereProfClick(champId) { // Use champId to avoid conflict with outer id
        const champ = info.find((champion) => champion.id === champId);
        
        // Check if champion was found before trying to access champ.nom
        if (champ) {
            const wikipediaUrl = `https://fr.wikipedia.org/wiki/${encodeURIComponent(
                champ.nom
            )}`;
            window.open(wikipediaUrl, "_blank");
        }
    }

    return(
        <>
        {isDetailsVisible &&(
            <ul className="list-group list-group-flush">
                <li className="list-group-item" key="qualif">
                    <strong>Qualification:</strong> {qualif} 
                </li>
                {/* 👈 FIX: Add the Wikipedia link logic */}
                <li className="list-group-item">
                    <a
                        className="btn btn-primary"
                        href="#"
                        role="button"
                        onClick={() => handleCarriereProfClick(id)}
                    >
                        Carrière professionnelle
                    </a>
                </li>
            </ul>
        )}
        
        <button 
        className='btn btn-outline-primary' 
        onClick={() => changeState(!isDetailsVisible)}>
            {isDetailsVisible ? 'Hide Details' : 'Show Details'}
        </button>
        
        </>
    )
}

export default Details;