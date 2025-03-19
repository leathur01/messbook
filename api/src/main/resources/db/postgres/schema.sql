CREATE EXTENSION if not exists "uuid-ossp";

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user"(
 	id uuid primary key default uuid_generate_v4(),
 	nickname varchar(50) UNIQUE NOT NULL,
 	email varchar(70) UNIQUE NOT NULL,
 	phone_number varchar(20) UNIQUE,
 	password varchar(100) NOT NULL,
 	bio varchar(150),
 	date_of_birth DATE NOT NULL,
 	-- A uuid is 36 characters long plus ".{{file extension}}", so upper bound of 45 can cover all avatar's values
 	avatar_file_path varchar(45),
 	banner_file_path varchar(45),
 	activated bool NOT NULL,
 	created_at timestamp(0) NOT NULL DEFAULT NOW(),
 	updated_at timestamp(0) NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS token;
CREATE TABLE token (
	hash bytea PRIMARY KEY,
	user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE,
	expiry timestamp(0) NOT NULL,
	scope text NOT NULL
);

DROP TABLE IF EXISTS revoked_token;
CREATE TABLE revoked_token (
	hex_jwt varchar(255) PRIMARY KEY,
	revoked_at timestamp(0) NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS user_relationship;
CREATE TABLE user_relationship (
	sender_id uuid,
	receiver_id uuid,
	status varchar(20),
	created_at timestamp(0) NOT NULL DEFAULT NOW(),
	updated_at timestamp(0) NOT NULL DEFAULT NOW(),
	PRIMARY KEY (sender_id, receiver_id),
    FOREIGN KEY (sender_id) REFERENCES "user"(id),
    FOREIGN KEY (receiver_id) REFERENCES "user"(id)
);

DROP TABLE IF EXISTS device;
CREATE TABLE device (
	id uuid default uuid_generate_v4(),
	device_token varchar,
	user_id uuid,
	token_issued_at timestamp(0) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES "user" ON DELETE CASCADE
);

-- Delete dependencies using cascade keywords
DROP TABLE IF EXISTS CHAT CASCADE;
CREATE TABLE CHAT (
	ID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	SENDER_NICKNAME VARCHAR(50) NOT NULL,
	RECEIVER_NICKNAME VARCHAR(50) NOT NULL,
	UNIQUE(SENDER_NICKNAME, RECEIVER_NICKNAME)
);

DROP TABLE IF EXISTS  MESSAGE;
CREATE TABLE MESSAGE (
	ID SERIAL PRIMARY KEY,
	CHAT_ID UUID,
	SENDER_NICKNAME VARCHAR(50) NOT NULL,
	RECEIVER_NICKNAME VARCHAR(50) NOT NULL,
	CONTENT TEXT NOT NULL,
	CREATED_AT TIMESTAMP(0) NOT NULL DEFAULT NOW(),
	FOREIGN KEY (CHAT_ID) REFERENCES chat ON DELETE CASCADE
);
