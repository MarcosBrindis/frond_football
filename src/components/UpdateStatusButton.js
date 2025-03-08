import React from 'react';
import axios from 'axios';
import '../styles.css'; // Import the CSS file

const UpdateStatusButton = ({ match, onUpdate }) => {
  const nextStatus = match.status === 'live' ? 'Finalized' : 'live';

  const handleUpdate = () => {
    axios.put(`http://localhost:8080/Game/${match.id}`, { status: nextStatus })
      .then(response => {
        console.log('Status updated:', response.data);
        onUpdate(response.data);
        window.location.reload();
      })
      .catch(error => console.error('Error updating status:', error));
  };

  return (
    <div className="update-status">
      <h2>Actualizar Estado del Partido</h2>
      <button onClick={handleUpdate}>Actualizar Estado a {nextStatus}</button>
    </div>
  );
};

export default UpdateStatusButton;