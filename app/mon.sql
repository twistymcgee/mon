DROP DATABASE IF EXISTS mon;
CREATE DATABASE mon;

\c mon;

CREATE TABLE monitors (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  url VARCHAR,
  find_string VARCHAR,
  timeout INTEGER,
  down boolean default false
);
