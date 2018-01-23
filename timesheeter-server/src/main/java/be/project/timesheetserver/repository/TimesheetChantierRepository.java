package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Chantier;
import be.project.timesheetserver.model.Timesheet;
import be.project.timesheetserver.model.TimesheetChantier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by kevgo on 23-01-18.
 */
public interface TimesheetChantierRepository extends JpaRepository<TimesheetChantier, Integer> {
    TimesheetChantier findByChantierAndTimesheet(Chantier chantier, Timesheet timesheet);
    List<TimesheetChantier> findByTimesheet(Timesheet timesheet);
}
