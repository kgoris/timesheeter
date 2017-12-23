package be.project.timesheetserver.service;

import be.project.timesheetserver.model.User;

import java.util.List;

/**
 * Created by fan.jin on 2016-10-15.
 */
public interface UserService {
    void resetCredentials();
    User findById(Long id);
    User findByUsername(String username);
    List<User> findAll();
}
