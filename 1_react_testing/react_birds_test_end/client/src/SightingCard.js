import { deleteSighting } from "./SightingService"

const SightingCard = ({sighting, removeSighting}) => {

    const handleDelete = () => {
        deleteSighting(sighting._id).then(()=>{
            removeSighting(sighting._id);
        })
    }
    return (
        <>
            <h1 data-testid="heading">{sighting.species}</h1>
            <p data-testid="location">Location: {sighting.location}</p>
            <p data-testid="date">Date: {sighting.date}</p>
            <button data-testid="delete" onClick={handleDelete}> 🗑 </button>
            <hr></hr>
        </>
    )
}

export default SightingCard;