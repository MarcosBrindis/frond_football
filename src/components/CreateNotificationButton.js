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
  const [notifications, setNotifications] = useState([]);
  const [matchTitle, setMatchTitle] = useState('');

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

  useEffect(() => {
    axios.get('http://54.174.200.174:8080/Game/')
      .then(response => {
        const live = response.data.filter(match => match.status === 'live');
        setLiveMatches(live);
      })
      .catch(error => console.error('Error fetching live matches:', error));
  }, []);

  useEffect(() => {
    const pollNotifications = () => {
      axios.get('http://54.166.101.0:8001/consumer/message')
        .then(response => {
          const newNotification = response.data;
          if (newNotification && newNotification.message) {
            try {
              const parsedMessage = JSON.parse(newNotification.message);
              const match = liveMatches.find(m => m.id === parsedMessage.match_id);
              if (match) {
                parsedMessage.matchTitle = `${match.home_team} vs ${match.away_team}`;
              }
              setNotifications(prevNotifications => [...prevNotifications, parsedMessage]);
            } catch (error) {
              console.error('Error parsing notification message:', error);
            }
          }
        })
        .catch(error => console.error('Error fetching notifications:', error));
    };

    const intervalId = setInterval(pollNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [liveMatches]);

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

    axios.post('http://54.174.200.174:8080/sportEvent/', notification, {
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

  // Display notifications in a floating window
  const renderNotifications = () => {
    return notifications.map((notification, index) => (
      <div key={index} className="notification">
        <div className="notification-header">
          <p><strong>Partido:</strong> {notification.matchTitle || 'N/A'}</p>
        </div>
        <div className="notification-body">
          <p><strong>Evento:</strong> {notification.event_type || 'N/A'}</p>
          <p><strong>Descripción:</strong> {notification.description || 'N/A'}</p>
          <p><strong>Hora:</strong> {moment(notification.timestamp).format('HH:mm') || 'N/A'}</p>
          <p><strong>Marcador:</strong> <span className="scoreboard">{notification.scoreboard || 'N/A'}</span></p>
          <p>---------------------------------------------------</p>
        </div>
      </div>
    ));
  };

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
            onChange={(e) => {
              setSelectedMatchId(e.target.value);
              const match = liveMatches.find(m => m.id === Number(e.target.value));
              setMatchTitle(match ? `${match.home_team} vs ${match.away_team}` : '');
            }}
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
      {/* Render floating notifications */}
      <div className="floating-notifications">
        {renderNotifications()}
      </div>
    </div>
  );
};

export default CreateNotificationButton;