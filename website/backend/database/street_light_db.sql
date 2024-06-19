CREATE DATABASE street_light_db;
USE street_light_db;

CREATE TABLE lights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    control_type VARCHAR(50) NOT NULL DEFAULT 'Auto'
);