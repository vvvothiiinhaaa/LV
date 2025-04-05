package com.example.Pet.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Announcement;
import com.example.Pet.Service.AnnouncementService;

@RestController
@RequestMapping("/admin")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAll() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @PostMapping("/announcement")
    public ResponseEntity<Announcement> create(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        return ResponseEntity.ok(announcementService.createAnnouncement(content));
    }

    @DeleteMapping("/announcement/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        boolean deleted = announcementService.deleteAnnouncement(id);
        if (deleted) {
            return ResponseEntity.ok().body("Xóa thành công");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
