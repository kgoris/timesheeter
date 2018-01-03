package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Chantier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChantierRepository extends JpaRepository<Chantier, Integer> {
    Chantier findByNom(String nom);
    Chantier findById(Integer id);
}
