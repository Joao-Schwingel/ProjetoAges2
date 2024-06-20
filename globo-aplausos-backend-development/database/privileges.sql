-- User ('globo') should comply with .env file
CREATE USER 'globo'@'%' IDENTIFIED BY 'PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'globo'@'%' WITH GRANT OPTION;
GRANT CREATE ON *.* TO 'globo'@'%';
FLUSH PRIVILEGES;