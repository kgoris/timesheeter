package be.project.timesheetserver.service.impl;

import be.project.timesheetserver.model.*;
import be.project.timesheetserver.repository.ChantierRepository;
import be.project.timesheetserver.repository.ClientRepository;
import be.project.timesheetserver.repository.TimesheetRepository;
import be.project.timesheetserver.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {

    private final TimesheetRepository timesheetRepository;
    private final ChantierRepository chantierRepository;
    private final ClientRepository clientRepository;

    @Override
    public void manageRecordedTimesheets(Timesheets recordedTimesheets) throws ParseException {
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        for(TimesheetDTO timesheetDTO : recordedTimesheets.getTimesheetList()){
            Timesheet timesheet = mapTimesheetDTOToTimesheet(timesheetDTO);
            timesheet.setUser(currentUser);
            timesheetRepository.save(timesheet);
        }
    }

    @Override
    public Timesheet mapTimesheetDTOToTimesheet(TimesheetDTO timesheetDTO) throws ParseException {
        SimpleDateFormat formatDateTimesheet = new SimpleDateFormat("yyyy-mm-dd");
        SimpleDateFormat formatHeures = new SimpleDateFormat("kk:mm");
        Date dateTimesheet = formatDateTimesheet.parse(timesheetDTO.getDateStr());
        Date heureDebut = formatHeures.parse(timesheetDTO.getHeureDebutStr());
        Date heureFin = formatHeures.parse(timesheetDTO.getHeureFinStr());
        Date heureDebutPause = formatHeures.parse(timesheetDTO.getHeureDebutPauseStr());
        Date heureFinPause = formatHeures.parse(timesheetDTO.getHeureFinPauseStr());
        Client client = clientRepository.findByNom(timesheetDTO.getNomClient());
        Chantier chantier = chantierRepository.findByNom(timesheetDTO.getNomChantier());
        return Timesheet.builder()
                .chantier(chantier)
                .client(client)
                .date(dateTimesheet)
                .heureDebut(heureDebut)
                .heureFin(heureFin)
                .heurePauseDebut(heureDebutPause)
                .heurePauseFin(heureFinPause)
                .build();
    }

    @Override
    public TimesheetDTO mapTimesheetToTomesheetDTO(Timesheet timesheet) {
        SimpleDateFormat formatDateTimesheet = new SimpleDateFormat("dd/mm/yyyy");
        SimpleDateFormat formatHeures = new SimpleDateFormat("kk:mm");
        String dateTimesheet = formatDateTimesheet.format(timesheet.getDate());
        String heureDebut = formatHeures.format(timesheet.getHeureDebut());
        String heureFin = formatHeures.format(timesheet.getHeureFin());
        String heureDebutPause = formatHeures.format(timesheet.getHeurePauseDebut());
        String heureFinPause = formatHeures.format(timesheet.getHeurePauseFin());
        return TimesheetDTO.builder().
                nomClient(timesheet.getClient().getNom())
                .nomChantier(timesheet.getChantier().getNom())
                .nomUtilisateur(timesheet.getUser().getFirstname() + " " + timesheet.getUser().getLastname())
                .dateStr(dateTimesheet)
                .heureDebutStr(heureDebut)
                .heureFinStr(heureFin)
                .heureDebutPauseStr(heureDebutPause)
                .heureFinPauseStr(heureFinPause)
                .build();
    }

    @Override
    public List<TimesheetDTO> findAllTimesheetDTO() {
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        return timesheetList.stream().map(aTimesheet -> mapTimesheetToTomesheetDTO(aTimesheet)).collect(Collectors.toList());
    }
}
