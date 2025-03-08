import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css'; // Import the CSS file

const CreateMatchButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [match, setMatch] = useState({ home_team: '', away_team: '', date_time: '' });

  const handleCreate = () => {
    const matchData = {
      ...match,
      date_time: new Date(match.date_time).toISOString()  // Convertir a formato ISO 8601 con zona horaria
    };
    console.log('Sending match data:', matchData);
    axios.post('http://localhost:8080/Game/', matchData)
      .then(response => {
        console.log('Match created:', response.data);
        window.location.reload(); // Recargar la página para ver los cambios
      })
      .catch(error => console.error('Error creating match:', error));
  };

  return (
    <div className="create-match">
      <button onClick={() => setShowForm(!showForm)}>Crear Partido</button>
      {showForm && (
        <div className="create-match-form">
          <input
            type="text"
            value={match.home_team}
            onChange={(e) => setMatch({ ...match, home_team: e.target.value })}
            placeholder="Equipo Local"
          />
          <input
            type="text"
            value={match.away_team}
            onChange={(e) => setMatch({ ...match, away_team: e.target.value })}
            placeholder="Equipo Visitante"
          />
          <input
            type="datetime-local"
            value={match.date_time}
            onChange={(e) => setMatch({ ...match, date_time: e.target.value })}
          />
          <button onClick={handleCreate}>Crear</button>
        </div>
      )}
    </div>
  );
};

export default CreateMatchButton;