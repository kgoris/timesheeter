INSERT INTO timesheetchantier (chantierid, timesheetid)  SELECT t.chantierid, t.id from timesheet t;