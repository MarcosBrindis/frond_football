base de datos


CREATE TABLE games (
    id SERIAL PRIMARY KEY,           -- Identificador único del partido
    home_team VARCHAR(100) NOT NULL, -- Nombre del equipo local
    away_team VARCHAR(100) NOT NULL, -- Nombre del equipo visitante
    date_time TIMESTAMP NOT NULL,    -- Fecha y hora del partido
    status VARCHAR(20) NOT NULL      -- Estado del partido (En juego, Finalizado, etc.)
);


CREATE TABLE sports_events (
    id SERIAL PRIMARY KEY,           -- Identificador único del evento deportivo
    match_id INT NOT NULL,           -- ID del partido relacionado (clave foránea)
    event_type VARCHAR(50) NOT NULL, -- Tipo de evento (gol, tarjeta_amarilla, etc.)
    description TEXT,                -- Detalles adicionales del evento
    timestamp TIMESTAMP NOT NULL,    -- Momento en que ocurrió el evento
    scoreboard TEXT DEFAULT '' NOT NULL;
    CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES games (id) ON DELETE CASCADE
);
