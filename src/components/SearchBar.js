import React, { useState } from 'react';
import '../styles.css'; // Import the CSS file

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar partido por nombre"
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};

export default SearchBar;