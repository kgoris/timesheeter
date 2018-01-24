package be.project.timesheetserver.service.impl;

import be.project.timesheetserver.model.Authority;
import be.project.timesheetserver.model.User;
import be.project.timesheetserver.repository.AutorityRepository;
import be.project.timesheetserver.repository.UserRepository;
import be.project.timesheetserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;

/**
 * Created by fan.jin on 2016-10-15.
 */

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AutorityRepository autorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void resetCredentials() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setPassword(passwordEncoder.encode("123"));
            userRepository.save(user);
        }
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public User findByUsername( String username ) throws UsernameNotFoundException {
        User u = userRepository.findByUsername( username );
        return u;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public User findById( Integer id ) throws AccessDeniedException {
        User u = userRepository.findOne( id );
        return u;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> findAll() throws AccessDeniedException {
        List<User> result = userRepository.findAll();
        return result;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Authority authority = autorityRepository.findByName("ROLE_USER");
        user.addAuthority(authority);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void updateUser(User user) {
        User fetchedUser = this.findById(user.getId());
        if(fetchedUser != null){
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            if(!fetchedUser.getPassword().equals(passwordEncoder.encode(user.getPassword()))){
                user.setPassword(encodedPassword);
            }

            fetchedUser.setFirstname(user.getFirstname());
            fetchedUser.setLastname(user.getLastname());
            fetchedUser.setUsername(user.getUsername());
            fetchedUser.setActive(user.getActive());

           /* List<BigInteger> autorityIds = autorityRepository.findAutorityIdsByUserId(user.getId());
            for(BigInteger autorityId : autorityIds){
                Authority authority = autorityRepository.findById(Long.valueOf(autorityId.toString()));
                user.addAuthority(authority);
            }*/
            userRepository.save(fetchedUser);
        }

    }


}
