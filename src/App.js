import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MatchesList from './components/MatchesList';
import SearchBar from './components/SearchBar';
import UpdateStatusButton from './components/UpdateStatusButton';
import CreateMatchButton from './components/CreateMatchButton';
import CreateNotificationButton from './components/CreateNotificationButton';
import axios from 'axios';
import './styles.css'; 

const App = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [allMatches, setAllMatches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/Game/')
      .then(response => setAllMatches(response.data))
      .catch(error => console.error('Error fetching matches:', error));
  }, []);

  const handleSearch = (query) => {
    const match = allMatches.find(
      m => m.home_team.toLowerCase().includes(query.toLowerCase()) || m.away_team.toLowerCase().includes(query.toLowerCase())
    );
    setSelectedMatch(match || null);
  };

  const handleUpdate = (updatedMatch) => {
    setSelectedMatch(updatedMatch);
    setAllMatches(allMatches.map(match => (match.id === updatedMatch.id ? updatedMatch : match)));
  };

  return (
    <Router>
      <div>
        <h1>Gestión de Partidos</h1>
        <SearchBar onSearch={handleSearch} />
        <MatchesList onSelectMatch={setSelectedMatch} />
        {selectedMatch && (
          <UpdateStatusButton match={selectedMatch} onUpdate={handleUpdate} />
        )}
        <CreateMatchButton />
        <CreateNotificationButton />
      </div>
    </Router>
  );
};

export default App;