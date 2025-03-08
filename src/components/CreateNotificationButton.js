import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import '../styles.css'; // Import the CSS file

const CreateNotificationButton = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [liveMatches, setLiveMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [scoreboard, setScoreboard] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/Game/')
      .then(response => {
        const live = response.data.filter(match => match.status === 'live');
        setLiveMatches(live);
      })
      .catch(error => console.error('Error fetching live matches:', error));
  }, []);

  const handleSubmit = () => {
    if (!selectedMatchId || !eventType || !description || !scoreboard) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    setIsSubmitting(true);

    const notification = {
      match_id: Number(selectedMatchId),
      event_type: eventType,
      description: description,
      timestamp: moment().tz("America/Mexico_City").format(), // Fecha en la zona horaria correcta
      scoreboard: scoreboard,
    };

    console.log("Datos enviados:", notification); // 👈 Agregar este console.log

    axios.post('http://localhost:8080/sportEvent/', notification, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Notification created:', response.data);
      setIsSubmitting(false);
      setIsFormVisible(false);
      setSelectedMatchId('');
      setEventType('');
      setDescription('');
      setScoreboard('');
    })
    .catch(error => {
      console.error('Error creating notification:', error.response ? error.response.data : error);
      setIsSubmitting(false);
    });
  };

  const eventTypes = [
    'Gol',
    'Tarjeta Amarilla',
    'Tarjeta Roja',
    'Penal',
    'Falta',
    'Cambio',
    'Inicio del Partido',
    'Fin del Partido',
    'Tiempo Extra',
    'Lesión',
    'Fuera de Lugar'
  ];

  return (
    <div className="container">
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? 'Cancelar' : 'Crear Notificación'}
      </button>
      {isFormVisible && (
        <div>
          <h2>Crear Notificación</h2>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
          >
            <option value="">Seleccionar Partido en Vivo</option>
            {liveMatches.map(match => (
              <option key={match.id} value={match.id}>
                {match.home_team} vs {match.away_team} - {new Date(match.date_time).toLocaleString()}
              </option>
            ))}
          </select>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Seleccionar Tipo de Evento</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Marcador"
            value={scoreboard}
            onChange={(e) => setScoreboard(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Notificación'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateNotificationButton;