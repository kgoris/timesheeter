package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Timesheet;
import be.project.timesheetserver.model.TimesheetUser;
import be.project.timesheetserver.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by kevgo on 25-01-18.
 */
public interface TimesheetUserRepository extends JpaRepository<TimesheetUser, Integer> {
    TimesheetUser findByTimesheetAndUser(Timesheet timesheet, User user);
    List<TimesheetUser> findByTimesheet(Timesheet timesheet);
}
