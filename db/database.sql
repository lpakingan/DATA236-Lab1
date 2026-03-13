
-- SQL file for creating database for example data 

CREATE DATABASE IF NOT EXISTS tastlytics_db;
USE tastlytics_db;

DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS reviewers;

-- reviewers table 
CREATE TABLE reviewers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL,
  password      VARCHAR(100) NOT NULL,
  phone         VARCHAR(20) NULL,
  about_me      VARCHAR(255) NULL,
  gender        VARCHAR(100) NULL,
  profile_picture VARCHAR(100) NULL,
  city    VARCHAR(100) NULL,
  state   ENUM(
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
    'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
    'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
    'WI','WY','DC'
  ) NULL,
  country ENUM('US','Canada','Mexico') NULL,
  languages JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_reviewer_email UNIQUE (email)
);

-- owners table
CREATE TABLE owners (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  password   VARCHAR(100) NOT NULL,
  restaurant_location VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_owner_email UNIQUE (email)
); 

-- preferences table
CREATE TABLE preferences (
  reviewer_id          INT PRIMARY KEY,
  cuisines             JSON NULL,
  price_range          ENUM('$','$$','$$$','$$$$') NOT NULL DEFAULT '$',
  preferred_locations  JSON NULL,
  search_radius        INT NULL DEFAULT 10,
  dietary_needs        JSON NULL,
  ambiance             JSON NULL,
  sort_preference      ENUM('rating','distance','price','popularity') NOT NULL DEFAULT 'price',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_preferences_reviewer
    FOREIGN KEY (reviewer_id) REFERENCES reviewers(id)
    ON DELETE CASCADE
);

