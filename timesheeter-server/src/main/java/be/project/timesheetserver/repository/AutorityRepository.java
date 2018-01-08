package be.project.timesheetserver.repository;

import be.project.timesheetserver.model.Authority;
import be.project.timesheetserver.model.Chantier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.util.List;

public interface AutorityRepository extends JpaRepository<Authority, Integer> {

    @Query(value = "select ua.authority_id " +
            "FROM user_authority ua " +
            "where ua.user_id=:id ", nativeQuery = true)
    List<BigInteger> findAutorityIdsByUserId(@Param("id") Integer id);

    Authority findById(Long id);
    Authority findByName(String name);

}
