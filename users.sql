DROP DATABASE IF EXISTS users;
CREATE DATABASE users;

\c users;

CREATE TABLE user(
    ID SERIAL PRIMARY KEY,
    name VARCHAR,
    surname VARCHAR,
    phone INT,
    email VARCHAR,
    dob DATE,
    job VARCHAR,
    possessions VARCHAR,
    primaryHouseLoc VARCHAR,
    maritalStatus VARCHAR
);

INSERT INTO user (name,surname,phone,job)
    VALUES ('Panos','Panagiotidis','94218521','cook');
    