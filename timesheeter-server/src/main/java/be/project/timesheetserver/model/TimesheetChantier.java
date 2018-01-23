package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Created by kevgo on 23-01-18.
 */
@Entity
@Table(name="TIMESHEETCHANTIER")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimesheetChantier {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="CHANTIERID")
    private Chantier chantier;

    @ManyToOne
    @JoinColumn(name="TIMESHEETID")
    private Timesheet timesheet;

}
