package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Integer>{
    Client findByNom(String nom);
}
