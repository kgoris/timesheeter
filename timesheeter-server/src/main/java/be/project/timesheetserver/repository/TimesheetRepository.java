package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimesheetRepository extends JpaRepository<Timesheet, Integer> {
    @Query(value = "select t.date, MONTH(t.date), YEAR(t.date), WEEK(t.date), SUBDATE(t.date, WEEKDAY(t.date)), ADDDATE(t.date, 6 - WEEKDAY(t.date)), t.heure_debut, t.heure_fin, t.heure_pause_debut, t.heure_pause_fin, t.total_heures, c.nom as clientNom, u.firstname, u.lastname, t.id " +
            "FROM timesheet as t, user as u, client as c " +
            "where u.id=t.userid " +
            "and c.id = t.clientid " +
            "and u.id = :id " +
            "ORDER BY t.date DESC ", nativeQuery = true)
    List<Object> findByUser(@Param("id") Integer id);

    @Query(value = "select t.date, MONTH(t.date), YEAR(t.date), WEEK(t.date), SUBDATE(t.date, WEEKDAY(t.date)), ADDDATE(t.date, 6 - WEEKDAY(t.date)), t.heure_debut, t.heure_fin, t.heure_pause_debut, t.heure_pause_fin, t.total_heures, c.nom as clientNom, u.firstname, u.lastname, t.id " +
            "FROM timesheet as t, user as u, client as c, chantier as ch " +
            "where u.id=t.userid " +
            "and c.id = t.clientid " +
            "and ch.id = :nomchantier " +
            "ORDER BY t.date DESC ", nativeQuery = true)
    List<Object> findByChantier(@Param("nomchantier") String nomChantier );

    @Query(value = "select t.date, MONTH(t.date), YEAR(t.date), WEEK(t.date), SUBDATE(t.date, WEEKDAY(t.date)), ADDDATE(t.date, 6 - WEEKDAY(t.date)), t.heure_debut, t.heure_fin, t.heure_pause_debut, t.heure_pause_fin, t.total_heures, c.nom as clientNom, u.firstname, u.lastname, t.id " +
            "FROM timesheet as t, user as u, client as c " +
            "where u.id=t.userid " +
            "and c.id = t.clientid " +
            "and c.nom = :nomclient " +
            "ORDER BY t.date DESC ", nativeQuery = true)
    List<Object> findByClient(@Param("nomclient") String nomClient);

    Timesheet findById(Integer id);
}
