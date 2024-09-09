CREATE DATABASE taskhero; 
USE taskhero;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    CREATED TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, contents) VALUES 
('Task 1', 'This is the first task'),
('Task 2', 'This is the second task'),
('Task 3', 'This is the third task');
