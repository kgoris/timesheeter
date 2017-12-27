package be.project.timesheetserver.rest;

import be.project.timesheetserver.model.*;
import be.project.timesheetserver.repository.ChantierRepository;
import be.project.timesheetserver.repository.ClientRepository;
import be.project.timesheetserver.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping( value = "/api", produces = MediaType.APPLICATION_JSON_VALUE )
@RequiredArgsConstructor
public class BusinessController {
    private final ClientRepository clientRepository;

    private final ChantierRepository chantierRepository;

    private final BusinessService businessService;

    @RequestMapping("/client/all")
    @PreAuthorize("hasRole('USER')")
    public List<Client> allClients(){
        return clientRepository.findAll();
    }

    @RequestMapping("/chantier/all")
    @PreAuthorize("hasRole('USER')")
    public List<Chantier> allChantier(){
        return chantierRepository.findAll();
    }


    @PostMapping("/recordedtimesheets")
    @PreAuthorize("hasRole('USER')")
    public void postRecordedTimesheet(@RequestBody Timesheets recordedTimesheets) throws ParseException {
        businessService.manageRecordedTimesheets(recordedTimesheets);
    }

    @RequestMapping("timesheet/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TimesheetDTO> allTimesheet(){
        return businessService.findAllTimesheetDTO();
    }
}
