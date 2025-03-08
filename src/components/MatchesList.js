import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css'; // Import the CSS file

const MatchesList = ({ onSelectMatch }) => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/Game/')
      .then(response => {
        const matches = response.data;
        const live = matches.filter(match => match.status === 'live');
        const upcoming = matches.filter(match => match.status === 'waiting');
        setLiveMatches(live);
        setUpcomingMatches(upcoming);
      })
      .catch(error => console.error('Error fetching matches:', error));
  }, []);

  const handleSelectMatch = (match) => {
    setSelectedMatchId(match.id);
    onSelectMatch(match);
  };

  return (
    <div className="container">
      <h1>Partidos en Vivo</h1>
      <ul>
        {liveMatches.map(match => (
          <li
            key={match.id}
            onClick={() => handleSelectMatch(match)}
            className={selectedMatchId === match.id ? 'selected' : ''}
          >
            <span>{match.home_team} vs {match.away_team} - {new Date(match.date_time).toLocaleString()}</span>
            <span className="status-live">LIVE</span>
          </li>
        ))}
      </ul>

      <h1>Partidos Próximos</h1>
      <ul>
        {upcomingMatches.map(match => (
          <li
            key={match.id}
            onClick={() => handleSelectMatch(match)}
            className={selectedMatchId === match.id ? 'selected' : ''}
          >
            <span>{match.home_team} vs {match.away_team} - {new Date(match.date_time).toLocaleString()}</span>
            <span className="status-waiting">WAITING</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesList;