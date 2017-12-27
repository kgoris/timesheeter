package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimesheetRepository extends JpaRepository<Timesheet, Integer> {
}
