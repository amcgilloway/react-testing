DROP TABLE IF EXISTS sightings;

CREATE TABLE sightings (
  id SERIAL PRIMARY KEY,
  species VARCHAR(255),
  location VARCHAR(255),
  date VARCHAR(255)
);

-- Add some birds

INSERT INTO sightings (species, location, date) VALUES ('Yellow Wagtail', 'Sutherland', '2017-06-01');
INSERT INTO sightings (species, location, date) VALUES ('Red Kite', 'Knockshinnoch', '2017-01-22');
INSERT INTO sightings (species, location, date) VALUES ('Little Egret', 'Seamill', '2018-08-15');
