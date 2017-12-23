package be.project.timesheetserver.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "CLIENT",
uniqueConstraints = @UniqueConstraint(columnNames = {"NOM"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client implements Serializable{
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="NOM")
    private String nom;

    @Column(name="RUE")
    private String rue;

    @Column(name="CODEPOSTAL")
    private String codePostal;

    @Column(name="VILLE")
    private String ville;

    @Column(name="PAYS")
    private String pays;

    @Column(name="TVA")
    private String numTva;
}
