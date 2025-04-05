package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.UserWarningLog;
import com.example.Pet.Repository.UserWarningLogRepository;

@RestController
@RequestMapping("/api/warnings")
public class WarningController {

    @Autowired
    private UserWarningLogRepository warningLogRepository;

    @GetMapping
    public List<UserWarningLog> getAllWarnings() {
        return warningLogRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<UserWarningLog> getWarningsByUser(@PathVariable Long userId) {
        return warningLogRepository.findByUserId(userId);
    }
}