-- restaurants table
CREATE TABLE restaurants (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  cuisine     VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  address     VARCHAR(100) NOT NULL,
  city        VARCHAR(100) NULL,
  state   ENUM(
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
    'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
    'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
    'WI','WY','DC'
  ) NULL,
  country ENUM('US','Canada','Mexico') NULL,
  contact_info VARCHAR(100) NULL,
  hours        VARCHAR(100) NULL,
  photos       JSON NULL,
  pricing      ENUM('$','$$','$$$','$$$$') NOT NULL DEFAULT '$',
  keywords     JSON NULL,
  claim_status ENUM('unclaimed','claimed') NOT NULL DEFAULT 'unclaimed',
  claimed_by_owner_id     INT NULL,
  created_by_reviewer_id  INT NULL,
  created_by_owner_id     INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rest_claimed_by_owner
    FOREIGN KEY (claimed_by_owner_id) REFERENCES owners(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_rest_created_by_reviewer
    FOREIGN KEY (created_by_reviewer_id) REFERENCES reviewers(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_rest_created_by_owner
    FOREIGN KEY (created_by_owner_id) REFERENCES owners(id)
    ON DELETE SET NULL
); 

-- reviews table
CREATE TABLE reviews (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  rating  ENUM('1','2','3','4','5') NOT NULL,
  comment VARCHAR(500) NULL,
  photos  JSON NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  reviewer_id   INT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_reviews_reviewer
    FOREIGN KEY (reviewer_id) REFERENCES reviewers(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_review_reviewer_restaurant UNIQUE (restaurant_id, reviewer_id)
); 

-- favorites table
CREATE TABLE favorites (
  reviewer_id   INT NOT NULL,
  restaurant_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reviewer_id, restaurant_id),
  CONSTRAINT fk_fav_reviewer
    FOREIGN KEY (reviewer_id) REFERENCES reviewers(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_fav_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    ON DELETE CASCADE
); 

-- sessions table
CREATE TABLE sessions (
  id    VARCHAR(64) PRIMARY KEY,
  role  ENUM('reviewer','owner') NOT NULL,
  reviewer_id INT NULL,
  owner_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_sessions_reviewer
    FOREIGN KEY (reviewer_id) REFERENCES reviewers(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_sessions_owner
    FOREIGN KEY (owner_id) REFERENCES owners(id)
    ON DELETE CASCADE
); 

-- insert fake data (generated by ChatGPT)
SET SQL_SAFE_UPDATES = 0;

DELETE FROM sessions;
DELETE FROM favorites;
DELETE FROM reviews;
DELETE FROM restaurants;
DELETE FROM preferences;
DELETE FROM owners;
DELETE FROM reviewers;

SET SQL_SAFE_UPDATES = 1;

ALTER TABLE reviewers AUTO_INCREMENT = 1;
ALTER TABLE owners AUTO_INCREMENT = 1;
ALTER TABLE restaurants AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;

-- reviewers example data
INSERT INTO reviewers
(first_name, last_name, email, password, phone, about_me, gender, profile_picture, city, state, country, languages)
VALUES
-- password for Alice: password1
('Alice', 'Ng',  'alice@test.com', '$2b$12$ii3h2LgQw.hA7HFFF.WUMedz3YKaNQKCtfpm.Y1E9NIlX0Q68bOAq', '4085551111', 'Love tacos and brunch.', 'female', NULL, 'San Jose', 'CA', 'US', JSON_ARRAY('English')),
-- password for Bob: password2
('Bob',   'Kim', 'bob@test.com',   '$2b$12$ZZWy3ZiMwxkwcI4.Ob4.vuEaFPyzpjTijqXD5KRK5LXIE.UxhG/FG', '4155552222', 'Sushi enthusiast.',     'male',   NULL, 'San Francisco', 'CA', 'US', JSON_ARRAY('English','Korean')),
-- password for Cara: password3
('Cara',  'Lo',  'cara@test.com',  '$2b$12$CI5GTVy3kIECzdouIvUhwup.QOFBmtu/zVdS3mWz5tlC5FSvwISF.', NULL,         'Coffee + pastries.',    NULL,     NULL, 'Oakland', 'CA', 'US', JSON_ARRAY('English','Spanish'));

-- preferences example data
INSERT INTO preferences
(reviewer_id, cuisines, price_range, preferred_locations, search_radius, dietary_needs, ambiance, sort_preference)
VALUES
(1, JSON_ARRAY('Mexican','American'), '$$', JSON_ARRAY('San Jose','Santa Clara'), 10, JSON_ARRAY('none'), JSON_ARRAY('casual'), 'distance'),
(2, JSON_ARRAY('Japanese','Korean'), '$$$', JSON_ARRAY('San Francisco'), 8, JSON_ARRAY('pescatarian'), JSON_ARRAY('date night'), 'rating'),
(3, JSON_ARRAY('Cafe','Bakery'), '$', JSON_ARRAY('Oakland'), 5, JSON_ARRAY('vegetarian'), JSON_ARRAY('quiet'), 'price');

-- owners example data
INSERT INTO owners
(first_name, last_name, email, password, restaurant_location)
VALUES
-- password for Owen: password4
('Owen', 'Lee',  'owner1@test.com', '$2b$12$4mkKHcKxlc2bUtLtKt0TBe3lxbnvVuIEMUtPV7vfujkjslV7zhI0e', 'San Jose'),
-- password for Mina: password5
('Mina', 'Park', 'owner2@test.com', '$2b$12$gVHohlgHYXVRupcwERrzZOUYQ6LTCe.Bmo0zsF/nukzmTRiRGa.TO', 'San Francisco');

-- restaurants example data
INSERT INTO restaurants
(name, cuisine, description, address, city, state, country, contact_info, hours, photos, pricing, keywords,
 claim_status, claimed_by_owner_id, created_by_reviewer_id, created_by_owner_id)
VALUES
('Taco Town', 'Mexican', 'Street-style tacos and aguas frescas.', '123 Main St', 'San Jose', 'CA', 'US',
 '408-555-9000', '11am-9pm', JSON_ARRAY('https://pics.example/taco1.jpg'), '$', JSON_ARRAY('tacos','outdoor seating','wifi'),
 'unclaimed', NULL, 1, NULL),

('Sushi Star', 'Japanese', 'Omakase and nigiri specials.', '9 Market St', 'San Francisco', 'CA', 'US',
 '415-555-9001', '5pm-10pm', JSON_ARRAY('https://pics.example/sushi1.jpg'), '$$$', JSON_ARRAY('sushi','date night'),
 'claimed', 2, NULL, 2),

('Curry Corner', 'Indian', 'Comfort curry and naan.', '55 Santa Clara St', 'San Jose', 'CA', 'US',
 '408-555-9002', '11am-10pm', JSON_ARRAY('https://pics.example/curry1.jpg'), '$$', JSON_ARRAY('curry','family friendly'),
 'claimed', 1, 3, NULL),

('Cafe Bloom', 'Cafe', 'Espresso, matcha, and pastries.', '700 Broadway', 'Oakland', 'CA', 'US',
 '510-555-9003', '7am-4pm', JSON_ARRAY('https://pics.example/cafe1.jpg'), '$', JSON_ARRAY('coffee','pastries','quiet'),
 'unclaimed', NULL, 3, NULL);

-- reviews example data
INSERT INTO reviews
(rating, comment, photos, restaurant_id, reviewer_id)
VALUES
('5', 'Amazing tacos, great salsa bar!', JSON_ARRAY('https://pics.example/rev_taco.jpg'), 1, 1),
('4', 'Fresh fish, a bit pricey but worth it.', NULL, 2, 2),
('5', 'Best curry in town. Super comforting.', NULL, 3, 1),
('4', 'Cozy vibe, latte was solid.', NULL, 4, 3);

-- favorites example data
INSERT INTO favorites (reviewer_id, restaurant_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 4);
