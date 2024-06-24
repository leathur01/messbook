-- USER TABLE
INSERT INTO "user" (id, nickname, email, password, activated, bio, date_of_birth, avatar_file_path, banner_file_path, phone_number)
VALUES ('d8878e64-3ff7-4266-bfb2-0c3537332e93', 'john_doe', 'john@example.com', 'abc123', true, 'Software Engineer', '1990-01-01','john_avatar.jpg', 'john_banner.jpg', '9876543210');

INSERT INTO "user" (id, nickname, email, password, activated, bio, date_of_birth, avatar_file_path, banner_file_path, phone_number)
VALUES ('da2c8f06-c6a5-4fe9-8917-3dbd3f93dff5', 'alice_smith', 'alice@example.com', 'def456', true, 'Product Manager', '1990-01-01','alice_avatar.jpg', 'alice_banner.jpg', '8765432109');

INSERT INTO "user" (id, nickname, email, password, activated, bio, date_of_birth, avatar_file_path, banner_file_path, phone_number)
VALUES ('05e90430-d0c1-4fc4-8f31-d39fc518973a', 'jane_doe', 'jane@example.com', 'ghi789', true, 'Graphic Designer', '1990-12-15','jane_avatar.jpg', 'jane_banner.jpg', '7654321098');

INSERT INTO "user" (id, nickname, email, password, activated, bio, date_of_birth, avatar_file_path, banner_file_path, phone_number)
VALUES ('beec7d25-5bdc-4870-9dd2-8318d3b9e296', 'sam_jones', 'sam@example.com', 'jkl012', true, 'Marketing Manager', '2003-06-01','sam_avatar.jpg', 'sam_banner.jpg', '6543210987');

INSERT INTO "user" (id, nickname, email, password, activated, bio, date_of_birth, avatar_file_path, banner_file_path, phone_number)
VALUES ('ce0d18c2-9f6f-4bf0-ab76-4feb5659b836', 'sam_smith', 'smith@example.com', 'jkl012', true, 'Marketing Manager', '2003-12-19','sam_avatar.jpg', 'sam_banner.jpg', '6543210981');

INSERT INTO "user" (id, nickname, email, password, activated, bio, date_of_birth, avatar_file_path, banner_file_path, phone_number)
VALUES ('744dfb8f-197c-4969-96ee-2f48ee66e765', 'nhaque', 'nhaque@gmail.com', '$2a$12$O4mvwrK1hI0wNFUydUgdx.vhgtqlX3aHLE/C7t8mOCtXdd192md6u', true, 'Data Analyst', '2006-05-05','sara_avatar.jpg', 'sara_banner.jpg', '5432109876');

-- FRIEND TABLE
insert into user_relationship (sender_id, receiver_id, status)
values ('d8878e64-3ff7-4266-bfb2-0c3537332e93', 'da2c8f06-c6a5-4fe9-8917-3dbd3f93dff5', 'PENDING');

insert into user_relationship (sender_id, receiver_id, status)
values ('05e90430-d0c1-4fc4-8f31-d39fc518973a', 'beec7d25-5bdc-4870-9dd2-8318d3b9e296', 'FRIEND');


