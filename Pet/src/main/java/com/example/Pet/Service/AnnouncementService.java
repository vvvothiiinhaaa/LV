package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Announcement;
import com.example.Pet.Repository.AnnouncementRepository;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Announcement createAnnouncement(String content) {
        Announcement announcement = new Announcement();
        announcement.setContent(content);
        return announcementRepository.save(announcement);
    }

    public boolean deleteAnnouncement(Integer id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
