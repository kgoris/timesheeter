package be.project.timesheetserver.service.impl;

import be.project.timesheetserver.model.*;
import be.project.timesheetserver.repository.ChantierRepository;
import be.project.timesheetserver.repository.ClientRepository;
import be.project.timesheetserver.repository.TimesheetChantierRepository;
import be.project.timesheetserver.repository.TimesheetRepository;
import be.project.timesheetserver.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigInteger;
import java.sql.Time;
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
    private final TimesheetChantierRepository timesheetChantierRepository;

    private void computeTotalHeure(Timesheet timesheet){
        Double heureDebut = ((Long)timesheet.getHeureDebut().getTime()).doubleValue();
        Double heureFin = ((Long)timesheet.getHeureFin().getTime()).doubleValue();
        Double heurePauseDebut = ((Long)timesheet.getHeurePauseDebut().getTime()).doubleValue();
        Double heurePauseFin = ((Long)timesheet.getHeurePauseFin().getTime()).doubleValue();
        Double diffHeures =  (heureFin - heureDebut) / (1000 * 60 *60) ;
        Double diffHeuresPause = (heurePauseFin - heurePauseDebut) / (1000 * 60 *60);
        timesheet.setTotalHeures(diffHeures - diffHeuresPause);
    }

    private void mapAndSaveTimesheet(TimesheetDTO timesheetDTO, User currentUser) throws ParseException {
        Timesheet timesheet = mapTimesheetDTOToTimesheet(timesheetDTO);
        timesheet.setUser(currentUser);
        computeTotalHeure(timesheet);
        timesheetRepository.save(timesheet);
        List<TimesheetChantier> allTimesheetChantiers = this.buildTimesheetChantierWithChantierListAndTimesheet(timesheet, timesheetDTO.getChantiers());
        timesheet.setTimesheetChantiers(allTimesheetChantiers);
        timesheetRepository.save(timesheet);
    }

    @Override
    public void manageRecordedTimesheets(Timesheets recordedTimesheets) throws ParseException {
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        for(TimesheetDTO timesheetDTO : recordedTimesheets.getTimesheetList()){
            mapAndSaveTimesheet(timesheetDTO, currentUser);
        }
    }

    @Override
    public void updateTimesheet(TimesheetDTO timesheetDTO) throws ParseException {
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        mapAndSaveTimesheet(timesheetDTO, currentUser);
    }

    public List<TimesheetChantier> buildTimesheetChantierWithChantierListAndTimesheet(Timesheet timesheet, List<Chantier> chantiers){
        List<TimesheetChantier> allTimesheetChantier = new ArrayList<>();
        for(Chantier chantier: chantiers){
            TimesheetChantier timesheetChantier = timesheetChantierRepository.findByChantierAndTimesheet(chantier, timesheet);
            if(timesheetChantier == null){
                timesheetChantier = TimesheetChantier.builder().timesheet(timesheet).chantier(chantier).build();
            }
            allTimesheetChantier.add(timesheetChantier);
        }
        return allTimesheetChantier;
    }

    @Override
    public Timesheet mapTimesheetDTOToTimesheet(TimesheetDTO timesheetDTO) throws ParseException {
        SimpleDateFormat formatDateTimesheet = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat formatHeures = new SimpleDateFormat("kk:mm");
        Date dateTimesheet = formatDateTimesheet.parse(timesheetDTO.getDateStr());
        Date heureDebut = formatHeures.parse(timesheetDTO.getHeureDebutStr());
        Date heureFin = formatHeures.parse(timesheetDTO.getHeureFinStr());
        Date heureDebutPause = formatHeures.parse(timesheetDTO.getHeureDebutPauseStr());
        Date heureFinPause = formatHeures.parse(timesheetDTO.getHeureFinPauseStr());
        Client client = clientRepository.findByNom(timesheetDTO.getNomClient());
        Chantier chantier = chantierRepository.findByNom(timesheetDTO.getNomChantier());


        Timesheet resTimesheet = Timesheet.builder()
                .client(client)
                .date(dateTimesheet)
                .heureDebut(heureDebut)
                .heureFin(heureFin)
                .heurePauseDebut(heureDebutPause)
                .heurePauseFin(heureFinPause)
                .observations(timesheetDTO.getObservations())
                .id(timesheetDTO.getId())
                .build();

        return resTimesheet;
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
                id(timesheet.getId()).
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

    private String mapTimeToString(Time time){
        String[] timesplitted = time.toString().split(":");
        return timesplitted[0] + ":" + timesplitted[1];
    }

    private List<Chantier> findChantiersByTimesheetId(Integer timesheetId){
        Timesheet timesheet = timesheetRepository.findById(timesheetId);
        List<TimesheetChantier> allTimesheetChantier =  timesheetChantierRepository.findByTimesheet(timesheet);
        List<Chantier> allChantiers = new ArrayList<>();
        for(TimesheetChantier tc: allTimesheetChantier){
            allChantiers.add(tc.getChantier());
        }
        return allChantiers;
    }

    private TimesheetDTO mapQueryObjectToTimesheetDTO(Object record, boolean fetchChantiers){
        TimesheetDTO timesheetDTO = null;
        Object[] recordArray = (Object[]) record;
        SimpleDateFormat formatDateTimesheet = new SimpleDateFormat("dd/MM/yyyy");
        String timesheetDate = formatDateTimesheet.format(recordArray[0]);
        String weekBeginDate = formatDateTimesheet.format(recordArray[4]);
        String weekEndDate = formatDateTimesheet.format(recordArray[5]);
        String heureDebut = mapTimeToString((Time)recordArray[6]);
        String heureFin = mapTimeToString((Time)recordArray[7]);
        String heureDebutPause = mapTimeToString((Time)recordArray[8]);
        String heureFinPause = mapTimeToString((Time)recordArray[9]);
        String nomsChantiers = "";
        List<Chantier> chantiers = new ArrayList<>();
        if(fetchChantiers){
            chantiers = findChantiersByTimesheetId((Integer)recordArray[14]);

            for(Chantier chantier: chantiers){
                String separator = "-";
                if(StringUtils.isEmpty(nomsChantiers)){
                    separator = "";
                }

                nomsChantiers = nomsChantiers + separator + chantier.getNom();

            }
        }

        if(recordArray[1] instanceof Integer) {
            timesheetDTO = TimesheetDTO.builder()
                    .dateStr(timesheetDate)
                    .mois(((Integer) recordArray[1]).toString())
                    .annee(((Integer) recordArray[2]).toString())
                    .numeroSemaine(((Integer) recordArray[3]).toString())
                    .debutSemaine(weekBeginDate)
                    .finSemaine(weekEndDate)
                    .heureDebutStr(heureDebut)
                    .heureFinStr(heureFin)
                    .heureDebutPauseStr(heureDebutPause)
                    .heureFinPauseStr(heureFinPause)
                    .totalHeures(((Double) recordArray[10]).toString())
                    .nomClient((String) recordArray[11])
                    .nomChantier(nomsChantiers)
                    .nomUtilisateur((String) recordArray[12] + " " + (String) recordArray[13])
                    .id((Integer)recordArray[14])
                    .build();
        }else{
            timesheetDTO = TimesheetDTO.builder()
                    .dateStr(timesheetDate)
                    .mois(((BigInteger) recordArray[1]).toString())
                    .annee(((BigInteger) recordArray[2]).toString())
                    .numeroSemaine(((BigInteger) recordArray[3]).toString())
                    .debutSemaine(weekBeginDate)
                    .finSemaine(weekEndDate)
                    .heureDebutStr(heureDebut)
                    .heureFinStr(heureFin)
                    .heureDebutPauseStr(heureDebutPause)
                    .heureFinPauseStr(heureFinPause)
                    .totalHeures(((Double) recordArray[10]).toString())
                    .nomClient((String) recordArray[11])
                    .nomChantier(nomsChantiers)
                    .nomUtilisateur((String) recordArray[12] + " " + (String) recordArray[13])
                    .id((Integer)recordArray[14])
                    .build();
        }

        if(fetchChantiers){
            timesheetDTO.setChantiers(chantiers);
        }
        return timesheetDTO;
    }

    @Override
    public List<TimesheetDTO> findTimesheetsByUserId(Integer userId) {
        Object res = timesheetRepository.findByUser(userId);
        List<Object> records = (ArrayList<Object>) res;
        return records.stream().map(x -> mapQueryObjectToTimesheetDTO(x, true)).collect(Collectors.toList());
    }

    @Override
    public List<TimesheetDTO> findTimesheetsByClient(String nomClient) {
        Object res = timesheetRepository.findByClient(nomClient);
        List<Object> records = (ArrayList<Object>) res;
        return records.stream().map(x -> mapQueryObjectToTimesheetDTO(x, true)).collect(Collectors.toList());
    }

    @Override
    public List<TimesheetDTO> findTimesheetsByChantier(String nomChantier) {
        Object res = timesheetRepository.findByChantier(nomChantier);
        List<Object> records = (ArrayList<Object>) res;
        return records.stream().map(x -> mapQueryObjectToTimesheetDTO(x, true)).collect(Collectors.toList());
    }

    @Override
    public void createOrUpdateClient(Client client) {
        clientRepository.save(client);
    }

    public void createOrUpdateChantier(Chantier chantier){
        chantierRepository.save(chantier);
    }
}
