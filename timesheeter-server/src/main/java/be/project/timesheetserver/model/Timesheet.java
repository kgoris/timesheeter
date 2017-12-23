package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="TIMESHEET")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timesheet {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="USERID")
    private User user;

    @ManyToOne
    @JoinColumn(name="CHANTIERID")
    private Chantier chantier;

    @ManyToOne
    @JoinColumn(name="CLIENTID")
    private Client client;

    @Temporal(TemporalType.DATE)
    private Date date;

    @Temporal(TemporalType.TIME)
    private Date heureDebut;

    @Temporal(TemporalType.TIME)
    private Date heureFin;

    @Temporal(TemporalType.TIME)
    private Date heurePauseDebut;

    @Temporal(TemporalType.TIME)
    private Date heurePauseFin;

}
