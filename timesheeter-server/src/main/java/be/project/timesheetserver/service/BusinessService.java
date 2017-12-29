package be.project.timesheetserver.service;

import be.project.timesheetserver.model.Timesheet;
import be.project.timesheetserver.model.TimesheetDTO;
import be.project.timesheetserver.model.Timesheets;

import java.text.ParseException;
import java.util.List;

public interface BusinessService {
    void manageRecordedTimesheets(Timesheets recordedTimesheets) throws ParseException;
    Timesheet mapTimesheetDTOToTimesheet(TimesheetDTO timesheetDTO) throws ParseException;
    TimesheetDTO mapTimesheetToTomesheetDTO(Timesheet timesheet);
    List<TimesheetDTO> findAllTimesheetDTO();
    List<TimesheetDTO> findTimesheetsByUserId(Integer userId);
    List<TimesheetDTO> findTimesheetsByClient(String nomClient);
    List<TimesheetDTO> findTimesheetsByChantier(String nomChantier);
}
