package be.project.timesheetserver.service.impl;

import be.project.timesheetserver.model.*;
import be.project.timesheetserver.repository.*;
import be.project.timesheetserver.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigInteger;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {

    private final TimesheetRepository timesheetRepository;
    private final ChantierRepository chantierRepository;
    private final ClientRepository clientRepository;
    private final TimesheetChantierRepository timesheetChantierRepository;
    private final UserRepository userRepository;
    private final TimesheetUserRepository timesheetUserRepository;

    private void computeTotalHeure(Timesheet timesheet){
        Double heureDebut = ((Long)timesheet.getHeureDebut().getTime()).doubleValue();
        Double heureFin = ((Long)timesheet.getHeureFin().getTime()).doubleValue();
        Double diffHeures =  (heureFin - heureDebut) / (1000 * 60 *60) ;
        Double diffHeuresPause = 0.0;
        if(timesheet.getHeurePauseDebut() != null && timesheet.getHeurePauseFin() != null) {
            Double heurePauseDebut = ((Long) timesheet.getHeurePauseDebut().getTime()).doubleValue();
            Double heurePauseFin = ((Long) timesheet.getHeurePauseFin().getTime()).doubleValue();
            diffHeuresPause = (heurePauseFin - heurePauseDebut) / (1000 * 60 * 60);
        }
        timesheet.setTotalHeures(diffHeures - diffHeuresPause);
    }

    private void mapAndSaveTimesheet(TimesheetDTO timesheetDTO, User currentUser) throws ParseException {
        Timesheet fetchedTimesheet = null;
        if(timesheetDTO.getId() != null){
            fetchedTimesheet = timesheetRepository.findById(timesheetDTO.getId());
        }

        Timesheet timesheet = mapTimesheetDTOToTimesheet(timesheetDTO);
        timesheet.setUser(currentUser);
        computeTotalHeure(timesheet);
        timesheetRepository.save(timesheet);
        List<TimesheetChantier> allTimesheetChantiers = this.buildTimesheetChantierWithChantierListAndTimesheet(timesheet, timesheetDTO.getChantiers(), fetchedTimesheet);
        List<TimesheetUser> allTimesheetUsers = this.buildTimesheetUserWithUsersListAndTimesheet(timesheet, timesheetDTO.getOuvriersPresents(), fetchedTimesheet);
        timesheet.setTimesheetChantiers(allTimesheetChantiers);
        timesheet.setTimesheetUsers(allTimesheetUsers);
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
        User user = userRepository.findById(timesheetDTO.getIdUser());
        mapAndSaveTimesheet(timesheetDTO, user);
    }

    public List<TimesheetUser> buildTimesheetUserWithUsersListAndTimesheet(Timesheet timesheet, List<User> users, Timesheet fetchedTimesheet){
        List<TimesheetUser> allTimesheetUser = new ArrayList<>();
        for(User user: users){
            TimesheetUser timesheetUser = timesheetUserRepository.findByTimesheetAndUser(timesheet, user);

            if(timesheetUser == null){
                timesheetUser = TimesheetUser.builder().timesheet(timesheet).user(user).build();
                timesheetUserRepository.save(timesheetUser);
            }
            allTimesheetUser.add(timesheetUser);
        }

        if(fetchedTimesheet != null){
            List<TimesheetUser> timesheetUsers = timesheetUserRepository.findByTimesheet(fetchedTimesheet);
            Iterator<TimesheetUser> it = timesheetUsers.iterator();
            while (it.hasNext()){
                TimesheetUser timesheetUser = it.next();
                if(!users.contains(timesheetUser.getUser())){
                    timesheetUserRepository.delete(timesheetUser);
                    it.remove();
                }
            }
        }
        return allTimesheetUser;
    }
    public List<TimesheetChantier> buildTimesheetChantierWithChantierListAndTimesheet(Timesheet timesheet, List<Chantier> chantiers, Timesheet fetchedTimesheet){
        List<TimesheetChantier> allTimesheetChantier = new ArrayList<>();
        for(Chantier chantier: chantiers){
            TimesheetChantier timesheetChantier = timesheetChantierRepository.findByChantierAndTimesheet(chantier, timesheet);
            if(timesheetChantier == null){
                timesheetChantier = TimesheetChantier.builder().timesheet(timesheet).chantier(chantier).build();
                timesheetChantierRepository.save(timesheetChantier);
            }
            allTimesheetChantier.add(timesheetChantier);
        }
        if(fetchedTimesheet != null) {
            List<TimesheetChantier> timesheetChantiers = timesheetChantierRepository.findByTimesheet(fetchedTimesheet);
            Iterator<TimesheetChantier> allTCit = timesheetChantiers.iterator();
            while (allTCit.hasNext()) {
                TimesheetChantier timesheetChantier = allTCit.next();
                if (!chantiers.contains(timesheetChantier.getChantier())) {
                    timesheetChantierRepository.delete(timesheetChantier);
                    allTCit.remove();

                }
            }
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
        Date heureDebutPause = null;
        Date heureFinPause = null;
        if(!StringUtils.isEmpty(timesheetDTO.getHeureDebutPauseStr()) && !StringUtils.isEmpty(timesheetDTO.getHeureFinPauseStr())) {
            heureDebutPause = formatHeures.parse(timesheetDTO.getHeureDebutPauseStr());
            heureFinPause = formatHeures.parse(timesheetDTO.getHeureFinPauseStr());
        }
        Client client = clientRepository.findByNom(timesheetDTO.getNomClient());
        Chantier chantier = chantierRepository.findByNom(timesheetDTO.getNomChantier());

        Integer id = timesheetDTO.getId();
        if(id != null && id == 0){
            id = null;
        }
        Timesheet resTimesheet = Timesheet.builder()
                .client(client)
                .date(dateTimesheet)
                .heureDebut(heureDebut)
                .heureFin(heureFin)
                .heurePauseDebut(heureDebutPause)
                .heurePauseFin(heureFinPause)
                .facturee(timesheetDTO.isFacturee())
                .observations(timesheetDTO.getObservations())
                .active(timesheetDTO.isActive())
                .id(id)
                .build();

        return resTimesheet;
    }

    @Override
    public TimesheetDTO mapTimesheetToTomesheetDTO(Timesheet timesheet) {
        SimpleDateFormat formatDateTimesheet = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat formatHeures = new SimpleDateFormat("kk:mm");
        String dateTimesheet = formatDateTimesheet.format(timesheet.getDate());
        String heureDebut = formatHeures.format(timesheet.getHeureDebut());
        String heureFin = formatHeures.format(timesheet.getHeureFin());
        String heureDebutPause = "";
        String heureFinPause = "";
        if(timesheet.getHeurePauseFin() != null && timesheet.getHeurePauseDebut() != null) {
            heureDebutPause = formatHeures.format(timesheet.getHeurePauseDebut());
            heureFinPause = formatHeures.format(timesheet.getHeurePauseFin());
        }

        List<Chantier> chantiers = findChantiersByTimesheetId(timesheet.getId());
        String nomsChantiers = "";
        for(Chantier chantier: chantiers){
            String separator = "-";
            if(StringUtils.isEmpty(nomsChantiers)){
                separator = "";
            }

            nomsChantiers = nomsChantiers + separator + chantier.getNom();

        }
        return TimesheetDTO.builder().
                id(timesheet.getId()).
                nomClient(timesheet.getClient().getNom())
                .nomChantier(nomsChantiers)
                .nomUtilisateur(timesheet.getUser().getFirstname() + " " + timesheet.getUser().getLastname())
                .dateStr(dateTimesheet)
                .heureDebutStr(heureDebut)
                .heureFinStr(heureFin)
                .heureDebutPauseStr(heureDebutPause)
                .heureFinPauseStr(heureFinPause)
                .idUser(timesheet.getUser().getId())
                .active(timesheet.isActive())
                .facturee(timesheet.isFacturee())
                .observations(timesheet.getObservations())
                .build();
    }

    @Override
    public List<TimesheetDTO> findAllTimesheetDTO() {
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        return timesheetList.stream()
                .filter(Timesheet::isActive)
                .sorted((x,y) -> y.getDate().compareTo(x.getDate()) )
                .map(aTimesheet -> mapTimesheetToTomesheetDTO(aTimesheet))
                .collect(Collectors.toList());
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

    private List<User> findUsersByTimesheetId(Integer timesheetId){
        Timesheet timesheet = timesheetRepository.findById(timesheetId);
        List<TimesheetUser> allTimesheetUsers = timesheetUserRepository.findByTimesheet(timesheet);
        List<User> allUsers = new ArrayList<>();
        for(TimesheetUser tu: allTimesheetUsers){
            allUsers.add(tu.getUser());
        }
        return allUsers;
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
        String heureDebutPause = "";
        String heureFinPause = "";
        if(recordArray[8] != null && recordArray[9] != null) {
            heureDebutPause = mapTimeToString((Time) recordArray[8]);
            heureFinPause = mapTimeToString((Time) recordArray[9]);
        }
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
        List<User> users = findUsersByTimesheetId((Integer)recordArray[14]);
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
                    .idUser((Integer) recordArray[15])
                    .observations((String) recordArray[16])
                    .active((boolean) recordArray[17])
                    .facturee((boolean) recordArray[18])
                    .ouvriersPresents(users)
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
                    .idUser((Integer) recordArray[15])
                    .observations((String) recordArray[16])
                    .active((boolean) recordArray[17])
                    .facturee((boolean) recordArray[18])
                    .ouvriersPresents(users)
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

    @Override
    public void deleteTimesheet(Integer timesheetId) {
        Timesheet timesheet = timesheetRepository.findById(timesheetId);
        if(timesheet != null){
            timesheet.setActive(false);
            timesheetRepository.save(timesheet);
        }
    }
}
