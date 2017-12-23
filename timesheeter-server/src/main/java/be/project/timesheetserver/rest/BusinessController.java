package be.project.timesheetserver.rest;

import be.project.timesheetserver.model.Chantier;
import be.project.timesheetserver.model.Client;
import be.project.timesheetserver.repository.ChantierRepository;
import be.project.timesheetserver.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping( value = "/api", produces = MediaType.APPLICATION_JSON_VALUE )
@RequiredArgsConstructor
public class BusinessController {
    private final ClientRepository clientRepository;

    private final ChantierRepository chantierRepository;

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
}
