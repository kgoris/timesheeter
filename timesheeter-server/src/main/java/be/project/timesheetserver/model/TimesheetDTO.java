package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimesheetDTO {
    private Integer id;
    private String dateStr;
    private String heureDebutStr;
    private String heureFinStr;
    private String heureDebutPauseStr;
    private String heureFinPauseStr;
    private String nomClient;
    private String nomChantier;
    private String nomUtilisateur;
    private String numeroSemaine;
    private String debutSemaine;
    private String finSemaine;
    private String mois;
    private String annee;
    private String totalHeures;
    private String observations;
    private List<Chantier> chantiers;
}
