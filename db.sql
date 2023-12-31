-- CREATE TABLE IF NOT EXISTS allowed_address (
--     channel_id INT NOT NULL,
--     address CHAR(42) NOT NULL,
--     PRIMARY KEY (channel_id, address)
-- );
--     -- FOREIGN KEY (channel_id) REFERENCES channel(id),

INSERT INTO allowed_address (channel_id, address) VALUES (1, '0x0abca868929aA10C67246135BD8940a1596663ed');

-- CREATE TABLE IF NOT EXISTS channel (
--     id INT PRIMARY KEY,
--     name  VARCHAR(20) NOT NULL,
--     category VARCHAR(20) NOT NULL,
--     query  VARCHAR(2500) NOT NULL,
--     query_description VARCHAR(2500) NOT NULL
-- );

INSERT INTO channel (id, name, category, query, query_description) VALUES (1, 'curve_fi', 'OG', '{query : airstack}', 'this is the description' );

-- CREATE TABLE IF NOT EXISTS posts (
--     channel_id INT NOT NULL,
--     topic_id VARCHAR(100) PRIMARY KEY NOT NULL,
--     author_address CHAR(42) NOT NULL,
-- );

INSERT INTO posts (channel_id, topic_id, author_address) VALUES (1, '0x2335Topic', '0x0abca868929aA10C67246135BD8940a1596663ed');
INSERT INTO posts (channel_id, topic_id, author_address) VALUES (2, 'another545345vTopic', '0x0abca868929aA10C67246135BD8940a1596663ed');


    -- FOREIGN KEY (channel_id) REFERENCES channel(id)

-- CREATE TABLE IF NOT EXISTS users (
--     address CHAR(42) PRIMARY KEY NOT NULL,
--     username VARCHAR(50), 
--     profile_pic_url VARCHAR(2083)
-- );
