package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Created by kevgo on 24-01-18.
 */
@Entity
@Table(name="TIMESHEETUSER")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimesheetUser {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="TIMESHEETID")
    private Timesheet timesheet;

    @ManyToOne
    @JoinColumn(name="USERID")
    private User user;
}
