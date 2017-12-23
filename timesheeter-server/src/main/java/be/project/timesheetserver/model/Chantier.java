package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="CHANTIER",
        uniqueConstraints = @UniqueConstraint(columnNames = {"NOM"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chantier implements Serializable{

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="NOM")
    private String nom;
}
