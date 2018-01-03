package be.project.timesheetserver.rest;

import be.project.timesheetserver.model.User;
import be.project.timesheetserver.repository.ClientRepository;
import be.project.timesheetserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by fan.jin on 2016-10-15.
 */

@RestController
@RequestMapping( value = "/api", produces = MediaType.APPLICATION_JSON_VALUE )
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;

    @RequestMapping( method = GET, value = "/user/{userId}" )
    public User loadById( @PathVariable Integer userId ) {
        return this.userService.findById( userId );
    }

    @RequestMapping( method = GET, value= "/user/all")
    public List<User> loadAll() {
        return this.userService.findAll();
    }

    @PostMapping("/user/new")
    public void newUser(@RequestBody User user){
        this.userService.createUser(user);
    }

    @PostMapping("/user/update")
    public void updateUser(@RequestBody User user){
        this.userService.updateUser(user);
    }

    @RequestMapping( method = GET, value= "/user/reset-credentials")
    public ResponseEntity<Map> resetCredentials() {
        this.userService.resetCredentials();
        Map<String, String> result = new HashMap<>();
        result.put( "result", "success" );
        return ResponseEntity.accepted().body(result);
    }
    /*
     *  We are not using userService.findByUsername here(we could),
     *  so it is good that we are making sure that the user has role "ROLE_USER"
     *  to access this endpoint.
     */
    @RequestMapping("/whoami")
    public User user() {
        System.out.println("");
        return (User)SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

}
