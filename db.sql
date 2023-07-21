CREATE TABLE IF NOT EXISTS allowedAddress (
    channel_id INT NOT NULL,
    allowed_address CHAR(42) NOT NULL,
    PRIMARY KEY (channel_id, allowed_address)
);
    -- FOREIGN KEY (channel_id) REFERENCES channel(id),


CREATE TABLE IF NOT EXISTS channel (
    id INT PRIMARY KEY,
    name  VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL,
    query  VARCHAR(2500) NOT NULL
);


CREATE TABLE IF NOT EXISTS threads (
    channel_id INT NOT NULL,
    topic VARCHAR(100) PRIMARY KEY NOT NULL
); 

    -- FOREIGN KEY (channel_id) REFERENCES channel(id)

    CREATE TABLE IF NOT EXISTS users (
        address CHAR(42) PRIMARY KEY NOT NULL,
        username VARCHAR(50), 
        profile_pic_url VARCHAR(2083)
    );

0xD408c5DdcBf297dcAa745009277007429719E205