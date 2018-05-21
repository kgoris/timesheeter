package be.project.timesheetserver.rest;

import be.project.timesheetserver.model.*;
import be.project.timesheetserver.repository.ChantierRepository;
import be.project.timesheetserver.repository.ClientRepository;
import be.project.timesheetserver.repository.UserRepository;
import be.project.timesheetserver.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping( value = "/api", produces = MediaType.APPLICATION_JSON_VALUE )
@RequiredArgsConstructor
public class BusinessController {
    private final ClientRepository clientRepository;

    private final ChantierRepository chantierRepository;

    private final UserRepository userRepository;

    private final BusinessService businessService;

    @RequestMapping("/client/all")
    @PreAuthorize("hasRole('USER')")
    public List<Client> allClients(){
        return clientRepository.findAll();
    }

    @RequestMapping("/client/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Client clientById(@PathVariable(name="id") Integer id){
        return clientRepository.findById(id);
    }


    @RequestMapping("/chantier/all")
    @PreAuthorize("hasRole('USER')")
    public List<Chantier> allChantier(){
        return chantierRepository.findAll();
    }

    @RequestMapping("/chantier/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Chantier chantierById(@PathVariable(name="id") Integer id){
        return chantierRepository.findById(id);
    }

    @PostMapping("/recordedtimesheets")
    @PreAuthorize("hasRole('USER')")
    public void postRecordedTimesheet(@RequestBody Timesheets recordedTimesheets) throws ParseException {
        businessService.manageRecordedTimesheets(recordedTimesheets);
    }

    @PostMapping("/timesheet")
    @PreAuthorize("hasRole('ADMIN')")
    public void postTimesheet(@RequestBody TimesheetDTO timesheetDTO) throws ParseException {
        businessService.updateTimesheet(timesheetDTO);
    }

    @RequestMapping("timesheet/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TimesheetDTO> allTimesheet(){
        return businessService.findAllTimesheetDTO();
    }

    @DeleteMapping("timesheet/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTimesheet(@PathVariable(name="id") Integer id){
        businessService.deleteTimesheet(id);
    }

    @RequestMapping("timesheet/user/{usedId}")
    @PreAuthorize("hasRole('USER')")
    public List<TimesheetDTO> timesheetByUser(@PathVariable(name="usedId") Integer userId){
        return businessService.findTimesheetsByUserId(userId);
    }

    @RequestMapping("timesheet/client/{nomClient}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TimesheetDTO> timesheetByClient(@PathVariable(name="nomClient") String nomClient){
        return businessService.findTimesheetsByClient(nomClient);
    }

    @RequestMapping("timesheet/chantier/{nomChantier}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TimesheetDTO> timesheetByChantier(@PathVariable(name="nomChantier") String nomChantier){
        return businessService.findTimesheetsByChantier(nomChantier);
    }

    @RequestMapping("timesheet/{id}/facture/{facture}")
    public void updateFactureOnTimesheet(@PathVariable(name="id") Integer id, @PathVariable(name="facture") boolean facture){
        businessService.updateFactureOnTimesheet(id, facture);
    }

    @PostMapping("/client/new")
    public void newClient(@RequestBody Client client){
        this.businessService.createOrUpdateClient(client);
    }

    @PostMapping("/client/update")
    public void updateClient(@RequestBody Client client){
        this.businessService.createOrUpdateClient(client);
    }

    @PostMapping("/chantier/new")
    public void newChantier(@RequestBody Chantier chantier){
        this.businessService.createOrUpdateChantier(chantier);
    }

    @PostMapping("/chantier/update")
    public void updateChantier(@RequestBody Chantier chantier){
        this.businessService.createOrUpdateChantier(chantier);
    }
}
