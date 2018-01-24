package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.util.CollectionUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    private Double totalHeures;
    @Column(name="observations", columnDefinition="TEXT", length = 516)
    private String observations;

    @OneToMany(mappedBy="timesheet", cascade = CascadeType.ALL)
    private List<TimesheetChantier> timesheetChantiers;

    public void addTimesheetChantier(TimesheetChantier timesheetChantier){
        if(CollectionUtils.isEmpty(this.timesheetChantiers)){
            this.timesheetChantiers = new ArrayList<>();
        }
        this.timesheetChantiers.add(timesheetChantier);
    }

    @OneToMany(mappedBy = "timesheet", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SELECT)
    private List<TimesheetUser> timesheetUsers;
}
