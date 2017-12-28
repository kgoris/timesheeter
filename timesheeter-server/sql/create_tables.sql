INSERT INTO client (nom, rue, codepostal, ville, pays, tva) VALUES ('Dupont Jean', 'rue du fer 5', '5590', 'Ciney', 'Belgique', '0325635986');
INSERT INTO client (nom, rue, codepostal, ville, pays, tva) VALUES ('Jacque Mercier', 'rue du soleil 10', '5590', 'Ciney', 'Belgique', '0385635986');
INSERT INTO client (nom, rue, codepostal, ville, pays, tva) VALUES ('Dupont Marc', 'rue du levain 10', '5590', 'Ciney', 'Belgique', '0388635986');
INSERT INTO client (nom, rue, codepostal, ville, pays, tva) VALUES ('Delamarche christine', 'rue du pain 10', '5590', 'Ciney', 'Belgique', '0388655986');
INSERT INTO client (nom, rue, codepostal, ville, pays, tva) VALUES ('VanGenegem Marc', 'rue du saumon 10', '5590', 'Ciney', 'Belgique', '0388635966');
INSERT INTO client (nom, rue, codepostal, ville, pays, tva) VALUES ('Monfils Thomas', 'rue du paintre 10', '5590', 'Ciney', 'Belgique', '0388635977');
INSERT INTO chantier (nom) VALUEs ('chant01');
INSERT INTO chantier (nom) VALUEs ('chant02');
INSERT INTO chantier (nom) VALUEs ('chant03');
INSERT INTO chantier (nom) VALUEs ('chant04');


select week(date), SUBDATE(date, WEEKDAY(date)), ADDDATE(date, 6 - WEEKDAY(date)), date FROM timesheet;